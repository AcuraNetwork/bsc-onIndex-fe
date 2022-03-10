import BigNumber from 'bignumber.js/bignumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const CAKE_PER_BLOCK = new BigNumber(1)
export const BLOCKS_PER_YEAR = new BigNumber(10512000)
export const BSC_BLOCK_TIME = 3
export const CAKE_POOL_PID = 1
export const BASE_URL = 'http://localhost:3000/'
export const PRICE_BOT_URL = 'https://acura-pricebot-bsc.herokuapp.com'
