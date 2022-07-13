import { Contract } from '@ethersproject/contracts'
import { CurrencyAmount, SwapParameters } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from 'utils/formatBalance'
import { getInitialS33DRoundContract } from 'utils/exchange'

interface IdoCall {
  contract: Contract
  parameters: SwapParameters
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param amount s33d to buy
 * @param recipientAddress recipient address - not used by InitialS33DRound
 */
export function useIdoCallArguments(
  amount: CurrencyAmount | undefined, // s33d to buy, required
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): IdoCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const recipient = recipientAddress === null ? account : recipientAddress
  // console.log(
  //   'useIdoCallArguments - amount:',
  //   amount ? amount.currency : undefined,
  //   amount ? amount.toFixed() : undefined,
  // )
  return useMemo(() => {
    if (!amount || !recipient || !library || !account || !chainId) return []

    const contract = getInitialS33DRoundContract(chainId, library, account)
    if (!contract) {
      return []
    }

    const swapMethods = []

    const hexAmount = `0x${getDecimalAmount(new BigNumber(amount.toExact())).toString(16)}`
    swapMethods.push({ methodName: 'buyS33D', args: [hexAmount], value: '0x0' })
    // console.log('useIdoCallArguments - swapMethods:', swapMethods)

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, chainId, library, recipient, amount])
}
