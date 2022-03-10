import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from '@pancakeswap-libs/sdk-v2'
import { useMemo } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'

import { getContract } from 'utils/getContract';
import ENS_ABI from 'constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from 'constants/abis/ens-public-resolver.json'
import WETH_ABI from 'config/abi/weth.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import ERC20_ABI from '../constants/abis/erc20.json'
import {
  REGISTRY_CONTRACT_ADDRESS,
  MIDROUTER_CONTRACT_ADDRESS,
  REGISTRY_CONTRACT_ABI,
  MIDROUTER_CONTRACT_ABI,
// eslint-disable-next-line import/extensions
} from '../constants/autonomy'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>('NETWORK')

  return context.active ? context : contextNetwork
}

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  let address: string | undefined
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useRegistryContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(REGISTRY_CONTRACT_ADDRESS, REGISTRY_CONTRACT_ABI, withSignerIfPossible)
}

export function useMidRouterContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(MIDROUTER_CONTRACT_ADDRESS, MIDROUTER_CONTRACT_ABI, withSignerIfPossible)
}