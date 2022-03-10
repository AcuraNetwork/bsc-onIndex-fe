import React, { useState } from 'react'
import styled from 'styled-components'
import { Text } from '@onidex-libs/uikit'
import { TransactionContainer } from './SwapComponents'

const TransactionCard = () => {
  
  return (
    <TransactionContainer bkColor="#111111">
      <Label saved>No Recent Transaction</Label>
    </TransactionContainer>
  )
}

const Label = styled(Text)<{ saved?: boolean }>`
  color: ${({ theme }) => theme.isDark ? '#878787' : 'black'};
  color: ${({ saved }) => saved && '#CF203C'};
  white-space: nowrap;
  font-weight: 300;
  font-size: 18px;
  line-height: 14.06px;
  text-align: center;
  margin: auto 0;
`;

export default TransactionCard
