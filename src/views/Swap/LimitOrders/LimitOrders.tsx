/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/react-in-jsx-scope */
// @ts-nocheck
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Flex, ButtonMenu, useModal } from '@onidex-libs/uikit';
import { CurrencyAmount, JSBI, Token, Trade } from '@pancakeswap-libs/sdk-v2'
import ReactGA from 'react-ga'
import { useActiveWeb3React } from 'hooks'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal';
import Input from 'components/Input/Input';
import CurrencyLogo from 'components/CurrencyLogo';
import { 
  useDefaultsFromURLSearch,
  useDerivedLimitOrdersInfo,
  useLimitOrdersActionHandlers,
  useLimitOrdersState
} from 'state/limitOrders/hooks';
import { Field } from 'state/limitOrders/actions'
import { usePriceBnbBusd } from 'state/hooks';
import useGetInputCurrencyUsd from 'hooks/useGetInputCurrencyUsd'

import { useCurrency } from 'hooks/useTokens';
import useENSAddress from 'hooks/useENSAddress'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import useToggledVersion, { Version } from 'hooks/useToggledVersion'
import { useSwapCallback } from 'hooks/useSwapCallback';
import { useExpertModeManager, useUserSlippageTolerance } from 'state/user/hooks'
import { warningSeverity, computeTradePriceBreakdown } from 'utils/prices';
import { maxAmountSpend } from 'utils/maxAmountSpend';
import Loader from 'components/Loader'
import confirmPriceImpactWithoutFee from './confirmPriceImpactWithoutFee';
import { SwapButton, SwitchTokenHandler, FCard, Label, CopyRightLabel, PriceListCard, PlaceOrderButton, OrderCard, Form, ButtonMenuWrapper, StyledButtonMenuItem, OrderTypesWrapper, OrderTypeItem, Dropdown, InputWrapper, StyledUnlockButton, SocialLinks, HeaderText } from '../SwapComponents';
// import AutoHistory from './AutoHistory';

