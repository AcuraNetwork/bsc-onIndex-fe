import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
// import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import getMasterchefABI from 'utils/getMasterchefABI'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const res = [];
      for (let i = 0; i < farmsConfig.length; i++) {
        const call = [{
          address: getMasterChefAddress(farmsConfig[i].masterChefSymbol),
          name: farmsConfig[i].masterChefSymbol === 'PLOCK' ? 'pendingPLOCK' : 'pendingTBAKE',
          params: [farmsConfig[i].pid, account],
        }];

        const masterChefABI = getMasterchefABI(farmsConfig[i].masterChefSymbol);
        const farmRes = multicall(masterChefABI, call);
        res.push(farmRes);
      }

      const rawResults = await Promise.all(res);
      const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index][0]) }))

      setFarmsWithBalances(results)

      // const calls = farmsConfig.map((farm) => ({
      //   address: getMasterChefAddress(farm.masterChefSymbol),
      //   name: 'pendingTBAKE',
      //   params: [farm.pid, account],
      // }))

      // const rawResults = await multicall(masterChefABI, calls)
      // const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))

      // setFarmsWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export default useFarmsWithBalance
