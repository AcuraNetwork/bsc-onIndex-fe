import React from 'react';
import { Flex, Text, Button, SunIcon, MoonIcon } from '@onidex-libs/uikit';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import { usePriceCakeBusd, usePriceBnbBusd } from 'state/hooks';
import { getBalanceNumber } from 'utils/formatBalance';
import { useTokenBurnedBalance, useTokenTotalSupply } from 'hooks/useTokenBalance';
import useTheme from 'hooks/useTheme'
import useTokenData from 'hooks/useTokenData';
import { useAllTokenData } from 'state/info/hooks';
import { TokenUpdater } from 'state/info/updaters';
import useFetchedTokenDatas from 'state/info/queries/tokens/tokenData'
import CurrencySelector from './CurrencySelector';
import CardValue from './CardValue';

const TransactionHeader = ({ selectedCurrency, selectedTokenInfo, isMobile, onSetCurrency }) => {
  const cakePriceUsd = usePriceCakeBusd();
  const bnbPriceUsd = usePriceBnbBusd();
  const { isDark, toggleTheme } = useTheme()
  const tokenBurnedBalance = useTokenBurnedBalance(selectedCurrency ? selectedCurrency.address : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82');
  const tokenTotalSupply = useTokenTotalSupply(selectedCurrency ? selectedCurrency.address : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82');
  const circSupply = tokenTotalSupply ? tokenTotalSupply.minus(tokenBurnedBalance) : new BigNumber(0);
  const quoteTokenPrice = selectedTokenInfo ? selectedTokenInfo.quotePrice * bnbPriceUsd.toNumber() : cakePriceUsd;
  const marketCap = new BigNumber(quoteTokenPrice).times(circSupply);
  
  const d = new Date();
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const utcDate = Date.UTC(year, month, day) / 1000;
  const yesterdayDate = utcDate - (5 * 86400);

  const tokenData = useTokenData(selectedCurrency ? selectedCurrency.address : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', yesterdayDate);
  // const { error: tokenDataError, data: tokenData } = useFetchedTokenDatas(selectedCurrency ? [selectedCurrency.address] : ['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82']);
  const liquidity = (bnbPriceUsd.toNumber() > 0 && tokenData && tokenData.token.totalLiquidity) ?
    (tokenData.token.totalLiquidity / bnbPriceUsd.toNumber()) : 0;

  const tokenPrice = tokenData && tokenData.token ? parseFloat(tokenData.token.derivedUSD).toFixed(2) : 0;

  const tokenDayDataLength = tokenData && tokenData.token.tokenDayData ? tokenData && tokenData.token.tokenDayData.length : 0;

  const todayLiquidityUsd = (tokenData && tokenData.token.tokenDayData) ? parseFloat(tokenData.token.tokenDayData[tokenDayDataLength-1].totalLiquidityUSD) : 0;
  const yesterdayLiquidityUsd = (tokenData && tokenData.token.tokenDayData) ? parseFloat(tokenData.token.tokenDayData[tokenDayDataLength-2].totalLiquidityUSD) : 0;
  const changePercent = ((todayLiquidityUsd - yesterdayLiquidityUsd) / yesterdayLiquidityUsd) * 100;

  // console.log('ant : Math.floor((new Date()).getTime() / 1000) => ', utcDate, utcDate - 2 * 86400);

  return (
    <FCard isMobile={isMobile}>
      {/* <TokenUpdater /> */}
      {!isMobile &&
        <TopSection>
          <CurrencySelector 
              isMobile={false} 
              selectedCurrency={selectedCurrency} 
              onSetCurrency={onSetCurrency} />
          <TopActions>
            <StyledButton size='sm' variant='tertiary'><img src='/images/chart/watchlist.svg' alt='watchlist' /></StyledButton>
            <StyledButton size='sm' variant='tertiary'><img src='/images/chart/vote.svg' alt='vote' /></StyledButton>
            {/* <StyledButton size='sm' variant='tertiary' onClick={handleSwap}>Swap</StyledButton> */}
            <ThemeButton isMobile={false} variant="text" onClick={toggleTheme}>
              {/* alignItems center is a Safari fix */}
              <Flex alignItems="center">
                <SunIcon color={isDark ? "textSubtle" : "#FA5368"} width="24px" />
                <Text color="textDisabled" mx="4px">
                  /
                </Text>
                <MoonIcon color={isDark ? "#FA5368" : "textSubtle"} width="24px" />
              </Flex>
            </ThemeButton>
          </TopActions>
        </TopSection>
      }

      <DetailsContainer flexDirection={isMobile ? 'column' : 'row'} justifyContent='space-between' alignItems={isMobile ? 'flex-start' : 'center'}>
        <DetailsContent ml={!isMobile && '16px'} padding={isMobile && '16px'} isMobile={isMobile} flexDirection={isMobile ? 'column' : 'row'}  justifyContent='space-between' alignItems={isMobile ? 'flex-start' : 'center'}>
          <SubFlex>
            <TokenDetails isMobile={false} minW="140px">
              <StyledText fontSize='14px' color='primary'>Token</StyledText>
              <Label fontSize='14px'>{selectedCurrency ? selectedCurrency.name : 'BNB'}</Label>
            </TokenDetails>
            <TokenDetails isMobile={false}>
              <StyledText fontSize='14px' color='primary'>Price</StyledText>
              <Label fontSize='14px'>{`$${tokenPrice}`}</Label>  
            </TokenDetails>
            <TokenDetails isMobile={false} minW="140px">
              <StyledText fontSize='14px' color='primary'>Marketcap</StyledText>
              <StyledCardValue fontSize="14px" decimals={2} value={getBalanceNumber(new BigNumber(marketCap))} prefix="$" />
            </TokenDetails>
          </SubFlex>
          <SubFlex>
            <TokenDetails isMobile={false}>
              <StyledText fontSize='14px' color='primary'>Liquidity</StyledText>
              <StyledCardValue fontSize="14px" decimals={2} value={liquidity} suffix=" BNB" />
            </TokenDetails>
            <TokenDetails isMobile={false}>
              <StyledText fontSize='14px' color='primary'>24h Volume</StyledText>
              <StyledCardValue fontSize="14px" decimals={2} value={todayLiquidityUsd} prefix="$" />
            </TokenDetails>
            <TokenDetails isMobile={false}>
              <StyledText fontSize='14px' color='primary'>24 Change</StyledText>
              <PercentageValue fontSize='14px' plusValue={changePercent > 0}>{changePercent.toFixed(2)}%</PercentageValue>
              {/* <PercentCardValue plusValue={changePercent > 0} fontSize="14px" decimals={2} value={changePercent} suffix="%" prefix={changePercent > 0 ? '+' : ''} /> */}
            </TokenDetails>
          </SubFlex>
        </DetailsContent>
        <Actions>
          <StyledButton size='sm' variant='tertiary'><img src='/images/chart/like.png' alt='watchlist' /></StyledButton>
          <StyledButton size='sm' variant='tertiary'><img src='/images/chart/star.png' alt='vote' /></StyledButton>
          {/* <StyledButton size='sm' variant='tertiary' onClick={handleSwap}>Swap</StyledButton> */}
          <ThemeButton isMobile={false} variant="text" onClick={toggleTheme}>
            {/* alignItems center is a Safari fix */}
            <Flex alignItems="center">
              <SunIcon color={isDark ? "textSubtle" : "#FA5368"} width="24px" />
              <Text color="textDisabled" mx="4px">
                /
              </Text>
              <MoonIcon color={isDark ? "#FA5368" : "textSubtle"} width="24px" />
            </Flex>
          </ThemeButton>
        </Actions>
      </DetailsContainer> 
    </FCard>
  );
};

const FCard = styled.div<{ isMobile?: boolean }>`
  background: ${({ theme }) => theme.isDark ? '#0F0F0F' : '#fff'};
  border-radius: 12px;
  margin-bottom: 8px;
  width: 100%;
  display: flex;
  align-items: ${props => props.isMobile ? 'flex-start' : 'center'};
  margin-top: ${props => props.isMobile && '16px'};
  
  @media screen and (max-width: 1114px){
    /* flex-direction: column; */
    padding: 5px 0;
  }
  @media screen and (max-width: 989px){
    justify-content: space-around;
  }
`;

const StyledCardValue = styled(CardValue)`
  color: ${({ theme }) => theme.isDark ? '#C9C9C9' : '#452A7A'};
`;

const PercentCardValue = styled(CardValue)<{ plusValue?: boolean }>`
  color: ${({ plusValue }) => plusValue ? '#1BC870' : '#CF203C' };
`;

const PercentageValue = styled(Text)<{ plusValue?: boolean }>`
  color: ${({ plusValue }) => plusValue ? '#1BC870' : '#CF203C' };
`;

const Label = styled(Text)`
  color: ${({ theme }) => theme.isDark ? '#C9C9C9' : '#452A7A'};
`

const TokenDetails = styled.div<{ isMobile?: boolean, minW?: string }>`
  width: ${props => props.isMobile && '100%'};
  display: ${props => props.isMobile ? 'flex' : 'block'};
  justify-content: ${props => props.isMobile && 'space-between'};
  padding: ${props => props.isMobile ? 0 : '0 8px'};
  @media screen and (max-width: 1470px){
    min-width: 140px;
  }
`;

const DetailsContainer = styled(Flex)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 16px;
  }
  @media screen and (max-width: 1326px) {
    flex-direction: column;
  }
  @media screen and (max-width: 989px){
    width: 150px;
  }
  @media screen and (max-width: 768px) {
    width: 50%;
    padding-left: 0;
  }
  @media screen and (max-width: 575px) {
    width: 100%;
    padding-left: 10px 0;
    align-items: center;
  }
`;

const StyledButton = styled(Button)`
  font-weight: normal;
  // background: hsla(0,0%,100%,.15);
  background: #220E15;
  color: linear-gradient(90deg, #FA5368 1.83%, #CF203C 96.34%);
  margin-left: 8px;
  padding: 0;
  width: 32px;

  &:focus:not(:active) {
    box-shadow: none;
  }
`;

const ThemeButton = styled(Button)<{ isMobile?: boolean }>`
  font-weight: normal;
  border: none;
  margin-left: ${({ isMobile }) => isMobile ? 'auto' : '15px'};
  margin-right: ${({ isMobile }) => isMobile && 'auto'};
  margin-top:  ${({ isMobile }) => isMobile && '8px'};
  margin-bottom:  ${({ isMobile }) => isMobile && '8px'};
  height: 44px;
  padding: 0 12px;

  background-color: #1A1616;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: #1A1616;
  }
  &:focus:not(:active) {
    box-shadow: none;
  }
`;

const Actions = styled.div`
  margin-top: 16px; 
  width: 100%;
  display: flex;
  border-left: 1px solid #1A303A;
  padding-left: 8px;
  @media screen and (max-width: 1326px) {
    margin-top: 26px;
    border-left: none;
    display: none;
  }
  @media screen and (max-width: 575px) {
    display: flex;
    margin-top: 26px;
    border-left: none;
    margin-bottom: 0;
    margin-top: 0;
    width: unset;
    align-items: center;
    justify-content: center;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
    margin-top: 0;
    width: unset;
    align-items: center;
    justify-content: center;
  }
`;
const TopActions = styled.div`
  display: none;
  margin-top: 16px; 
  width: 100%;
  border-left: 1px solid #1A303A;
  padding-left: 8px;
  @media screen and (max-width: 1326px) {
    display: flex;
    margin-top: 10px;
    border-left: none;
    padding-left: 0px;
  }
  @media screen and (max-width: 768px) {
    border-left: none;
    margin-bottom: 0;
    width: unset;
    align-items: center;
    justify-content: center;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
    width: unset;
    align-items: center;
    justify-content: center;
  }
`;

const DetailsContent = styled(Flex)<{ isMobile?: boolean }>`
  /* width: ${({ isMobile }) => isMobile && '100%'}; */
  width: 100%;
  @media screen and (min-width: 1400px) { 
    justify-content: flex-start;
  }
  @media screen and (max-width: 1470px) { 
    flex-direction: column;
  }
  @media screen and (max-width: 768px) { 
    flex-direction: row;
  }
`;

const StyledText = styled(Text)`
  color: #E2E2E2;
  font-weight: 500;
`;

const SubFlex = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  @media screen and (min-width: 1400px) {
    justify-content: flex-start;
    width: unset;
  }

  @media screen and (max-width: 989px) {
    flex-direction: column;
  }
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
`
const TopSection = styled.div`
`
export default TransactionHeader;