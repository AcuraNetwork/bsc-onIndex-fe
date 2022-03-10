import gql from 'graphql-tag'

const POOLS_SEARCH = () => {
  const queryString = `
    query pairs {
      pairs(first: 200, orderBy: trackedReserveETH, orderDirection: desc) {
        id
        token0 {
          id
          symbol
          name
          totalLiquidity
          derivedETH
        }
        token1 {
          id
          symbol
          name
          totalLiquidity
          derivedETH
        }
        reserve0
        reserve1
        reserveUSD
        totalSupply
        trackedReserveETH
        reserveETH
        volumeUSD
        untrackedVolumeUSD
        token0Price
        token1Price
        createdAtTimestamp
      }
    }`
  return gql(queryString)
};

export const POOL_DATA = () => {
  const queryString = `
    query pairDayDatas($pairAddress: Bytes!, $date: Int!) {
      pairDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { pairAddress: $pairAddress, date_lt: $date }) {
        id
        date
        dailyVolumeToken0
        dailyVolumeToken1
        dailyVolumeUSD
        totalSupply
        reserveUSD
      }
    }
  `;
  return gql(queryString)
};

export const PAIRS_HISTORICAL_BULK = (block, pairs) => {
  let pairsString = `[`
  pairs.map((pair) => {
      // eslint-disable-next-line no-return-assign
      return (pairsString += `"${pair}"`)
  })
  pairsString += ']'
  const queryString = `
  query pairs {
    pairs(first: 200, where: {id_in: ${pairsString}}, block: {number: ${block}}, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      reserveUSD
      trackedReserveETH
      volumeUSD
      untrackedVolumeUSD
    }
  }
  `
  return gql(queryString)
}


const PairFields = `
  fragment PairFields on Pair {
    id
    token0 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    token1 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
    }
    reserve0
    reserve1
    reserveUSD
    totalSupply
    trackedReserveETH
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    token0Price
    token1Price
    createdAtTimestamp
  }
`

export const PAIR_DATA = (pairAddress, block) => {
  const queryString = `
  ${PairFields}
  query pairs {
    pairs(${block ? `block: {number: ${block}}` : ``} where: { id: "${pairAddress}"} ) {
      ...PairFields
    }
  }`
  return gql(queryString)
}

export default POOLS_SEARCH;
