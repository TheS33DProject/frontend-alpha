import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { CurrencyAmount, SwapParameters } from '@pancakeswap/sdk'
import { TranslateFunction, useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useGasPrice } from 'state/user/hooks'
import truncateHash from 'utils/truncateHash'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress } from '../utils'
import isZero from '../utils/isZero'
import { useIdoCallArguments } from './useIdoCallArguments'

export enum IdoCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface IdoCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall extends IdoCallEstimate {
  gasEstimate: BigNumber
}

interface FailedCall extends IdoCallEstimate {
  error: string
}

interface IdoCallEstimate {
  call: IdoCall
}

// returns a function that will execute a swap, if the parameters are all valid
export function useIdoCallback(
  parsedAmounts: { INPUT: CurrencyAmount; OUTPUT: CurrencyAmount } | undefined, // s33d to buy, required
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): { state: IdoCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const gasPrice = useGasPrice()

  // console.log("useIdoCallback:", parsedAmounts ? parsedAmounts.OUTPUT : undefined)
  const idoCalls = useIdoCallArguments(parsedAmounts ? parsedAmounts.OUTPUT : undefined, recipientAddress)
  // console.log('idoCalls:', idoCalls)
  const { t } = useTranslation()

  const addTransaction = useTransactionAdder()

  const recipient = recipientAddress === null ? account : recipientAddress

  return useMemo(() => {
    if (!parsedAmounts || !library || !account || !chainId) {
      return { state: IdoCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: IdoCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: IdoCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: IdoCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: IdoCallEstimate[] = await Promise.all(
          idoCalls.map((call) => {
            const {
              parameters: { methodName, args },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: t('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)

                    return { call, error: swapErrorToUserReadableMessage(callError, t) }
                  })
              })
          }),
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw new Error(errorCalls[errorCalls.length - 1].error)
          throw new Error(t('Unexpected error. Could not estimate gas for the swap.'))
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          gasPrice,
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = parsedAmounts.INPUT.currency.symbol
            const outputSymbol = parsedAmounts.OUTPUT.currency.symbol
            const inputAmount = parsedAmounts.INPUT.toSignificant(3)
            const outputAmount = parsedAmounts.OUTPUT.toSignificant(3)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddress && isAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress
                  }`

            addTransaction(response, {
              summary: withRecipient,
              type: 'swap',
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(t('Swap failed: %message%', { message: swapErrorToUserReadableMessage(error, t) }))
            }
          })
      },
      error: null,
    }
  }, [library, account, chainId, parsedAmounts, recipient, recipientAddress, idoCalls, gasPrice, t, addTransaction])
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
function swapErrorToUserReadableMessage(error: any, t: TranslateFunction) {
  let reason: string | undefined
  while (error) {
    reason = error.reason ?? error.data?.message ?? error.message ?? reason
    // eslint-disable-next-line no-param-reassign
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substring('execution reverted: '.length)

  switch (reason) {
    case 'PancakeRouter: EXPIRED':
      return t(
        'The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.',
      )
    case 'PancakeRouter: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'PancakeRouter: EXCESSIVE_INPUT_AMOUNT':
      return t(
        'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.',
      )
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return t('The input token cannot be transferred. There may be an issue with the input token.')
    case 'Pancake: TRANSFER_FAILED':
      return t('The output token cannot be transferred. There may be an issue with the output token.')
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return t(
          'An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading.',
        )
      }
      return t('Unknown error%reason%. Try increasing your slippage tolerance.', {
        reason: reason ? `: "${reason}"` : '',
      })
  }
}
