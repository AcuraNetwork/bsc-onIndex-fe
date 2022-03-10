import React, { useState } from 'react'
import { getAddress } from '@ethersproject/address'
import { Text, Button, Flex, ButtonMenuItem } from '@onidex-libs/uikit';
import { useAllTokens } from 'hooks/useTokens'
import useTransactionHistory from 'hooks/useAutonomyHistory'
import { Container, Tabs, TabContent } from './AutoHistoryStyles'
// import AutoTransaction from './AutoTransaction'

export default function AutoHistory(type: any) {
  const [transactions] = useTransactionHistory()

  const allTokens = useAllTokens()
  const [currentTab, setCurrentTab] = useState('open')
  const mode = type

  const txTokenPairs = transactions.map((tx: any) => {
    if (!tx || !tx.inputToken || !tx.outputToken) return null;
    // eslint-disable-next-line consistent-return
    return {
      input: allTokens[getAddress(tx.inputToken)],
      output: allTokens[getAddress(tx.outputToken)],
    }
  }).filter((txPair: any) => !!txPair)

  return (
    <Container>
      <Tabs>
        <Text onClick={() => setCurrentTab('open')} className={`tabItem ${currentTab === 'open' ? 'active' : ''}`}>
          <span>Open</span>
        </Text>
        <Text onClick={() => setCurrentTab('cancelled')} className={`tabItem ${currentTab === 'cancelled' ? 'active' : ''}`}>
          <span>Cancelled</span>
        </Text>
        <Text onClick={() => setCurrentTab('executed')} className={`tabItem ${currentTab === 'executed' ? 'active' : ''}`}>
          <span>Executed</span>
        </Text>
      </Tabs>
      {/* <TabContent>
        {transactions.map((tx: any, i: number) => (
          tx && tx.typeof === mode.type && tx.status === currentTab && <AutoTransaction key={i} tx={tx} tokenPair={txTokenPairs[i]} />
        ))}
      </TabContent> */}
    </Container>
  )
}

