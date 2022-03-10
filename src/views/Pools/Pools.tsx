// @ts-nocheck

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Spinner } from '@onidex-libs/uikit';
import Page from 'components/layout/Page'
import getPools from 'subgraph/utils/pools';

import { usePriceBnbBusd } from 'state/hooks';
import getTimestampsForChanges from 'utils/getTimestampsForChanges';
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps';
import { useAllPoolData, usePoolDatas } from 'state/info/hooks'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import { PAIRS_HISTORICAL_BULK, PAIR_DATA } from 'subgraph/queries/pools';
import { client } from 'subgraph/client';
import { parseData } from 'utils/parsePairData';
import PoolsList from './PoolsList';
import FilterInput from './Input';
// eslint-disable-next-line import/no-named-as-default
import SearchInput from './SearchInput';

const StyledPage = styled(Page)`
  opacity: ${props => props.isFetching && '0.5'};
  padding: 8px;
  max-width: 100%;

  article {
    div {
      width: 100% !important;
    }
  }

  .header {
    display: none;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: block;
    }
  }

  .header-mobile {
    display: block;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: none;
    }
  }

  .currency-selector {
    display: block;
    margin-bottom: 16px;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: none;
      margin-bottom: 0;
    }
  }
`;

const StyledButton = styled(Button)`
  background: ${({ theme }) => theme.isDark && '#202020'};
  font-weight: normal;
  padding: 4px 16px 4px 24px;

  border: ${props => props.active && '2px solid #48CAE4'};

  .img-container {
    background: ${({ theme }) => theme.isDark && 'rgba(93, 103, 126, 0.26)'};
    padding: 4px 16px;
    border-radius: 16px;
    margin-left: 16px;
  }

  :hover:not(:disabled):not(.button--disabled):not(:active) {
    background: ${({ theme }) => theme.isDark && '#202020'};
    border: ${props => props.active ? '2px solid #48CAE4' : 'none'};
  }

  :focus:not(:active) {
    box-shadow: none;
  }
`;

const SpinnerWrapper = styled.div`
  div {
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    margin-top: -48px;
    margin-left: -48px;
  }
`;

interface PoolData {
  id: string,
  token0: {
    symbol: string,
  },
  token1: {
    symbol: string
  },
  reserveETH: string,
  reserveUSD: string,
  createdAtTimestamp: string,
  oneDayVolumeUSD?: BigNumber,
  oneDayVolumeUntracked?: BigNumber,
  trackedReserveUSD?: BigNumber,
}

const Pools: React.FC = () => {  
  const [explorer, setExplorer] = useState('pools');
  const [pools, setPools] = useState<Array<PoolData>>([]);
  const bnbPriceUsd = usePriceBnbBusd();
  const [isFetching, setIsFetching] = useState(false);
  const allPoolData = useAllPoolData()
  
  useEffect(() => {
    const getPoolsList = async () => {
      setIsFetching(true);
      try {
        const poolsList = await getPools();
        
        const [t1, t2, tWeek] = getTimestampsForChanges()
        const blocks = await getBlocksFromTimestamps([t1, t2, tWeek])
        const [{ number: b1 }, { number: b2 }, { number: bWeek }] = blocks

        const oneDayResult = await client.query({
          query: PAIRS_HISTORICAL_BULK(b1, poolsList.pairs.map(pair => pair.id)),
          fetchPolicy: 'cache-first',
        })

        const twoDayResult = await client.query({
          query: PAIRS_HISTORICAL_BULK(b2, poolsList.pairs.map(pair => pair.id)),
          fetchPolicy: 'cache-first',
        })

        const oneWeekResult = await client.query({
          query: PAIRS_HISTORICAL_BULK(bWeek, poolsList.pairs.map(pair => pair.id)),
          fetchPolicy: 'cache-first',
        })

        const oneDayData = oneDayResult?.data?.pairs.reduce((obj, cur, i) => {
          return { ...obj,
            [cur.id]: cur
          }
        }, {})

        const twoDayData = twoDayResult?.data?.pairs.reduce((obj, cur, i) => {
          return { ...obj,
            [cur.id]: cur
          }
        }, {})

        const oneWeekData = oneWeekResult?.data?.pairs.reduce((obj, cur, i) => {
          return { ...obj,
            [cur.id]: cur
          }
        }, {})

        const poolsData = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const pair of poolsList.pairs) {
          let data = pair
          let oneDayHistory = oneDayData?.[pair.id]
          if (!oneDayHistory) {
              // eslint-disable-next-line no-await-in-loop
              const newData = await client.query({
                  query: PAIR_DATA(pair.id, b1),
                  fetchPolicy: 'cache-first',
              })
              oneDayHistory = newData.data.pairs[0]
          }
          let twoDayHistory = twoDayData?.[pair.id]
          if (!twoDayHistory) {
              // eslint-disable-next-line no-await-in-loop
              const newData = await client.query({
                  query: PAIR_DATA(pair.id, b2),
                  fetchPolicy: 'cache-first',
              })
              twoDayHistory = newData.data.pairs[0]
          }
          let oneWeekHistory = oneWeekData?.[pair.id]
          if (!oneWeekHistory) {
              // eslint-disable-next-line no-await-in-loop
              const newData = await client.query({
                  query: PAIR_DATA(pair.id, bWeek),
                  fetchPolicy: 'cache-first',
              })
              oneWeekHistory = newData.data.pairs[0]
          }
          data = parseData(data, oneDayHistory, twoDayHistory, oneWeekHistory, bnbPriceUsd, b1)

          poolsData.push(data);
        }
        setPools(poolsData);
        setIsFetching(false);
      } catch (error) { 
        console.log('ant : error => ', error);
        setIsFetching(false);
      }
    }
    getPoolsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetExplorer = type => () => {
    setExplorer(type);
  };

  return (
    <StyledPage isFetching={isFetching}> 
      <PoolUpdater />
      <Flex>
        <StyledButton active={explorer === 'pairs'} onClick={handleSetExplorer('pairs')}>
          <Flex alignItems='center'>
            PAIRS
            <Flex className='img-container' ml='8px'>
              <img src='/images/acura.svg' alt='acura' width={24} />
              <img src='/images/quickswap.svg' alt='acura' width={40} />
            </Flex>
          </Flex>
        </StyledButton>
        <StyledButton ml='16px' active={explorer === 'pools'} onClick={handleSetExplorer('pools')}>
          <Flex alignItems='center'>
            POOLS
            <Flex className='img-container' ml='8px'>
              <img src='/images/acura.svg' alt='acura' width={24}/>
              <img src='/images/quickswap.svg' alt='acura' width={40} />
            </Flex>
          </Flex>  
        </StyledButton>
        <StyledButton ml='16px' active={explorer === 'apr'} onClick={handleSetExplorer('apr')}>
          <Flex alignItems='center'>
            APR/APY
            <Flex className='img-container' ml='8px'>
              <img src='/images/quickswap.svg' alt='acura' width={40} />
            </Flex>
          </Flex> 
        </StyledButton>
      </Flex>
      <Flex justifyContent='space-between' mb='16px' mt='16px' padding='0 8px' flexWrap='wrap'>
        <FilterInput placeholder='Volume 24h(USD)' />
        <FilterInput placeholder='Liquidity(USD)' />
        <FilterInput placeholder='Project' />
        <FilterInput placeholder='Lock Volume' />
        <SearchInput />
      </Flex>
      <div>
        <PoolsList pools={pools} />
        {isFetching && 
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        }
      </div>
    </StyledPage>
  )
}

export default Pools
