import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, Token, Trade } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  Flex,
  IconButton,
  ArrowForwardIcon,
  PackFilledIcon,
} from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'
import { useWeb3React } from '@web3-react/core'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import useS33DOfferInfos from 'hooks/useS33DOfferInfos'
import useS33DUserInfos from 'hooks/useS33DUserInfos'
import { S33DOfferInfos, S33DUserInfos } from 'utils/types'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { CurrencyLogo } from 'components/Logo'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import { Wrapper } from './components/styleds'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import ProgressSteps from './components/ProgressSteps'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromInitialS33DRound } from '../../hooks/useApproveCallback'
import { useIdoCallback } from '../../hooks/useIdoCallback'
import { Field } from '../../state/ido/actions'
import { useDefaultsFromURLSearch, useIdoSwapInfo, useIdoState } from '../../state/ido/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'
import { CurrencySelectButton, StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'
// import pageConfig from './components/config'

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: block;
      fill: white;
    }
  }
`

export default function Ido() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  // const { headingText } = pageConfig(t)
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )
  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })
  // connect to web3 wallet
  const { account, library } = useWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // get s33d round info
  const [s33dOfferInfos, setS33DOfferInfos] = useState<S33DOfferInfos>()
  const [s33dUserInfos, setS33DUserInfos] = useState<S33DUserInfos>()
  const isLoading = !s33dOfferInfos || !s33dUserInfos
  useS33DOfferInfos({ setCallback: setS33DOfferInfos })
  useS33DUserInfos({ account, library, setCallback: setS33DUserInfos })
  // console.log("s33dOfferInfos:",s33dOfferInfos)
  // console.log("s33dUserInfos:", s33dUserInfos, s33dOfferInfos)
  const s33drates = { of1s33d: 0.02, of1usdt: 50 }
  if (!isLoading) {
    const { offerPrice } = s33dOfferInfos
    s33drates.of1s33d = Number(formatBigNumberToFixed(offerPrice, 2))
    s33drates.of1usdt = 1 / Number(formatBigNumberToFixed(offerPrice, 2))
    //   console.log("buyLimit:", formatBigNumberToFixed(buyLimit,0))
    //   console.log("getPouchBalance:", formatBigNumberToFixed(getPouchBalance,0))
  }

  // offer price handling
  const [of1S33d, setOf1S33d] = useState(false)
  const handleClick = () => {
    setOf1S33d(!of1S33d)
  }

  // ido state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useIdoState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const {
    currencyBalances,
    parsedAmounts,
    currencies,
    idoTrade,
    inputError: swapInputError,
  } = useIdoSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, s33drates, recipient)
  // console.log("parsedAmounts:", parsedAmounts)
  // console.log('idoTrade:', idoTrade)
  const trade = idoTrade

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const isValid = !swapInputError
  // console.log('swapInputError:', swapInputError, isValid)
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  // console.log("dependent:", dependentField, dependentField === 'INPUT' ? loadedInputCurrency : loadedOutputCurrency)

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, Number(value).toFixed(0))
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, Number(value).toFixed(0))
    },
    [onUserInput],
  )

  // console.log('independent:', !parsedAmounts[independentField] ? 'undefined' : parsedAmounts )
  // console.log('dependent:', !parsedAmounts[dependentField] ? 'undefined' : parsedAmounts[dependentField].toFixed(0))
  const formattedAmounts = {
    [independentField]: Number(typedValue).toFixed(),
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }
  // console.log('formated amount:', formattedAmounts)

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  // check whether the user has approved InitialS33DRound on the input token
  // console.log('approval:', !isLoading ? parsedAmounts.INPUT.toFixed() : 'undefined')
  const [approval, approveCallback] = useApproveCallbackFromInitialS33DRound(parsedAmounts.INPUT)
  // console.log('Approval:', approval)
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: idoCallback, error: swapCallbackError } = useIdoCallback(parsedAmounts ?? undefined, recipient)

  const handleSwap = useCallback(() => {
    if (!idoCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    idoCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [idoCallback, tradeToConfirm])

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  // Explore updating buy limit quota after txhash produced
  // if (txHash) {
  //   useS33DUserInfos({ account, library, setCallback: setS33DUserInfos })
  // }

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />, false)

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toFixed(0))
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyOutput)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  return (
    <Page>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer>
            <StyledInputCurrencyWrapper>
              <AppBody>
                <CurrencyInputHeader title={t('S33D Initial Offer')} subtitle={t('First launch of S33D token')} />
                <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
                  <AutoColumn gap="sm">
                    <Flex mb="6px" alignItems="center" justifyContent="space-between">
                      <CurrencySelectButton
                        variant="light"
                        scale="sm"
                        // onClick={() => {
                        //   setApprovalSubmitted(false) // reset 2 step UI for approvals
                        //   onSwitchTokens()
                        // }}
                      >
                        <Text color="textSubtle" fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                          Available
                        </Text>
                      </CurrencySelectButton>
                      <Flex>
                        <Flex alignItems="center" justifyContent="space-between">
                          <PackFilledIcon />
                          <Text color="textSubtle" fontSize="14px" ml="6px">
                            {!isLoading
                              ? Number(formatBigNumberToFixed(s33dOfferInfos.getPouchBalance)).toLocaleString(locale)
                              : 0}{' '}
                            <b>S33D</b>
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <CurrencyInputPanel
                      label={independentField === Field.OUTPUT && trade ? t('From (estimated)') : t('From')}
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      disableCurrencySelect
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />

                    <AutoColumn justify="space-between">
                      <AutoRow justify="center" style={{ padding: '0 1rem' }}>
                        <SwitchIconButton
                          disabled
                          variant="light"
                          scale="sm"
                          onClick={() => {
                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                            onSwitchTokens()
                          }}
                        >
                          <ArrowDownIcon className="icon-down" color="primary" />
                        </SwitchIconButton>
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT && trade ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      disableCurrencySelect
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                      showProgress
                      buyLimit={!isLoading ? Number(formatBigNumberToFixed(s33dOfferInfos.buyLimit)) : 0}
                      whitelist={!isLoading ? Number(formatBigNumberToFixed(s33dUserInfos.getWhitelist)) : 0}
                      contribution={!isLoading ? Number(formatBigNumberToFixed(s33dUserInfos.contribution)) : 0}
                    />
                    <Flex mb="6px" alignItems="center" justifyContent="space-between">
                      <CurrencySelectButton
                        variant="light"
                        scale="sm"
                        onClick={() => {
                          handleClick()
                        }}
                      >
                        <Text color="textSubtle" fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                          Offer Price Now
                        </Text>
                      </CurrencySelectButton>
                      <Flex>
                        <Flex alignItems="center" justifyContent="space-between">
                          <CurrencyLogo size="24px" currency={currencies[Field.INPUT]} />
                          <Text color="textSubtle" fontSize="14px" ml="6px">
                            {isLoading
                              ? 0
                              : of1S33d
                              ? Number(1).toPrecision(3)
                              : Number(formatBigNumberToFixed(s33dOfferInfos.offerPrice))}
                          </Text>
                          <ArrowForwardIcon color="secondary" marginLeft="6px" marginRight="6px" />
                          <CurrencyLogo currency={currencies[Field.OUTPUT]} />
                          <Text color="textSubtle" fontSize="14px" ml="6px">
                            {isLoading
                              ? 0
                              : of1S33d
                              ? 1 / Number(formatBigNumberToFixed(s33dOfferInfos.offerPrice))
                              : Number(1).toPrecision(3)}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </AutoColumn>
                  <Box mt="0.25rem">
                    {!account ? (
                      <ConnectWalletButton width="100%" />
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <Button
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                          )}
                        </Button>
                        <Button
                          variant={isValid ? 'danger' : 'primary'}
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                              })
                              onPresentConfirmModal()
                            }
                          }}
                          width="48%"
                          id="swap-button"
                          disabled={!isValid || approval !== ApprovalState.APPROVED}
                        >
                          {t('Swap')}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        variant={isValid && !swapCallbackError ? 'primary' : 'danger'}
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              txHash: undefined,
                            })
                            onPresentConfirmModal()
                          }
                        }}
                        id="swap-button"
                        width="100%"
                        disabled={!isValid || !!swapCallbackError}
                      >
                        {swapInputError || t('Swap')}
                      </Button>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                  </Box>
                </Wrapper>
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
