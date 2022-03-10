/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex } from '@onidex-libs/uikit';
import { TradeType } from '@pancakeswap-libs/sdk-v2';
import { useLastTruthy } from 'hooks/useLast';
import { useUserSlippageTolerance } from 'state/user/hooks';
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { Field } from 'state/swap/actions'
import { ReactComponent as SwapIcon } from 'assets/images/swap/exchange-alt-solid.svg'
import { ONE_BIPS, INITIAL_ALLOWED_SLIPPAGE } from '../../../constants';
import { Label, PriceListCard } from '../SwapComponents';

const StyledSwapIcon = styled(SwapIcon)`
    margin-left: 8px;
    cursor: pointer;
`;

const TradePriceLabel = styled(Label)`
    display: flex;
    align-items: center;
`;

const TradePrice = ({ price, showInverted, setShowInverted }) => {
    const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

    const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
    const label = showInverted
        ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
        : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`
        
    return (
        <TradePriceLabel fontSize='12px'>
            {show ? (
                <>
                {formattedPrice ?? '-'} {label}
                <StyledSwapIcon height='14px' onClick={() => setShowInverted(!showInverted)} />
                </>
            ) : (
                '-'
            )}
        </TradePriceLabel>
    )

};

const AdvancedSwapDetails = ({ trade, showWrap }) => {
    const lastTrade = useLastTruthy(trade);
    const swapTrade = trade ?? lastTrade ?? undefined;
    const [allowedSlippage] = useUserSlippageTolerance()
    const [showInverted, setShowInverted] = useState<boolean>(false)

    const showRoute = Boolean(swapTrade && swapTrade.route.path.length > 2)

    const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(swapTrade)
    const isExactIn = swapTrade && swapTrade.tradeType === TradeType.EXACT_INPUT
    const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(swapTrade, allowedSlippage)

    return (swapTrade ?
        <PriceListCard>
            {!showWrap && 
                <>
                    <Flex justifyContent='space-between'>
                        <Label fontSize='12px'>Price</Label>
                        <TradePrice
                            price={swapTrade?.executionPrice}
                            showInverted={showInverted}
                            setShowInverted={setShowInverted}
                        />
                        {/* <Label fontSize='12px'>~ $0.00</Label> */}
                    </Flex>
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                        <Flex justifyContent='space-between'>
                            <Label fontSize='12px'>Slippage Tolerance</Label>
                            <Label fontSize='12px'>{allowedSlippage / 100}%</Label>
                        </Flex>
                    )}
                </>
            }
            <Flex justifyContent='space-between' margin='6px 0'>
                <Label fontSize='12px'>Price Impact</Label>
                <Label fontSize='12px' error={!!warningSeverity(priceImpactWithoutFee)}>
                    {priceImpactWithoutFee ? (priceImpactWithoutFee.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpactWithoutFee.toFixed(2)}%`) : '-'}
                </Label>
            </Flex>
            <Flex justifyContent='space-between'>
                <Label fontSize='12px'>{isExactIn ? 'Minimum Received' : 'Maximum Sold'}</Label>
                <Label fontSize='12px'>{isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${swapTrade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${swapTrade.inputAmount.currency.symbol}` ??
                  '-'}</Label>
            </Flex>
        </PriceListCard>
        : <div />
    )
};

export default AdvancedSwapDetails;