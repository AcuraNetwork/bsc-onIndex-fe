import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@onidex-libs/uikit'
import NoDataSection from './NoDataSection'
import TVChartContainer from '../TVChartContainer'

const BottomSection: React.FC<{
  jwtToken: string;
  containerId: string;
  selectedCurrency: any;
}> = ({ jwtToken, containerId, selectedCurrency }) => {
  const [headerIndex, setHeaderIndex] = useState(0)

  const handleHeaderTabClick = (idx) => {
    setHeaderIndex(idx)
  }

  return (
    <Container>
      <HeaderContainer justifyContent="space-between" alignItems="center">
        <HeaderItem active={headerIndex === 0} onClick = {() => handleHeaderTabClick(0)}>Open Orders(0)</HeaderItem>
        <HeaderItem active={headerIndex === 1} onClick = {() => handleHeaderTabClick(1)}>Market Trades</HeaderItem>
        <HeaderItem active={headerIndex === 2} onClick = {() => handleHeaderTabClick(2)}>Info</HeaderItem>
        <HeaderItem active={headerIndex === 3} onClick = {() => handleHeaderTabClick(3)}>Charts</HeaderItem>
      </HeaderContainer>
      {
        headerIndex === 0 && <NoDataSection text="No open orders" />
      }
      {
        headerIndex === 1 && <NoDataSection text="No market trades data" />
      }
      {
        headerIndex === 2 && <NoDataSection text="No info data" />
      }
      {
        headerIndex === 3 && <Container>
          <TVChartContainer jwtToken={jwtToken} containerId={containerId} selectedCurrency={selectedCurrency} />
        </Container>
      }
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`
const HeaderContainer = styled(Flex)`
  margin-top: 20px;
  height: 40px;
  background: linear-gradient(90.82deg, #252525 6.4%, rgba(37, 37, 37, 0) 101.22%);
  border-radius: 0px 0px 50px 0px;
`
const HeaderItem = styled(Flex)<{ active?: boolean }>`
  color: ${({ active }) => active ? '#CF203C' : '#57555D'};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  font-size: 12px;
`
export default BottomSection;
