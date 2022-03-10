import React, { useCallback, useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Text, Flex, Skeleton, ArrowBackIcon, ArrowForwardIcon } from '@onidex-libs/uikit'
import { formatAmount } from 'views/Pools/utils/formatInfoNumbers'
import { PoolData } from 'state/info/types'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { DoubleCurrencyLogo } from 'views/Pools/components/CurrencyLogo'
// import { useTranslation } from 'contexts/Localization'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'

/**
 *  Columns on different layouts
 *  5 = | # | Pool | TVL | Volume 24H | Volume 7D |
 *  4 = | # | Pool |     | Volume 24H | Volume 7D |
 *  3 = | # | Pool |     | Volume 24H |           |
 *  2 = |   | Pool |     | Volume 24H |           |
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 1.5fr repeat(5, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(5),
    & :nth-child(6) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-gap: 0.1em;
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    // & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6),
    & :nth-child(7) {
      display: none;
    }
  }
  // @media screen and (max-width: 480px) {
  //   grid-template-columns: 2.5fr repeat(1, 1fr);
  //   > *:nth-child(1) {
  //     display: none;
  //   }
  // }

  div {
    font-size: 18px;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.isDark ? 'white' : '#000'};
    font-weight: 400;
  }
`

const PoolText = styled(Text)`
  @media screen and (max-width: 576px) {
    font-size: 12px !important;
  }
`

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  lpFees24h: 'lpFees24h',
  lpApr7d: 'lpApr7d',
}

const LoadingRow: React.FC = () => (
  <ResponsiveGrid>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </ResponsiveGrid>
)

const TableLoader: React.FC = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
  return (
    // <LinkWrapper to={`/info/pool/${poolData.address}`}>
      <ResponsiveGrid>
        <PoolText>{index + 1}</PoolText>
        <Flex>
          <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} />
          <PoolText ml="8px">
            {poolData.token0.symbol}/{poolData.token1.symbol}
          </PoolText>
        </Flex>
        <PoolText>${formatAmount(poolData.volumeUSD)}</PoolText>
        <PoolText>${formatAmount(poolData.liquidityUSD)}</PoolText>
        <PoolText>${formatAmount(poolData.volumeUSDWeek)}</PoolText>
        <PoolText>${formatAmount(poolData.lpFees24h)}</PoolText>
        <PoolText>{formatAmount(poolData.lpApr7d)}%</PoolText>
      </ResponsiveGrid>
    // </LinkWrapper>
  )
}

interface PoolTableProps {
  poolDatas: PoolData[]
  loading?: boolean // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const PoolTable: React.FC<PoolTableProps> = ({ poolDatas, loading }) => {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  // const { t } = useTranslation()

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (poolDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages)
    setPage(1);
  }, [poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [page, poolDatas, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <PoolText color="secondary" fontSize="12px" bold textTransform="uppercase">
          Pool
        </PoolText>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSD)}
          textTransform="uppercase"
        >
          Volume 24H {arrow(SORT_FIELD.volumeUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.tvlUSD)}
          textTransform="uppercase"
        >
          Liquidity {arrow(SORT_FIELD.tvlUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
          textTransform="uppercase"
        >
          Volume 7D {arrow(SORT_FIELD.volumeUSDWeek)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.lpFees24h)}
          textTransform="uppercase"
        >
          Reward fees 24H {arrow(SORT_FIELD.lpFees24h)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.lpApr7d)}
          textTransform="uppercase"
        >
          Pool ROI {arrow(SORT_FIELD.lpApr7d)}
        </ClickableColumnHeader>
      </ResponsiveGrid>
      <Break />
      {sortedPools.length > 0 ? (
        <>
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <React.Fragment key={poolData.address}>
                  <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} poolData={poolData} />
                  <Break />
                </React.Fragment>
              )
            }
            return null
          })}
          {loading && <LoadingRow />}
          <PageButtons>
            <Arrow
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{`Page ${page} of ${maxPage}`}</Text>

            <Arrow
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      ) : (
        <>
          <TableLoader />
          {/* spacer */}
          {/* <Box /> */}
        </>
      )}
    </TableWrapper>
  )
}

export default PoolTable
