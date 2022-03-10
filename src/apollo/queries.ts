import gql from 'graphql-tag'

export const TOKEN_CHART = gql `
  query tokenDayDatas($tokenAddr: String!) {
    tokenDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { token: $tokenAddr }) {
      id
      date
      priceUSD
      totalLiquidityToken
      totalLiquidityUSD
      totalLiquidityETH
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
      
    }
  }
`
export const TRANSACTION_HISTORY = gql `
  query newRequests($account: String, $contract: String) {
    newRequests(
      where: { requester: $account, target: $contract}) {
      id
      timeStamp
      requester
      target
      referer
      callData
      initEthSent
      ethForCall
      verifySender
      payWithAuto
    }
  }
  `
export const CANCELLATION_HISTORY = gql `
  query cancelledRequests($account: String, $contract: String) {
    cancelledRequests(
      where: { requester: $account, target: $contract}) {
      id
      timeStamp
      requester
      target
      wasExecuted
    }
  }
  `

const PairFields = `
  fragment PairFields on Pair {
    id
    trackedReserveETH
    volumeUSD
    reserveUSD
    totalSupply
  }
`

export const PAIRS_BULK = (pairs) => {
    let pairsString = `[`
    pairs.map((pair) => {
        // eslint-disable-next-line no-return-assign
        return (pairsString += `"${pair.toLowerCase()}"`)
    })
    pairsString += ']'
    const queryString = `
  ${PairFields}
  query pairs {
    pairs(first: 1000, where: { id_in: ${pairsString} }, orderBy: trackedReserveETH, orderDirection: desc) {
      ...PairFields
    }
  }
  `
    return gql(queryString)
}


export const PAIRS_HISTORICAL_BULK = (block, pairs) => {
    let pairsString = `[`
    pairs.map((pair) => {
        // eslint-disable-next-line no-return-assign
        return (pairsString += `"${pair.toLowerCase()}"`)
    })
    pairsString += ']'
    const queryString = `
  query pairs {
    pairs(first: 100, where: {id_in: ${pairsString}}, block: {number: ${block}}, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      reserveUSD
      trackedReserveETH
      volumeUSD
      untrackedVolumeUSD
      totalSupply
    }
  }
  `
    return gql(queryString)
}

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