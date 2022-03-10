/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import getPools from 'subgraph/utils/pools';
import CardValue from 'components/CardValue/CardValue';
import getTimestampsForChanges from 'utils/getTimestampsForChanges';
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps';
import { PAIRS_HISTORICAL_BULK, PAIR_DATA } from 'subgraph/queries/pools';
import { client } from 'subgraph/client';
import { parseData } from 'utils/parsePairData';
import { usePriceBnbBusd } from 'state/hooks';
import BigNumber from 'bignumber.js';

const OrderBookCard = styled.div`
  background: ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.7)' : '#fff'};
  color: ${({ theme }) => theme.isDark ? '#fff' : '#000'};
  padding: 32px 32px 24px;
  width: 100%;

  border-radius: 15px;
  text-align: center;

  table {
    width: 100%;
    margin-bottom: 16px;
  }
  .table-heading {
    font-size: 18px;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.isDark ? 'white' : '#000'};
    line-height: 2;
  }

  .table-body {
    font-weight: 300;
    font-size: 16px;
    color: ${({ theme }) => theme.isDark ? '#d3d3d5' : '#000'};
    border-bottom: 0.5px solid ${({ theme }) => theme.isDark ? 'rgb(82, 75, 99)' : 'rgb(233, 234, 235)'};
    td {
      padding: 16px 0px;
    }
  }

  .pool-name {
    text-align: left;
  }
`;

const StyledCardValue = styled(CardValue)`
  color: ${({ theme }) => theme.isDark ? '#d3d3d5' : '#000'};
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

const PoolsList = ({ pools }) => {
  const currentDateTime = new Date().getTime() / 1000

	return (
		<OrderBookCard>
			<table className="table mt-3 table-borderless">
				<thead>
					<tr className="table-heading">
						<td className='pool-name'>Pool Name</td>
						<td>Pool Volume 24h</td>
						<td>Pool Liquidity</td>
						<td>Volume/Liquidity</td>
						<td>Pool Age(Days)</td>
						<td>Project ROI</td>
					</tr>
				</thead>
				<tbody>
          {pools.map((pool, index) => {
            const volume = Number(pool.oneDayVolumeUSD ? pool.oneDayVolumeUSD : pool.oneDayVolumeUntracked);
            const apy = ((pool.oneDayVolumeUSD ? pool.oneDayVolumeUSD : pool.oneDayVolumeUntracked) * 0.003 * 365 * 100) /
              (pool.oneDayVolumeUSD && pool.trackedReserveUSD ? pool.trackedReserveUSD : pool.reserveUSD)
            // const apy = (
            //   (Number(pool.oneDayVolumeUSD ? pool.oneDayVolumeUSD : pool.oneDayVolumeUntracked) * 0.003 * 365 * 100) /
            //   Number(pool.oneDayVolumeUSD ? pool.trackedReserveUSD : pool.reserveUSD)
            // )
            // const liquidity = !!pool.trackedReserveUSD ? pool.trackedReserveUSD : pool.reserveUSD;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={`pool-${index}`} className="table-body">
                <td className='pool-name'>{`${pool.token0.symbol} / ${pool.token1.symbol}`}</td>
                <td><StyledCardValue fontSize="16px" decimals={2} value={Number(pool.oneDayVolumeUSD ? pool.oneDayVolumeUSD : pool.oneDayVolumeUntracked)} prefix="$" /></td>
                <td>
                  <StyledCardValue fontSize="16px" decimals={2} value={Number(pool.reserveUSD)} prefix="$" />
                </td>
                <td>{(volume / Number(pool.reserveUSD)).toFixed(2)}%</td>
                <td>{`${((currentDateTime - Number(pool.createdAtTimestamp)) / 86400).toFixed(0)} days`}</td>
                <td style={{ color: '#1bc870' }}>{apy.toFixed(2)}%</td>
              </tr>
            )
          })}
				</tbody>
			</table>
		</OrderBookCard>
	)
}

export default PoolsList
