import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Text, Skeleton } from '@onidex-libs/uikit'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { QuoteToken } from 'config/constants/types'
import { useFarmUser } from 'state/hooks';
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import TimeCount from './TimeCount';

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const FCard = styled.div`
  align-self: baseline;
  // background: ${(props) => props.theme.card.background};
  background: #171717;
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const TranslateString = useI18n()
  const { stakedBalance, depositedAt } = useFarmUser(farm.pid);

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.TBAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const earnLabel = 'ONI'
  const farmAPY = farm.apy && farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  let tokenPerBlock = 0;
  if (farm.tokenPerBlock) {
    tokenPerBlock = new BigNumber(farm.tokenPerBlock).div(new BigNumber(10).pow(18)).toNumber();
  }

  const { risk } = farm

  return (
    <FCard>
      {/* {farm.tokenSymbol === 'EGG' && <StyledCardAccent />} */}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        risk={risk}
        farm={farm}
        depositFee={farm.depositFeeBP}
        farmImage={farmImage}
        tokenSymbol={farm.tokenSymbol}
      />
      {!removed && (
        <Flex justifyContent='space-between' alignItems='center'>
          <Text small>{TranslateString(352, 'APR')}:</Text>
          <Text small style={{ display: 'flex', alignItems: 'center' }}>
            {farm.apy ? (
              <>
                {/* <ApyButton
                  lpLabel={lpLabel}
                  quoteTokenAddresses={quoteTokenAddresses}
                  quoteTokenSymbol={quoteTokenSymbol}
                  tokenAddresses={tokenAddresses}
                  cakePrice={cakePrice}
                  apy={farm.apy}
                /> */}
                {farmAPY}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )}
      <Flex justifyContent='space-between'>
        <Text small>Stake:</Text>
        <Text small>{farm.lpSymbol}</Text>
      </Flex>
      <Flex justifyContent='space-between' mb='8px'>
        <Text small>{TranslateString(318, 'Earn')}:</Text>
        <Text small>{farm.masterChefSymbol === 'PLOCK' ? 'PLOCK' : earnLabel}</Text>
      </Flex>
      <TimeCount depositedAt={depositedAt} stakedBalance={stakedBalance} />
      {/* <Flex justifyContent='space-between' mb='16px'>
        <Text small>Reward Pool:</Text>
        <Text small>523.99</Text>
      </Flex> */}
      <CardActionsContainer farm={farm} ethereum={ethereum} account={account} />
      <Flex justifyContent='space-between' mt='24px'>
          <Text small>Deposit:</Text>
          <Text small>{farm.lpSymbol}</Text>
        </Flex>
        <Flex justifyContent='space-between'>
          <Text small>Emission Rate:</Text>
          <Text small>{tokenPerBlock}/BLOCK</Text>
        </Flex>
        <Flex justifyContent='space-between'>
          <Text small>Total Value:</Text>
          <Text small>{totalValueFormated}</Text>
        </Flex>
    </FCard>
  )
}

export default FarmCard
