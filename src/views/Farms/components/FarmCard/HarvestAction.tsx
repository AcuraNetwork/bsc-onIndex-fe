import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Heading } from '@onidex-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'
import { Farm } from 'state/types'
// import useStake from '../../../../hooks/useStake'
import ActionButton from '../../../../components/ActionButton';

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  farm: FarmWithStakedValue
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid, farm }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid, farm.masterChefSymbol)
  // const { onStake } = useStake(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  const handleHarvest = async () => {
    setPendingTx(true);
    try {
      await onReward();
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false);
    }
  };

  return (
    <Flex mb='8px' justifyContent='space-between' alignItems='center'>
      <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      <BalanceAndCompound>
        {/* {pid === 12 ?
          <Button
            disabled={rawEarningsBalance === 0 || pendingTx}
            size='sm'
            variant='secondary'
            marginBottom='15px'
            onClick={async () => {
              setPendingTx(true)
              await onStake(rawEarningsBalance.toString())
              setPendingTx(false)
            }}
          >
            {TranslateString(999, 'Compound')}
          </Button>
          : null} */}
        <ActionButton
          size='sm'
          variant='secondary'
          disabled={rawEarningsBalance === 0 || pendingTx}
          onClick={handleHarvest}
        >
          {TranslateString(999, 'Harvest')}
        </ActionButton>
      </BalanceAndCompound>
    </Flex>
  )
}

export default HarvestAction
