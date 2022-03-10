import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import useTokenData from 'hooks/useTokenData';
import { fetchFarmsPublicDataAsync } from './actions'
import { State, Farm } from './types'
import { QuoteToken } from '../config/constants/types'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    // dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = pid => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = pid => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
    depositedAt : farm.userData ? new BigNumber(farm.userData.depositedAt) : new BigNumber(0),
  }
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 4 // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceCakeBusd = (): BigNumber => {
  const pid = 0; // EGG-BUSD LP
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO;
}


export const usePricePlockBusd = (): BigNumber => {
  const bnbPriceUSD = usePriceBnbBusd()
  const pid = 2; // PLOCK-BNB LP
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO;
}


export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteTokenSymbol === QuoteToken.MATIC) {
        val = (bnbPrice.times(farm.lpTotalInQuoteToken));
      } else if (farm.quoteTokenSymbol === QuoteToken.QUICK) {
        val = (cakePrice.times(farm.lpTotalInQuoteToken));
      } else{
        val = (farm.lpTotalInQuoteToken);
      }
      value = value.plus(val);
    }
  }
  return value;
}

export const useCakePriceUSD = () => {
  const d = new Date();
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const utcDate = Date.UTC(year, month, day) / 1000;
  const yesterdayDate = utcDate - (5 * 86400);

  const tokenData = useTokenData('0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', yesterdayDate);
  const tokenPrice = tokenData && tokenData.token ? parseFloat(tokenData.token.derivedUSD) : 0;

  return tokenPrice;
}