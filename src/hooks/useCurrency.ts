import React, { useMemo } from 'react';
import { Token } from '@pancakeswap-libs/sdk-v2'

import { useAllTokens, useToken } from 'hooks/useTokens';
import filterTokens, { isAddress } from 'utils/filterTokens'

const CurrencySelector = ({ tokenAddress }) => {
  const allTokens = useAllTokens();
  const isAddressSearch = isAddress(tokenAddress)
  const searchToken = useToken(tokenAddress)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), tokenAddress)
  }, [isAddressSearch, searchToken, allTokens, tokenAddress])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens;
    const symbolMatch = tokenAddress
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((token) => token.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredTokens, tokenAddress, searchToken])

  return filteredSortedTokens;
};

export default CurrencySelector;