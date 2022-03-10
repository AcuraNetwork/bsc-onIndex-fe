import { isAddress } from '../utils'
import useENSName from './useENSName'
import useENSAddress from './useENSAddress'

/**
 * Given a name or address, does a lookup to resolve to an address and name
 * @param nameOrAddress ENS name or address
 */
export default function useENS(
  nameOrAddress?: string | null
): { loading: boolean; address: string | null; name: string | null } {
  const validated = isAddress(nameOrAddress)
  const reverseLookup = useENSName(validated || undefined)
  const lookup = useENSAddress(nameOrAddress)

  return {
    loading: reverseLookup.loading || lookup.loading,
    address: validated || lookup.address,
    // eslint-disable-next-line no-nested-ternary
    name: reverseLookup.ENSName ? reverseLookup.ENSName : !validated && lookup.address ? nameOrAddress || null : null
  }
}
