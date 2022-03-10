
import { blockClient } from 'subgraph/client';
import { GET_BLOCK, GET_BLOCKS } from 'subgraph/queries/blocks';

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
      let end = list.length
      if (skip + skipCount < list.length) {
          end = skip + skipCount
      }
      const sliced = list.slice(skip, end)
      // eslint-disable-next-line no-await-in-loop
      const result = await localClient.query({
          query: query(...vars, sliced),
          fetchPolicy: 'cache-first',
      })
      fetchedData = {
          ...fetchedData,
          ...result.data,
      }
      if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
          allFound = true
      } else {
          skip += skipCount
      }
  }

  return fetchedData
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
 export async function getBlockFromTimestamp(timestamp) {
  const result = await blockClient.query({
      query: GET_BLOCK,
      variables: {
          timestampFrom: timestamp,
          timestampTo: timestamp + 600,
      },
      fetchPolicy: 'cache-first',
  })
  return result?.data?.blocks?.[0]?.number
}

/**
* @notice Fetches block objects for an array of timestamps.
* @dev blocks are returned in chronological order (ASC) regardless of input.
* @dev blocks are returned at string representations of Int
* @dev timestamps are returns as they were provided; not the block time.
* @param {Array} timestamps
*/
export async function getBlocksFromTimestamps(timestamps, skipCount = 500) {
  if (timestamps?.length === 0) {
      return []
  }

  const fetchedData = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount)

  const blocks = []
  if (fetchedData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
          blocks.push({
              timestamp: t.split('t')[1],
              number: fetchedData[t][0].number,
          })
      }
    }
  }
  return blocks
}