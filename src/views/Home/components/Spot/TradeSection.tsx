/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex } from '@onidex-libs/uikit';

const pairData = {
  token: {
    symbol: 'ONI',
    address: '',
    balance: 108.5,
  },
  quoteToken: {
    symbol: 'USDT',
    address: '',
    balance: 264.0241843,
  }
}

const percentData = [
  25, 50, 75, 100
]

const TradeSection = () => {
  const [tabIndex, setTabIndex] = useState(1);
  const [percentIndex, setPercentIndex] = useState(0);

  const handleClickTab = (idx) => {
    setTabIndex(idx);
  }

  const handleClickPercentage = (idx) => {
    setPercentIndex(idx);
  }

  return (
    <Container>
      <TabContainer>
        <ButtonItem active = {tabIndex === 0} tabIndex={tabIndex} onClick={() => handleClickTab(0)}>Buy</ButtonItem>
        <ButtonItem active = {tabIndex === 1} tabIndex={tabIndex} onClick={() => handleClickTab(1)}>Sell</ButtonItem>
      </TabContainer>
      <LimitContainer >Limit</LimitContainer>
      <LimitContainer >{pairData.token.balance}</LimitContainer>
      <InputContainer
        placeholder={`Amount (${pairData.token.symbol})`}
      />
      <PercentContainer>
        {
          percentData.map((percent, _i) => {
            return (
              <PercentItemContainer active={percentIndex === _i} onClick={() => handleClickPercentage(_i)} key={percent.toString()}>
                <PercentItem active={percentIndex === _i}/>
                <p>{percent}%</p>
              </PercentItemContainer>
            )
          })
        }
      </PercentContainer>
      <InputContainer
        placeholder={`Total (${pairData.quoteToken.symbol})`}
      />
      <SellButton >{tabIndex === 0 ? 'Buy' : 'Sell'} {pairData.token.symbol}</SellButton>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  padding: 10px;
`
const TabContainer = styled.div`
  width: 100%;
  background-color: #303030;
  border-radius: 5px;
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 20px;
`
const ButtonItem = styled.button<{active?: boolean; tabIndex?: number}>`
  background-color: ${({active}) => active? '#CF203C' : 'transparent'};
  height: 40px;
  border: none;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ active }) => active ? 'white' : '#909090'};
  border-radius: ${({ active, tabIndex }) => active ? tabIndex === 0 ? '5px 40px 0 5px' : '40px 5px 5px 0' : '5px'};
`
const LimitContainer = styled(TabContainer)`
  justify-content: center;
  color: white;
`
const InputContainer = styled.input`
  width: 100%;
  background-color: #303030;
  border-radius: 5px;
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  justify-content: center;
  color: white;
  padding: 0 10px;
  border: none;
  text-align: center;
`
const PercentContainer = styled(Flex)`
  width: 100%;
  margin: 20px 0;
  justify-content: space-between;
`
const PercentItemContainer = styled(Flex)<{ active?: boolean; }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ active }) => active ? '#FFF' : '#303030'};
  width: calc(25% - 10px);
`
const PercentItem = styled.div<{ active?: boolean; }>`
  background-color: ${({ active }) => active ? '#CF203C' : '#303030'};
  height: 10px;
  margin-bottom: 5px;
  width: 100%;
  border-radius: 5px 0 10px;
`
const SellButton = styled.button`
  background-color: #CF203C;
  height: 40px;
  border: none;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 5px;
  border: 10;
`
export default TradeSection;
