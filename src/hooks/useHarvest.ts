import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from 'state/actions'
import { harvest } from 'utils/callHelpers'
import { useMasterchef } from './useContract'

export const useHarvest = (farmPid: number, masterChefSymbol?: string) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef(masterChefSymbol)

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farms) => {
  const { account } = useWallet()
  const masterChefContract = useMasterchef('')
  const plockMasterChef = useMasterchef('PLOCK')

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farms.reduce((accum, farm) => {
      return [...accum, harvest(farm.masterChefSymbol === 'PLOCK' ? plockMasterChef : masterChefContract, farm.pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farms, masterChefContract, plockMasterChef])

  return { onReward: handleHarvest }
}