const LimitOrders: FC<{bigPanel?: boolean, swapPage?: boolean}> = ({ bigPanel, swapPage }) => {
  // swap
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account } = useActiveWeb3React()
  const { ethereum } = window;

  // toggle wallet when disconnected
  // const toggleWalletModal = useWalletModalToggle() // ANT TOUCH

  // for expert mode
  // const toggleSettings = useToggleSettingsMenu() // ANT TOUCH
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useLimitOrdersState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedLimitOrdersInfo();

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const tradesByVersion = {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade
  }
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion]

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  
  const [outputMinAmount, setOutputMinAmount] = useState<string>('')
  const [limitOrderPrice, setLimitOrderPrice] = useState<string>('')
  const [inputFocused, setInputFocused] = useState<boolean>(true)

  const limitOrderMarketStats = useMemo(() => {
    const marketOutput = trade?.outputAmount.toExact()
    if (marketOutput && outputMinAmount) {
        return (Number(outputMinAmount) - Number(marketOutput)) * 100 / Number(marketOutput);
    }
    return 0;
  }, [trade, outputMinAmount])

  const inputCurrencyUsd = useGetInputCurrencyUsd(currencies[Field.INPUT])
  const outputCurrencyUsd = useGetInputCurrencyUsd(currencies[Field.OUTPUT])
  const bnbPriceUsd = usePriceBnbBusd();
  const inputCurrencyInUsd = currencies[Field.INPUT]?.symbol === 'BNB' ? bnbPriceUsd?.toNumber() : inputCurrencyUsd
  const outputCurrencyInUsd = currencies[Field.OUTPUT]?.symbol === 'BNB' ? bnbPriceUsd?.toNumber() : outputCurrencyUsd

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useLimitOrdersActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, true)

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
  // const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient, 'limit-order', outputMinAmount)


  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            // eslint-disable-next-line no-nested-ternary
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol
          ].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  const [onPayPresetSearchModal] = useModal(<CurrencySearchModal selectedCurrency={currencies[Field.INPUT]} onCurrencySelect={handleInputSelect} />);
  const [onReceivePresetSearchModal] = useModal(<CurrencySearchModal selectedCurrency={currencies[Field.OUTPUT]} onCurrencySelect={handleOutputSelect} />);

  // const handleInputChange = event => {
  //   onUserInput(Field.INPUT, event.target.value);
  // };

  const handleTypeInput = useCallback(
    (value: string) => {
        onUserInput(Field.INPUT, value)
        setInputFocused(true)
    },
    [onUserInput, setInputFocused]
)

  const handleOutputChange = event => {
    onUserInput(Field.OUTPUT, event.target.value);
  };

  const onLimitOrderValuesChange = (source: string, value: string) => {
    setInputFocused(false)
    if (source === 'price') {
        setLimitOrderPrice(value)
        const outputAmount = Number(value) * Number(formattedAmounts[Field.INPUT])
        setOutputMinAmount(outputAmount.toString())
    } else if (source === 'output') {
        setOutputMinAmount(value)
        const price = Number(value) / Number(formattedAmounts[Field.INPUT])
        // eslint-disable-next-line no-restricted-globals
        setLimitOrderPrice(price === Infinity || isNaN(price) ? '' : price.toFixed(2))
    }
}

  // const handleRateChange = () => {
  //   console.log('ant : rate change');
  // };

  const realPriceValue = useMemo(() => {
    if (inputFocused) {
        const price = Number(formattedAmounts[Field.OUTPUT]) / Number(formattedAmounts[Field.INPUT])
        // eslint-disable-next-line no-restricted-globals
        return price === Infinity || isNaN(price) ? '' : price.toFixed(2)
    }
    return limitOrderPrice
  }, [inputFocused, limitOrderPrice, formattedAmounts])

  const realOutputValue = useMemo(() => inputFocused ? formattedAmounts[Field.OUTPUT] : outputMinAmount
  ,[inputFocused, formattedAmounts, outputMinAmount])


  const intRealOutputValue = formattedAmounts[Field.OUTPUT] === '' ? 0 : formattedAmounts[Field.OUTPUT]
  const txFeeCost = intRealOutputValue === 0 ? 0 : 0.00318

	return (
    // <div>
    <FCard bigPanel={bigPanel} swapPage={swapPage}>
      <Form>
        <div className="polyswap_input">
          <Flex justifyContent='space-between' alignItems="center">
            <Label fontSize="12px">
              {`From ${
                independentField === Field.OUTPUT && !showWrap && trade ? '(estimated)' : ''
              }`}
            </Label>
            <Dropdown onClick={onPayPresetSearchModal}>
              <button className="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown">
                {currencies[Field.INPUT] ? (
                  <>
                    {currencies[Field.INPUT].symbol === 'ETH' ? (
                      <img src="/images/swap/eth_trans.png" alt="eth" />
                    ) : (
                      <CurrencyLogo currency={currencies[Field.INPUT]} size="18px" />
                    )}
                    <span>
                      {`${
                        (currencies[Field.INPUT] &&
                        currencies[Field.INPUT].symbol &&
                        currencies[Field.INPUT].symbol.length > 20
                          ? `${currencies[Field.INPUT].symbol.slice(0, 4)}...${currencies[
                              Field.INPUT
                            ].symbol.slice(
                              currencies[Field.INPUT].symbol.length - 5,
                              currencies[Field.INPUT].symbol.length,
                            )}`
                          : currencies[Field.INPUT]?.symbol) || t('selectToken')
                      }`}{' '}
                      <i className="arrow down" />
                    </span>
                  </>
                ) : (
                  <span>
                    <Label fontSize="10px">Select a token</Label>
                    <i className="arrow down" />
                  </span>
                )}
              </button>
            </Dropdown>
          </Flex>
          <InputWrapper>
            <Input
              placeholder="0.00"
              className="balance-input"
              value={formattedAmounts[Field.INPUT]}
              // onChange={handleInputChange}
              onChange={event => handleTypeInput(event.target.value)}
              endAdornment={
                <p>~${inputCurrencyInUsd?.toFixed(3)}</p>
              }
            />
          </InputWrapper>
        </div>
      </Form>
      {/* <div className="polyswap_input">
        <Label fontSize='14px'>{`Pay ${independentField === Field.OUTPUT && !showWrap && trade ? '(estimated)' : ''}`}</Label>
        <InputWrapper>
          <Input
            type='number'
            placeholder='Price'
            className='balance-input'
            value={formattedAmounts[Field.INPUT]}
            onChange={event => handleTypeInput(event.target.value)}
            endAdornment= {
              <Dropdown onClick={onPayPresetSearchModal}>
                <button className="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown">
                {currencies[Field.INPUT] ?
                  <>
                    {currencies[Field.INPUT].symbol === 'MATIC' ? <img src='/images/swap/matic.svg' alt="matic" />
                        : <CurrencyLogo currency={currencies[Field.INPUT]} size='18px' />
                    }
                    <span>
                    {`${(currencies[Field.INPUT] && currencies[Field.INPUT].symbol && currencies[Field.INPUT].symbol.length > 20
                        ? `${currencies[Field.INPUT].symbol.slice(0, 4)  }...${  currencies[Field.INPUT].symbol.slice(currencies[Field.INPUT].symbol.length - 5, currencies[Field.INPUT].symbol.length)}`
                        : currencies[Field.INPUT]?.symbol) || t('selectToken')}`} <i className="arrow down" />
                    </span>
                  </>
                    :
                  <span>
                    <Label fontSize='10px'>Select a token</Label>
                    <i className="arrow down" />
                  </span>
                }
                </button>
              </Dropdown>
            }
          />
        </InputWrapper>
      </div> */}
      <div className="polyswap_input" style={{ margin: '16px 0'}}>
        <Label fontSize='12px'>Rate</Label>
          <InputWrapper>
            <Input
              type='number'
              placeholder='0.00'
              className='balance-input'
              value={realPriceValue}
              // value={formattedAmounts[Field.OUTPUT]}
              onChange={event => onLimitOrderValuesChange('price', event.target.value)}
              // onChange={handleRateChange}
              // endAdornment= { 
              //   <Dropdown onClick={onReceivePresetSearchModal}>
              //       <button className="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown">
              //       {currencies[Field.OUTPUT] ?
              //           <>
              //           {currencies[Field.OUTPUT].symbol === 'USDC' ? <img src='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' width={18} height={18} alt="usdc" />
              //               : <CurrencyLogo currency={currencies[Field.OUTPUT]} size='18px' />}
              //           {/* <img src='/images/swap/matic.svg' alt="matic" /> */}
              //           <span>
              //           {`${(currencies[Field.OUTPUT] && currencies[Field.OUTPUT].symbol && currencies[Field.OUTPUT].symbol.length > 20
              //               ? `${currencies[Field.OUTPUT].symbol.slice(0, 4)  }...${  currencies[Field.OUTPUT].symbol.slice(currencies[Field.OUTPUT].symbol.length - 5, currencies[Field.OUTPUT].symbol.length)}`
              //               : currencies[Field.OUTPUT]?.symbol) || t('selectToken')}`} <i className="arrow down" />
              //           </span>
              //           </>
              //           : 
              //           <span>
              //           <Label fontSize='10px'>Select a token</Label>
              //           <i className="arrow down" />
              //           </span>
              //       }
              //       </button>
              //   </Dropdown>
              // }
            />
          </InputWrapper>
      </div>
      <div className="receive_token_wrapper">
        <div className="input_wrapper_to">
          <Label fontSize='12px'>{`Receive ${independentField === Field.INPUT && !showWrap && trade ? '(estimated)' : ''}`}</Label>
          <InputWrapper>
            <Input
              placeholder='Amount'
              type='number'
              className='balance-input'
              value={realOutputValue}
              // value={formattedAmounts[Field.OUTPUT]}
              onChange={event => onLimitOrderValuesChange('output', event.target.value)}
              // onChange={handleOutputChange}
              endAdornment= {
                <Dropdown onClick={onReceivePresetSearchModal}>
                    <button className="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown">
                    {currencies[Field.OUTPUT] ?
                        <>
                        {currencies[Field.OUTPUT].symbol === 'USDC' ? <img src='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' width={18} height={18} alt="usdc" />
                            : <CurrencyLogo currency={currencies[Field.OUTPUT]} size='18px' />}
                        {/* <img src='/images/swap/matic.svg' alt="matic" /> */}
                        <span>
                        {`${(currencies[Field.OUTPUT] && currencies[Field.OUTPUT].symbol && currencies[Field.OUTPUT].symbol.length > 20
                            ? `${currencies[Field.OUTPUT].symbol.slice(0, 4)  }...${  currencies[Field.OUTPUT].symbol.slice(currencies[Field.OUTPUT].symbol.length - 5, currencies[Field.OUTPUT].symbol.length)}`
                            : currencies[Field.OUTPUT]?.symbol) || t('selectToken')}`} <i className="arrow down" />
                        </span>
                        </>
                        : 
                        <span>
                        <Label fontSize='10px'>Select a token</Label>
                        <i className="arrow down" />
                        </span>
                    }
                    </button>
                </Dropdown>
              }
            />
          </InputWrapper>
        </div>
        {currencies[Field.OUTPUT] && <div className="token_info_wrapper">
          <Flex justifyContent='space-between'>
            <p className="name_text">Onidex</p>
            <p className="price_text">{realOutputValue}</p>
          </Flex>
          <Flex justifyContent='space-between'>
            <p className="name_text">Tx cost {txFeeCost}(~${(txFeeCost * bnbPriceUsd?.toNumber()).toFixed(2)})</p>
            <p className="name_text">~${(intRealOutputValue * outputCurrencyInUsd).toFixed(2)}</p>
          </Flex>
        </div>}
      </div>
      <Flex mt='24px' mb='0' style={{ width: '100%' }}>
        {account ? 
          noRoute && userHasSpecifiedInputOutput ? (
            <SwapButton 
              disabled 
              variant='secondary' 
              size='sm'>
              Insufficient liquidity for this trade.
            </SwapButton>
          )
        : 
        showApproveFlow ? (
          <div style={{width: '100%'}}>
            <SwapButton
                variant='secondary' 
                size='sm'
                onClick={approveCallback}
                disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                // variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            >
                {approval === ApprovalState.PENDING ? (
                <Flex gap="6px" justify="center">
                    Approving <Loader stroke="white" />
                </Flex>
                ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                'Approved'
                ) : (
                `Approve ${currencies[Field.INPUT]?.symbol}`
                )}
            </SwapButton>
            <SwapButton
                variant='secondary' 
                size='sm'
                onClick={() => {
                if (isExpertMode) {
                    handleSwap()
                } else {
                    setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    showConfirm: true,
                    txHash: undefined,
                    })
                  }
                }}
                id="swap-button"
                disabled={
                !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                }
                // variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
            >
                {priceImpactSeverity > 3 && !isExpertMode
                ? `Price Impact High`
                : `Place Limit Order${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
            </SwapButton>
          </div>
        )
        : 
        <SwapButton
            variant='secondary' 
            size='sm'
            onClick={() => {
            if (isExpertMode) {
                handleSwap()
            } else {
                setSwapState({
                tradeToConfirm: trade,
                attemptingTxn: false,
                swapErrorMessage: undefined,
                showConfirm: true,
                txHash: undefined,
                })
            }
            }}
            id="swap-button"
            disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
            // variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
        >
            {swapInputError ||
            (priceImpactSeverity > 3 && !isExpertMode
                ? `Price Impact Too High`
                : `Place Limit Order${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}
        </SwapButton>
        :
        <StyledUnlockButton variant='secondary' size='sm' />
      }
      </Flex>
      {/* <AutoHistory type="Limit" /> */}
      {/* <AdvancedSwapDetails 
          showWrap={showWrap}
          trade={trade} /> */}
    </FCard>
	)
}

export default LimitOrders;
