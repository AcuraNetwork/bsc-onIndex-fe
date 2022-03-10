/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/react-in-jsx-scope */
// @ts-nocheck
import { useState } from 'react'
import styled from 'styled-components'
import { Flex, ButtonMenu, ButtonMenuItem, Text } from '@onidex-libs/uikit'
import { SwapDetailsContainer } from './SwapComponents'
import OTCPanel from './Components/OTCPanel'

const AdvancedSwapDetailsInfo: FC<{bigPanel?: boolean}> = ({ bigPanel }) => {
  const [tabIndex, setTabIndex] = useState(2)
  const handleChangeTabIndex = (type) => {
    setTabIndex(type)
  }

  return (
    <SwapDetailsContainer bkColor={bigPanel ? '#474747': '#111111'} bigPanel={bigPanel}>
      <OrderTypesWrapper>
        <ButtonMenu activeIndex={tabIndex} variant="primary" onClick={handleChangeTabIndex}>
          <TradeTypeItem active={tabIndex === 0} bigPanel={bigPanel}>
            Max return
          </TradeTypeItem>
          <TradeTypeItem active={tabIndex === 1} bigPanel={bigPanel}>
            Lowest gas
          </TradeTypeItem>
          <TradeTypeItem active={tabIndex === 2} bigPanel={bigPanel}>
            OTC
          </TradeTypeItem>
        </ButtonMenu>
      </OrderTypesWrapper>
      {
        tabIndex === 2 &&
        <OTCPanel />
      }      
    </SwapDetailsContainer>
  )
}

export const OrderTypesWrapper = styled(Flex)`
  padding: 8px 0px;

  div {
    height: 32px;
    border-radius: 16px;
    background: #111111;
    border: none;
    width: 100%;
    justify-content: space-between;
    border: 1px solid rgba(255,0,41,.1);
    @media screen and (max-width: 576px) {
      border: none;
      background: linear-gradient(90.82deg, #141414 6.4%, rgba(37, 37, 37, 0) 101.22%);
      border-radius: 0px 0px 50px 0px;
    }
  }
  @media screen and (max-width: 576px) {
    padding: 8px 0 0;
  }
`;

export const TradeTypeItem = styled(ButtonMenuItem)<{ active?: boolean, bigPanel?: boolean }>`
  height: 30px;
  font-size: 14px;
  border-radius: 16px;
  border: none;
  color: ${({ active }) => active ? '#FFF' : '#FFF'};
  /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
  background: ${({ active }) => active ? 'linear-gradient(220.75deg, #2E0006 -16.91%, #CF203C 126.67%)': '#111111'};
  background-color: #111111;
  padding: 0 10px;  
  font-weight: 300;
  width: 50%;
  min-width: ${({ bigPanel }) => bigPanel ? '80px' : 'auto'};
  :hover:not(:disabled):not(.button--disabled):not(:active) {
    color: ${({ active }) => active && '#CF203C'};
    /* border-bottom: ${({ active }) => active && '2px solid #90E0EF'}; */
    background: transparent;
  }
  @media screen and (max-width: 576px){
    background-color: transparent;
    background: transparent;
    color: ${({ active }) => !active ? '#57555D' : '#CF203C'};
  }
`;
const Label = styled(Text)<{ saved?: boolean }>`
  color: ${({ theme }) => theme.isDark ? '#878787' : 'black'};
  color: ${({ saved }) => saved && '#CF203C'};
  white-space: nowrap;
  font-weight: 300;
  font-size: 12px;
  line-height: 14.06px;
`;

export default AdvancedSwapDetailsInfo
