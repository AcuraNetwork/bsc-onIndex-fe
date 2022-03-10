import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@onidex-libs/uikit'

const OTCPanel = () => {
  return (
    <Container>
      <Flex justifyContent="space-between" mt="20px" mb="10px">
        <Label>USDT Cost</Label>
        <Label>~ $0.00</Label>
      </Flex>
      <Flex justifyContent="space-between" mt="20px" mb="10px">
        <Label>ETH Cost</Label>
        <Label>~ $0.00</Label>
      </Flex>
      <Flex justifyContent="space-between" mt="20px" mb="10px">
        <Label>Transaction Cost</Label>
        <Label>~ $0.00</Label>
      </Flex>
      <Flex justifyContent="space-between" mt="20px" mb="10px">
        <Label saved>Saved(ONIDEX)</Label>
        <Label>~ $0.00</Label>
      </Flex>
      <Flex justifyContent="space-between" mt="20px" mb="10px">
        <Label>Estimated Cost</Label>
        <Label>~ $0.00</Label>
      </Flex>
      <Flex justifyContent="space-between" mt="20px" mb="10px">
        <Label>Price Impact</Label>
        <Label>0.05%</Label>
      </Flex>
      <Flex justifyContent="space-between" mt="20px" mb="10px">
        <Label>Minimum Recieved</Label>
        <Label>158.254USDT</Label>
      </Flex>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  @media screen and (max-width: 576px) {
    background-color: #1B1919;
    padding: 20px;
    margin-bottom: 10px;
  }
`
const Label = styled(Text)<{ saved?: boolean }>`
  color: ${({ theme }) => (theme.isDark ? '#878787' : 'black')};
  color: ${({ saved }) => saved && '#CF203C'};
  white-space: nowrap;
  font-weight: 300;
  font-size: 12px;
  line-height: 14.06px;
`

export default OTCPanel
