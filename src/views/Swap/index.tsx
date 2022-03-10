import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, ButtonMenu, ButtonMenuItem } from '@onidex-libs/uikit';
import redDots from 'assets/images/reddots.svg';
import blackDots from 'assets/images/blackdots.svg';
import swapRight from 'assets/images/swapright.svg';
import swapLeft from 'assets/images/swapleft.svg';
import LimitOrderPanel from 'views/Swap/LimitOrders/LimitOrders';
import SwapPanel from './SwapPanel';
import AdvancedSwapDetailsInfo from './AdvancedSwapDetailsInfo';

const Swap = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const handleChangeTabType = (_i) => {
    setTabIndex(_i)
  }

  return (
    <Wrapper>
      <Mask />
      <RedDotsLeft src={redDots} alt="red" />
      <RedDotsRight src={redDots} alt="red" />
      <BlackDotsLeft src={blackDots} alt="black" />
      <BlackDotsRight src={blackDots} alt="black" />
      <MarkLeft src={swapLeft} alt="swap" />
      <MarkRight src={swapRight} alt="swap" />
      <Container>
        <TabTypesWrapper>
          <ButtonMenu activeIndex={tabIndex} variant="primary" onClick={handleChangeTabType}>
            <TabTypeItem active={tabIndex === 0}>
              Swap
            </TabTypeItem>
            <TabTypeItem active={tabIndex === 1}>
              Limit
            </TabTypeItem>
            <TabTypeItem active={tabIndex === 2}>
              Liquidity
            </TabTypeItem>
          </ButtonMenu>
        </TabTypesWrapper>
        <Content>
          {tabIndex === 0 &&
            <CardsFlex>
              <SwapPanel bigPanel/>
              <AdvancedSwapDetailsInfo bigPanel/>
            </CardsFlex>
          }
          {tabIndex === 1 &&
            <CardsFlex>
              <LimitOrderPanel bigPanel/>
              <AdvancedSwapDetailsInfo bigPanel/>
            </CardsFlex>
          }
        </Content>
      </Container>  
    </Wrapper>
  )
}

const Wrapper = styled(Flex)`
  background-color: #FFF;
  width: 100%;
  height: calc(100vh - 72px);
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-bottom: 65px;
  }
  @media screen and (max-width: 576px) {
    margin-bottom: 85px;
  }
`
const Container = styled.div`
  background: ${({ theme }) => (theme.isDark ? '#070707' : '#fff')};
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000')};
  width: 50%;
  height: max-content;
  border-radius: 15px;
  margin-top: 5%;
  z-index:1;
  p {
    font-weight: normal;
    font-size: 14px;
    letter-spacing: 0.1em;
    text-align: center;
  }

  @media screen and (max-width: 1144px) {
    width: calc(100% - 16px);
    margin-top: 30px;
  }
`
const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(61,61,61,.5);
`
const Content = styled(Flex)`
  width: 100%;
  height: 100%;
  min-height: 405px;
  padding: 20px;
  @media screen and (max-width: 576px) {
    margin-bottom: 20px;
  }
`
const TabTypesWrapper = styled(Flex)`
  background-color: ${({theme}) => theme.isDark ? '#171717' : 'fff'};
  padding: 8px 16px;
  border-radius: 15px 15px 0 0;
  div {
    height: 32px;
    border-radius: 0px;
    background: transparent;
    border: none;
    width: 100%;
  }
`;
const TabTypeItem = styled(ButtonMenuItem)<{ active?: boolean }>`
  height: 32px;
  font-size: 14px;
  border-radius: 0px;
  color: ${({ active }) => active ? '#CF203C' : '#8F8F8F'};
  /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
  /* background: transparent; */
  background-color: transparent;
  padding: 0 10px;  
  font-weight: 300;
  /* width: 50%; */

  :hover:not(:disabled):not(.button--disabled):not(:active) {
    color: ${({ active }) => active && '#CF203C'};
    /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
    background: transparent;
  }
`;
const CardsFlex = styled.div`
  display: flex;
  width: 100%;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`
const RedDotsLeft = styled.img`
  position: absolute;
  top: calc(5% + 45px);
  left: 5%;
`
const RedDotsRight = styled.img`
  position: absolute;
  top: calc(5% + 45px);
  right: 5%;
`
const BlackDotsLeft = styled.img`
  position: absolute;
  top: calc(5% + 100px);
  left: 5%;
`
const BlackDotsRight = styled.img`
  position: absolute;
  top: calc(5% + 100px);
  right: 5%;
`
const MarkLeft = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
`
const MarkRight = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
`
export default Swap