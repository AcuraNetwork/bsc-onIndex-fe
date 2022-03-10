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
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import Input from 'components/Input/Input';
import CurrencyLogo from 'components/CurrencyLogo';
import { 
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from 'state/swap/hooks';
import { Field } from 'state/swap/actions'
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
import multicall from 'utils/multicall'
import confirmPriceImpactWithoutFee from './confirmPriceImpactWithoutFee';
import AdvancedSwapDetails from './AdvancedSwapDetails';
import LimitOrders from './LimitOrders/LimitOrders';
import { SwapButton, SwitchTokenHandler, FCard, Label, CopyRightLabel, PriceListCard, PlaceOrderButton, OrderCard, Form, ButtonMenuWrapper, StyledButtonMenuItem, OrderTypesWrapper, OrderTypeItem, Dropdown, InputWrapper, StyledUnlockButton, SocialLinks, HeaderText } from './SwapComponents';

const PolySwap = () => {
  const [tradeType, setTradeType] = useState(0);
  const [orderType, setOrderType] = useState(0);

  const handleClick = index => {
    setTradeType(index);
  };

  const handleChangeOrderType = index => {
    setOrderType(index);
  }


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
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo();

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

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
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
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

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
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

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

  const handleInputChange = event => {
    onUserInput(Field.INPUT, event.target.value);
  };

  const handleOutputChange = event => {
    onUserInput(Field.OUTPUT, event.target.value);
  };


	return (
		<FCard>
            <div>
                <Flex justifyContent='center' mb='16px' mt='16px'>
                    <HeaderText fontSize='20px'>ACURA SWAP</HeaderText>
                </Flex>
                <Form>
                <div className="polyswap_input">
                    <Label fontSize='14px'>{`Pay ${independentField === Field.OUTPUT && !showWrap && trade ? '(estimated)' : ''}`}</Label>
                    {/* <input type="number" placeholder="100.08" step="0.01" /> */}
                    <InputWrapper>
                        <Input
                            placeholder='Price'
                            className='balance-input'
                            value={formattedAmounts[Field.INPUT]}
                            onChange={handleInputChange}
                            endAdornment= {
                                <Dropdown onClick={onPayPresetSearchModal}>
                                    <button className="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown">
                                    {currencies[Field.INPUT] ?
                                        <>
                                        {currencies[Field.INPUT].symbol === 'MATIC' ? <img src='/images/swap/matic.svg' alt="matic" />
                                            : <CurrencyLogo currency={currencies[Field.INPUT]} size='18px' />
                                        }
                                        {/* <img src='/images/swap/matic.svg' alt="matic" /> */}
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
                </div>
                <Flex
                    justifyContent='center' 
                    margin='32px 0 24px'>
                    <SwitchTokenHandler 
                        onClick={() => {
                            onSwitchTokens()
                        }} >            
                        <img src='/images/swap/swap.svg' alt="swap" />
                    </SwitchTokenHandler>
                </Flex>
                <div className="polyswap_input">
                    <Label fontSize='14px'>{`Receive ${independentField === Field.INPUT && !showWrap && trade ? '(estimated)' : ''}`}</Label>
                    <InputWrapper>
                    <Input
                        placeholder='Price'
                        className='balance-input'
                        value={formattedAmounts[Field.OUTPUT]}
                        onChange={handleOutputChange}
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
                <Flex mt='24px' mb='24px'>
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
                                : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
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
                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`)}
                    </SwapButton>
                    // <SwapButton             
                    //   disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                    //   variant='secondary' 
                    //   size='sm'>
                    //   Swap
                    // </SwapButton>
                    :
                    <StyledUnlockButton variant='secondary' size='sm' />
                    }
                </Flex>
                <AdvancedSwapDetails 
                    showWrap={showWrap}
                    trade={trade} />
                </Form>
            </div>

			{/* Order or Buy Sell Card */}
            <OrderCard>
                <ButtonMenuWrapper justifyContent='center' mb='24px'>
                    <ButtonMenu activeIndex={tradeType} variant="subtle" onClick={handleClick}>
                        <StyledButtonMenuItem active={tradeType === 0}>
                            Buy
                        </StyledButtonMenuItem>
                        <StyledButtonMenuItem active={tradeType === 1}>
                            Sell
                        </StyledButtonMenuItem>
                    </ButtonMenu>
                </ButtonMenuWrapper>
                <OrderTypesWrapper justifyContent='center' mb='24px'>
                    <ButtonMenu activeIndex={orderType} variant="subtle" onClick={handleChangeOrderType}>
                        <OrderTypeItem active={orderType === 0}>
                            Limit
                        </OrderTypeItem>
                        <OrderTypeItem active={orderType === 1}>
                            Market
                        </OrderTypeItem>
                        <OrderTypeItem active={orderType === 2}>
                            Stop-Limit
                        </OrderTypeItem>
                    </ButtonMenu>
                </OrderTypesWrapper>
                <LimitOrders />
                {/* <InputWrapper mb='8px'>
                    <Input
                        placeholder='Price'
                        className='balance-input'
                        endAdornment={
                            <Dropdown>
                                <span>USDT</span>
                            </Dropdown>
                        }
                    />
                </InputWrapper>
                <InputWrapper>
                    <Input
                        placeholder='Amount'
                        className='balance-input'
                        // endAdornment='MATIC'
                        endAdornment={
                            <Dropdown>
                                <span>BNB</span>
                            </Dropdown>
                        }
                    />
                </InputWrapper>
                <PlaceOrderButton variant='secondary' width='100%' size='sm' mt='24px'>Place Order</PlaceOrderButton> */}
                <Flex flexDirection='column' alignItems='center' mt='160px'>
                    <SocialLinks justifyContent='center' mb='8px'>
                        <a href="https://telegram.org/" target="_blank" rel="noreferrer">
                            <img src='/images/swap/telegram.svg' alt="telegram" />
                        </a>
                        <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                            <img src='/images/swap/twitter.svg' alt="twitter" />
                        </a>
                        <a href="https://mail.google.com/" target="_blank" rel="noreferrer">
                            <img src='/images/swap/mail.svg' alt="mail" />
                        </a>
                    </SocialLinks>
                    <CopyRightLabel fontSize='14px'>COPYRIGHT © 2021 OniDex</CopyRightLabel>
                </Flex>
			</OrderCard>
		</FCard>
	)
}

export default PolySwap
