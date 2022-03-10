import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
// import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import farmsConfig from 'config/constants/farms'
import { getMasterChefAddress } from 'utils/addressHelpers'
import getMasterchefABI from 'utils/getMasterchefABI'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchFarmUserAllowances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const masterChefAdress = getMasterChefAddress(farm.masterChefSymbol);
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAdress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string) => {
  const results = [];
  for (let i = 0; i < farmsConfig.length; i++) {
    const call = [{
      address: getMasterChefAddress(farmsConfig[i].masterChefSymbol),
      name: 'userInfo',
      params: [farmsConfig[i].pid, account],
    }];

    const masterChefABI = getMasterchefABI(farmsConfig[i].masterChefSymbol);
    const farmRes = multicall(masterChefABI, call);
    results.push(farmRes);
  }

  const rawStakedBalances = await Promise.all(results);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0][0]._hex).toJSON()
  })

  // const calls = farmsConfig.map((farm) => {
  //   const masterChefAdress = getMasterChefAddress(farm.masterChefSymbol)
  //   return {
  //     address: masterChefAdress,
  //     name: 'userInfo',
  //     params: [farm.pid, account],
  //   }
  // })

  // const rawStakedBalances = await multicall(masterchefABI, calls)
  // const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
  //   return new BigNumber(stakedBalance[0]._hex).toJSON()
  // })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string) => {
  const results = [];
  for (let i = 0; i < farmsConfig.length; i++) {
    const call = [{
      address: getMasterChefAddress(farmsConfig[i].masterChefSymbol),
      name: farmsConfig[i].masterChefSymbol === 'PLOCK' ? 'pendingPLOCK' : 'pendingTBAKE',
      params: [farmsConfig[i].pid, account],
    }];

    const masterChefABI = getMasterchefABI(farmsConfig[i].masterChefSymbol);
    const farmRes = multicall(masterChefABI, call);
    results.push(farmRes);
  }

  const rawEarnings = await Promise.all(results);

  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings[0]).toJSON()
  })

  return parsedEarnings

  // const calls = farmsConfig.map((farm) => {
  //   const masterChefAdress = getMasterChefAddress(farm.masterChefSymbol)
  //   return {
  //     address: masterChefAdress,
  //     name: 'pendingTBAKE',
  //     params: [farm.pid, account],
  //   }
  // })

  // const rawEarnings = await multicall(masterchefABI, calls)
  // const parsedEarnings = rawEarnings.map((earnings) => {
  //   return new BigNumber(earnings).toJSON()
  // })
  // return parsedEarnings
}

export const fetchFarmUserDepositedAt  = async (account: string) => {
  const results = [];
  for (let i = 0; i < farmsConfig.length; i++) {
    const call = [{
      address: getMasterChefAddress(farmsConfig[i].masterChefSymbol),
      name: 'userInfo',
      params: [farmsConfig[i].pid, account],
    }];

    const masterChefABI = getMasterchefABI(farmsConfig[i].masterChefSymbol);
    const farmRes = multicall(masterChefABI, call);
    results.push(farmRes);
  }

  const depositedAtTimes = await Promise.all(results);
  const depositedAtTime = depositedAtTimes.map((depositedAt) => {
    return new BigNumber(depositedAt[0].depositedAt._hex).toJSON()
  })
  

  // const calls = farmsConfig.map((farm) => {
  //   const masterChefAdress = getMasterChefAddress(farm.masterChefSymbol)
  //   return {
  //     address: masterChefAdress,
  //     name: 'userInfo',
  //     params: [farm.pid, account],
  //   }
  // })

  // const depositedAtTimes = await multicall(masterchefABI, calls)
  // const depositedAtTime = depositedAtTimes.map((depositedAt) => {
  //   return new BigNumber(depositedAt.depositedAt._hex).toJSON()
  // })
  return depositedAtTime
}