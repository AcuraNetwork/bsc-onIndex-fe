import { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
// import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import getMasterchefABI from 'utils/getMasterchefABI'
import useRefresh from './useRefresh'

const useAllEarnings = (masterChefSymbol) => {
  const [balances, setBalance] = useState([])
  const { account }: { account: string } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const res = [];
      const farms = farmsConfig.filter(farm => farm.masterChefSymbol === masterChefSymbol);

      for (let i = 0; i < farms.length; i++) {
        const call = [{
          address: getMasterChefAddress(farms[i].masterChefSymbol),
          name: farms[i].masterChefSymbol === 'PLOCK' ? 'pendingPLOCK' : 'pendingTBAKE',
          params: [farms[i].pid, account],
        }];

        const masterChefABI = getMasterchefABI(farms[i].masterChefSymbol);
        const farmRes = multicall(masterChefABI, call);
        res.push(farmRes);
      }

      const allBalances = await Promise.all(res);
      setBalance(allBalances.map(balance => balance[0]));
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, fastRefresh])

  return balances
}

export default useAllEarnings
