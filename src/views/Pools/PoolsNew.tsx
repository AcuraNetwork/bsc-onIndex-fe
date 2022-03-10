// @ts-nocheck

import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Button, Spinner } from '@onidex-libs/uikit';
import Page from 'components/layout/Page'
import getPools from 'subgraph/utils/pools';

import { usePriceBnbBusd } from 'state/hooks';
import getTimestampsForChanges from 'utils/getTimestampsForChanges';
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps';
import { useAllPoolData, usePoolDatas } from 'state/info/hooks'
import BackImage from 'assets/images/dex-back.png';
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import { PAIRS_HISTORICAL_BULK, PAIR_DATA } from 'subgraph/queries/pools';
import { client } from 'subgraph/client';
import { parseData } from 'utils/parsePairData';
import PoolTable from 'views/Pools/components/InfoTables/PoolsTable';
import InfoSearch from 'views/Pools/components/InfoSearch';
import PoolsList from './PoolsList';
import FilterInput from './Input';
// eslint-disable-next-line import/no-named-as-default
import SearchInput from './SearchInput';

const StyledPage = styled(Page)`
  // opacity: ${props => props.isFetching && '0.5'};
  padding: 8px;
  max-width: 100%;

  background-image: url(${BackImage}) !important;
  background-color: transparent !important;
  background-size: cover;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;

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

  .page-header {
    background: transparent;
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

  @media screen and (max-width: 576px) {
    padding: 8px 0;
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

const BackgroundImg = styled.img`
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
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
  const [isFetching, setIsFetching] = useState(false);
  const allPoolData = useAllPoolData()
  const [filterData, setFilterData] = useState({
    volume24: '',
    liquidity: '',
    searchTerm: ''
  });

  const poolDatas = useMemo(() => {
    let dataList = Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)

    if (parseFloat(filterData.volume24)) {
      dataList = dataList.filter(item => item.volumeUSD >= parseFloat(filterData.volume24));
    }
    if (parseFloat(filterData.liquidity)) {
      dataList = dataList.filter(item => item.liquidityUSD >= parseFloat(filterData.liquidity));
    }
    if (filterData.searchTerm) {
      dataList = dataList.filter(item => item.token0.symbol.toLocaleLowerCase().includes(filterData.searchTerm.toLowerCase()) ||
      item.token1.symbol.toLocaleLowerCase().includes(filterData.searchTerm.toLowerCase()))
    }
    return dataList;
  }, [allPoolData, filterData])

  const handleUpdateSetFilterData = fieldName => value => {
    setFilterData(prevFilterData => ({
      ...prevFilterData,
      [fieldName]: value
    }));
  };

  return (
    <StyledPage isFetching={isFetching}> 
      <BackgroundImg src={`${process.env.PUBLIC_URL}/images/dark-bg.png`} alt='dark-bg' />
      <PoolUpdater />
      <Flex justifyContent='space-between' mb='16px' mt='16px' padding='0 8px' flexWrap='wrap' className='page-header'>
        <Flex justifyContent='space-between' flexWrap='wrap'>
          <FilterInput value={filterData.volume24} placeholder='Volume 24h(USD)' onChange={handleUpdateSetFilterData('volume24')} />
          <FilterInput value={filterData.liquidity} placeholder='Liquidity(USD)' onChange={handleUpdateSetFilterData('liquidity')} />
        </Flex>
        <InfoSearch />
        {/* <SearchInput value={filterData.searchTerm} onChange={handleUpdateSetFilterData('searchTerm')} /> */}
      </Flex>
      <div>
        <PoolTable poolDatas={poolDatas} />
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
