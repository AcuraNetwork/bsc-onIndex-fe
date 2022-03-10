import { acuraClient } from '../client'
import POOLS_SEARCH, { POOL_DATA } from '../queries/pools'

const getPools = async () => {
  const pools = await acuraClient.request(POOLS_SEARCH())
  return pools;
}

export const getPoolData = async pairAddress => {
  const poolData = await acuraClient.request(POOL_DATA(), {
    pairAddress 
  });

  return poolData;
}

export default getPools;

