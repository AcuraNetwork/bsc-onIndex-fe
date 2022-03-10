import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Image, Text } from '@onidex-libs/uikit'
import { Farm } from 'state/types'

interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}
export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number
  farmImage?: string
  tokenSymbol?: string
  farm?: FarmWithStakedValue
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const TokenSymbolLabel = styled(Text)`
  line-height: 1.2;
`;

const FarmImageWrapper = styled.div<{ isTokenOnly: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  width: ${({ isTokenOnly }) => isTokenOnly ? '4rem' : '7.5rem'};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 80px;

  img {
    border-radius: 50%;
  }
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  farm
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="24px">
      <FarmImageWrapper isTokenOnly={farm.isTokenOnly}>
        <Image src={farm.tokenSymbol === 'ONI' ? `/images/farms/ONI.svg` : `/images/farms/${farm.tokenSymbol}.png`} alt={farm.tokenSymbol} width={36} height={36} />
        {!farm.isTokenOnly && 
          <Image src={`/images/farms/${farm.quoteTokenSymbol}.png`} alt={farm.quoteTokenSymbol} width={36} height={36} />
        }
      </FarmImageWrapper>
      <Flex flexDirection="column" alignItems="flex-end">
        {farm.isTokenOnly ?
          <>
            <TokenSymbolLabel color='primary' fontSize='18px' >{farm.lpSymbol}</TokenSymbolLabel>
            <TokenSymbolLabel fontSize='18px'>{farm.masterChefSymbol === 'PLOCK' ? 'PLOCK' : farm.tokenSymbol}</TokenSymbolLabel>
          </>
          : 
          <TokenSymbolLabel color='primary' fontSize='18px' >{farm.lpSymbol}</TokenSymbolLabel>
        }
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
