import React, { useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, ButtonMenu, ButtonMenuItem, ChevronDownIcon, ChevronUpIcon } from '@onidex-libs/uikit';
import RadioInput from 'components/RadioInput';

const Panel = styled.div`
  background: linear-gradient(0deg, rgba(29,29,29,.4),rgba(29,29,29,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), linear-gradient(0deg, rgba(0,0,0,.4), rgba(0,0,0,.4)), rgba(0,0,0,.4);
  border-radius: 16px;
  padding: 16px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 32px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 48px;
  }
`;

const Label = styled(Text)`
  color: ${({ theme }) => theme.isDark && '#C4C4C4'};
  letter-spacing: 1px;
  @media screen and (max-width: 320px) {
    font-size: 14px;
  }
`;

const Label1 = styled(Text)`
  color: ${({ theme }) => theme.isDark && '#C4C4C4'};
  letter-spacing: 1px;
  @media screen and (max-width: 576px) {
    display: none;
  }
`;
const Label2 = styled(Text)`
  display: none;
  color: ${({ theme }) => theme.isDark && '#C4C4C4'};
  letter-spacing: 1px;
  @media screen and (max-width: 576px) {
    display: block;
  }
  @media screen and (max-width: 320px) {
    font-size: 14px;
  }
`;

const DexRow = styled(Flex)<{maxWidth?: string}>`
  width: 100%;
  justify-content: space-between;
  max-width: ${({maxWidth}) => maxWidth};
`

const ExchangeContainer = styled(Flex)<{ active?: boolean }>`
  border-radius: 50%;
  background: #303030;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 100px;
  height: 100px;
  border: ${({ active }) => active && '3px solid #54C9EF'};
  cursor: pointer;

  @media screen and (max-width: 398px) {
    max-width: 70px;
    max-height: 70px;
  }
`;

const TokenInfoContainer = styled.div`
  border-radius: 16px;
  background: linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #000000, #000000), linear-gradient(0deg, #000000, #000000), #000000;
  padding: 16px;

  display: flex;
  justify-content: space-between;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px 32px;
  }
  @media screen and (max-width: 470px) {
    flex-direction: column;
  }
`;

const TokenInfoWrapper = styled.div`
  border-radius: 16px;
  background: linear-gradient(0deg, #121212, #121212), linear-gradient(0deg, #000000, #000000), linear-gradient(0deg, #000000, #000000), #000000;
  padding: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px 32px;
  }
  @media screen and (max-width: 470px) {
    flex-direction: column;
  }
`;

const SubTokenInfoContainter = styled.div`
  width: 50%;
  
  @media screen and (max-width: 470px) {
    width: 100%;
  }
`
const SubTokenInfoContainterRight = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media screen and (max-width: 470px) {
    width: 100%;
  align-items: flex-start;
  }
`
const SelectAll = styled(Text)`
  color: #FFB20A;
  cursor: pointer;
  @media screen and (max-width: 576px) {
    display: none;
  }
  @media screen and (max-width: 320px) {
    min-width: 60px;
  }
`;

const MESSAGE_OPTIONS = [
  { label: 'Symbol', value: 'symbol' },
  { label: 'Tokens per native', value: 'tokensPerNative' },
  { label: 'Price', value: 'price' },
  { label: 'Supply', value: 'circulatingSupply' },
  { label: 'Total Supply', value: 'totalSupply' },
  { label: 'Marketcap', value: 'marketCap' },
  { label: 'Liquidity', value: 'liquidity' },
  { label: 'Value Locked', value: 'tvl' },
  { label: 'Holders', value: 'holders' },
  { label: 'Daily Volume', value: 'dailyVolume' },
  { label: 'Daily Change', value: 'dailyChange' },
]

const RadioWrapper = styled.div`
  width: 33.3%;
  margin: 12px 0;
`;

const ChainSelector = styled(Flex)`
  background: linear-gradient(90deg, rgba(41, 50, 60, 0.5) 0%, rgba(72, 85, 99, 0.5) 100%);
  border-radius: 10px;
  padding: 8px 0;

  div {
    cursor: pointer;
  }
