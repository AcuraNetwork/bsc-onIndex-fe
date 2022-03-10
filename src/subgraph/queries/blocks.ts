import gql from 'graphql-tag'

export const GET_BLOCK = gql `
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
    ) {
      id
      number
      timestamp
    }
  }
`

export const GET_BLOCKS = (timestamps) => {
    let queryString = 'query blocks {'
    queryString += timestamps.map((timestamp) => {
        return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
      number
    }`
    })
    queryString += '}'
    return gql(queryString)
}