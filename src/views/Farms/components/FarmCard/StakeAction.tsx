import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@onidex-libs/uikit'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { Farm } from 'state/types'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import ActionButton from '../../../../components/ActionButton';

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}
interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  depositFeeBP?: number
  farm?: FarmWithStakedValue
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, tokenBalance, tokenName, pid, farm, depositFeeBP}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid, farm.masterChefSymbol)
  const { onUnstake } = useUnstake(pid, farm.masterChefSymbol)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <ActionButton size='sm' variant='secondary' onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</ActionButton>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