`;

const StyledText = styled(Text)<{ active?: boolean, activeColor?: string, isSolana?: boolean }>`
  color: ${props => props.active ? props.activeColor: '#8C8C8C'};
  font-weight: 500;
  text-transform: capitalize;

  background: ${props => props.isSolana && props.active && '-webkit-linear-gradient(#DC1FFF , #00FFA3)'};
  -webkit-background-clip: ${props => props.isSolana && props.active && 'text'};
  -webkit-text-fill-color: ${props => props.isSolana && props.active && 'transparent'};
`;

const StyledTitleText = styled(Text)<{ active?: boolean, activeColor?: string, isSolana?: boolean }>`
  color: ${props => props.active ? props.activeColor: '#8C8C8C'};
  font-weight: 500;
  text-transform: capitalize;

  background: ${props => props.isSolana && props.active && '-webkit-linear-gradient(#DC1FFF , #00FFA3)'};
  -webkit-background-clip: ${props => props.isSolana && props.active && 'text'};
  -webkit-text-fill-color: ${props => props.isSolana && props.active && 'transparent'};

  @media screen and (max-width: 576px) {
    font-size: 14px;
  }
  @media screen and (max-width: 398px) {
    display: none;
  }
`;

const ComingSoonText = styled(Text)`
  background: -webkit-linear-gradient(left, #DC1FFF , #00FFA3);
  background: -o-linear-gradient(right, #DC1FFF , #00FFA3);
  background: -moz-linear-gradient(right, #DC1FFF , #00FFA3);
  background: linear-gradient(to right, #DC1FFF , #00FFA3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ButtonMenuWrapper = styled(Flex)`
  width: 100%;
  div {
    height: 32px;
    border-radius: 32px;
    width: 100%;
    background: linear-gradient(0deg,#1D1D1D,#1D1D1D),linear-gradient(0deg,#000000,#000000),linear-gradient(0deg,#000000,#000000),#000000;
    border: 2px solid #EF5350;
  }
`;

const ActionRow = styled(Flex)`
  justify-content: space-around;
  @media screen and (max-width: 570px){
    flex-direction: column;
  }
`

const StyledButtonMenuItem = styled(ButtonMenuItem)<{ active?: boolean }>`
  height: 32px;
  font-weight: 400;
  border-radius: 32px;
  background: transparent;
  border: ${({ active }) => active && '2px solid #EF5350'};
  min-width: 100px;
  width: 50%;
  color: ${({ theme }) => !theme.isDark && '#EF5350'};
  margin-left: -2px;
  margin-top: -2px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {  
    border-color: #EF5350;
    background: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`;

const Divider = styled(Flex)`
  height: 1px;
  background: #404040;
`;

const MessageOptionsContainer = styled.div`
  width: 100%;
  background-color: transparent;
  @media screen and (max-width: 576px) {
    background-color: #1A1A1A;
    padding: 0 10px;
    border-radius: 0 0 5px 5px;
  }
`
const MessageOptionHeader = styled(Flex)`
  @media screen and (max-width: 576px) {
    background: linear-gradient(90.82deg, #141414 6.4%, rgba(37, 37, 37, 0) 101.22%);
    border-radius: 0px 0px 50px 0px;
    padding: 10px;
  }
`
const ChervonIconContainer = styled.div`
  padding: 5px;
  display: block;
`

const CHAINS = [
  {
    name: 'bsc',
    logoUrl: '/images/pricebot/chains/binance.svg',
    activeLogoUrl: '/images/pricebot/chains/active-binance.svg',
    activeColor: '#F3BA2F',
    swaps: ['Pancake', 'BakerySwap', 'ApeSwap']
  },
  {
    name: 'ethereum',
    logoUrl: '/images/pricebot/chains/ethereum.svg',
    activeLogoUrl: '/images/pricebot/chains/active-ethereum.svg',
    activeColor: '#FFFFFF',
    swaps: ['UniSwap', 'SushiSwap']
  },
  {
    name: 'polygon',
    logoUrl: '/images/pricebot/chains/polygon.svg',
    activeLogoUrl: '/images/pricebot/chains/active-polygon.svg',
    activeColor: '#8247E5',
    swaps: ['Acura', 'QuickSwap']
  },
  {
    name: 'solana',
    logoUrl: '/images/pricebot/chains/solana.svg',
    activeLogoUrl: '/images/pricebot/chains/active-solana.svg',
    activeColor: '#F3BA2F',
    swaps: []
  },
]

const DexPanel = ({ 
  messageOptions, 
  activeDex,
  activeChain,
  chartType,
  messageType,
  onChangeMessageType,
  onChangeChartType,
  onChangeActiveChain,
  onChangeActiveDex,
  onChangeMessageOptions 
}) => {
  const tokenName = 'Onidex';
  const marketcap = '$707,232.07';
  const price = '$0.007234'
  const liquidity = '$707,232.07';
  const tokenMatic = '66,423.28';
  const lpPrice = '$4.48';
  const supply = '92,000,000';
  
  const [messageOptionShow, setMessageOptionShow] = useState(true)

  const handleChangeDex = dex => () => {
    onChangeActiveDex(dex);
  };

  const handleOptionChange = optionLabel => active => {
    const messageIndex = MESSAGE_OPTIONS.findIndex(option => option.label === optionLabel);
    const newMessageOptions = [...messageOptions];
    newMessageOptions[messageIndex].active = active;
    onChangeMessageOptions(newMessageOptions);
  };

  const handleSelectAllOptions = () => {
    onChangeMessageOptions(MESSAGE_OPTIONS.map(option => ({
      label: option.label,
      value: option.value,
      active: true
    })));
  };

  const handleSetActiveChain = chain => {
    onChangeActiveChain(chain.name);
    if (chain.swaps.length > 0) {
      onChangeActiveDex(chain.swaps[0]);
    }
  };

  const handleChangeChartType = index => {
    onChangeChartType(index);
  };

  const handleChangeMessageType = index => {
    onChangeMessageType(index);
  };

  const handleMessageOptions = () => {
    setMessageOptionShow(!messageOptionShow)
  }

  const activeChainData = CHAINS.find(item => item.name === activeChain);

  return (
    <Panel>
      <ChainSelector justifyContent='space-around' mb='20px'>
        {CHAINS.map(chain => {
          return (
            <Flex alignItems="center" key={chain.name} onClick={() => handleSetActiveChain(chain)}>
              <img src={activeChain === chain.name ? chain.activeLogoUrl : chain.logoUrl} alt={chain.name} width={24} />
              <StyledTitleText isSolana={chain.name === 'Solana'} active={activeChain === chain.name} activeColor={chain.activeColor} fontSize='18px' ml='6px'>{chain.name}</StyledTitleText>
            </Flex>
          )
        })}
      </ChainSelector>
      <Flex>
        <Label fontSize='24px' bold>DEX</Label>
        {activeChainData.swaps.length > 0 &&
          <StyledText 
            isSolana={activeChainData.name === 'Solana'} 
            active 
            activeColor={activeChainData.activeColor} 
            fontSize='24px' 
            color='primary' 
            ml='16px'>
            {activeDex}
          </StyledText>
        }
      </Flex>
      <Flex mt='16px' mb='24px'>
        {activeChainData.swaps.length > 0 ?
          <DexRow maxWidth={`${activeChainData.swaps.length * 100 + 96 * (activeChainData.swaps.length - 1)}px`}>
            {activeChainData.swaps.map(swap => {
              return (
                <ExchangeContainer key={swap} active={activeDex === swap} justifyContent='center' alignItems='center' onClick={handleChangeDex(swap)}>
                  <img src={`/images/pricebot/${swap}.svg`} alt={swap} width={swap === 'QuickSwap' ? 80 : 48} />
                </ExchangeContainer>
              )
            })}
          </DexRow>
          :
          <>
            <ComingSoonText fontSize='36px' ml='auto' mr='auto' mt='22px' mb='24px'>
              Coming Soon
            </ComingSoonText>
          </>
        }
      </Flex>
      {/* <Label fontSize='18px' mb='8px'>Token Info</Label> */}
      <Label1 fontSize='18px' mb='8px'>Token Info</Label1>
      <TokenInfoWrapper>
        <Label2 fontSize='18px' mb='8px'>Token Info</Label2>
        <TokenInfoContainer>
          <SubTokenInfoContainter>
            {/* <Flex justifyContent='space-between'> */}
              <Text fontSize='18px'>{`Symbol: ${tokenName}`}</Text>
              <Text fontSize='18px'>{`Marketcap: ${marketcap}`}</Text>
            {/* </Flex>
            <Flex justifyContent='space-between'> */}
              <Text fontSize='18px'>{`Price: ${price}`}</Text>
              <Text fontSize='18px'>{`Liquidity: ${liquidity}`}</Text>
            {/* </Flex> */}
          </SubTokenInfoContainter>
          <SubTokenInfoContainterRight>
            {/* <Flex justifyContent='space-between'> */}
              <Text fontSize='18px'>{`${tokenName}/BNB: ${tokenMatic}`}</Text>
              <Text fontSize='18px'>{`One LP: ${lpPrice}`}</Text>
            {/* </Flex> */}
            <Text fontSize='18px'>{`Supply: ${supply}`}</Text>
          </SubTokenInfoContainterRight>
        </TokenInfoContainer>
      </TokenInfoWrapper>
      <MessageOptionHeader mt="40px" alignItems='center' justifyContent='space-between' onClick={handleMessageOptions}>
        <Label fontSize='18px'>Enable Price Message Options</Label>
        <SelectAll fontSize='14px' onClick={handleSelectAllOptions}>Select All</SelectAll>
        <ChervonIconContainer>
          {
            messageOptionShow ?
            <ChevronUpIcon color="#EF5350" />:
            <ChevronDownIcon color="#EF5350"/>
          }
        </ChervonIconContainer>
      </MessageOptionHeader>
      {messageOptionShow && 
        <MessageOptionsContainer>
          <Flex flexWrap='wrap' justifyContent='space-between'>
            {messageOptions.map(option => {
              return (
                <RadioWrapper key={option.label}>
                  <RadioInput value={option.active} label={option.label} onChange={handleOptionChange(option.label)} />
                </RadioWrapper>
              )
            })}
          </Flex>
        </MessageOptionsContainer>
      }
      <Divider mt='16px' />
      <ActionRow >
        <Flex flexDirection='column' alignItems='center' mt='16px'>
          <Text fontSize='18px' mb='24px'>Show Chart on Price Message</Text>
          <ButtonMenuWrapper justifyContent='center'>
            <ButtonMenu activeIndex={messageType} variant="subtle" onClick={handleChangeMessageType}>
              <StyledButtonMenuItem active={messageType === 0}>
                On
              </StyledButtonMenuItem>
              <StyledButtonMenuItem active={messageType === 1}>
                Off
              </StyledButtonMenuItem>
            </ButtonMenu>
          </ButtonMenuWrapper>
        </Flex>
        <Flex flexDirection='column' alignItems='center' mt='16px'>
          <Text fontSize='18px' mb='24px'>Chart type</Text>
          <ButtonMenuWrapper justifyContent='center'>
            <ButtonMenu activeIndex={chartType} variant="subtle" onClick={handleChangeChartType}>
              <StyledButtonMenuItem active={chartType === 0}>
                Candlestick
              </StyledButtonMenuItem>
              <StyledButtonMenuItem active={chartType === 1}>
                Line
              </StyledButtonMenuItem>
            </ButtonMenu>
          </ButtonMenuWrapper>
        </Flex>
      </ActionRow>
    </Panel>  
  )
};

export default DexPanel;