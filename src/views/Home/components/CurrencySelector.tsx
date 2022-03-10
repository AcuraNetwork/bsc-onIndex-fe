import React, { KeyboardEvent, RefObject, useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { ETHER, Token, currencyEquals } from '@pancakeswap-libs/sdk-v2'
import styled from 'styled-components';
import { FixedSizeList } from 'react-window'

import { useAllTokens, useToken } from 'hooks/useTokens';
import CurrencyRow from './CurrencyRow';
import filterTokens, { isAddress } from './filtering'

function useOutsideAlerter(ref, onClickOutside) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          onClickOutside();
        }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

const CurrencySelector = ({ selectedCurrency, isMobile, onSetCurrency }) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const fixedList = useRef<FixedSizeList>()
  const inputRef = useRef<HTMLInputElement>()
  const allTokens = useAllTokens();
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)
  const searchResultRef = useRef();
  const [showResultList, setShowResultList] = useState(false);

  const handleHideResultList = () => {
    setShowResultList(false);
  };

  useOutsideAlerter(searchResultRef, handleHideResultList);
  
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
    if (input.length > 0 && !showResultList) {
      setShowResultList(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowResultList])

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens;
    const symbolMatch = searchQuery
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
  }, [filteredTokens, searchQuery, searchToken])

  const handleCurrencySelect = useCallback(currency => {
    setSearchQuery('');
    onSetCurrency(currency);
  }, [onSetCurrency]);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )

  return (
    <SearchInputWrapper isMobile={isMobile}>
      <SearchInput
        type="text"
        autoComplete='off'
        id="token-search-input"
        placeholder='Search name or paste address'
        value={searchQuery}
        ref={inputRef as RefObject<HTMLInputElement>}
        onChange={handleInput}
        onKeyDown={handleEnter}
      />
      <SearchImage src='/images/swap/searchIcon.svg' alt="searchicon" />
      {searchQuery.length > 0 && filteredSortedTokens.length > 0 && showResultList && 
        <div className='search-result' ref={searchResultRef}>
          {filteredSortedTokens.map(currency => {
            const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
            // const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
            return (
              <CurrencyRow
                key={`${currency.address}`}
                currency={currency}
                onSelect={() => handleCurrencySelect(currency)}
                isSelected={isSelected}
              />
            )
          })}
        </div>
      }
    </SearchInputWrapper>
  );
};

const SearchImage = styled.img`
  position: absolute;
  right: 12px;
  top: 12px;
`;

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  /* min-width: 300px; */
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  border-style: solid;
  border: none;
  // border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.isDark ? 'rgba(82, 51, 51, 0.13)' : 'white' };
  -webkit-appearance: none;
  height: 44px;
  font-size: 18px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 44px;
    background-color: ${({ theme }) => theme.isDark ? 'rgba(82, 51, 51, 0.13)' : 'rgba(82, 51, 51, 0.13)' };
    font-size: 16px;
    /* min-width: 300px; */
  }

  ${({ theme }) => theme.mediaQueries.md} {
    /* min-width: 300px; */
  }

  transition: border 100ms;
  :focus {
    border: none;
    // border: 1px solid ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`

const SearchInputWrapper = styled.div<{ isMobile: boolean }>`
  position: relative;
  margin-top: ${props => props.isMobile && '8px'};

  /* ${({ theme }) => theme.mediaQueries.sm} {
    width: 300px;
  } */
 
  @media screen and (min-width: 1114px) {
    width: 320px;
  }
  @media screen and (max-width: 330px) {
    width: 300px;
  }
  input {
    padding-right: 44px;
  }

  .search-result {
    margin-top: 8px;
    position: absolute;
    background-color: ${({ theme }) => theme.colors.background};
    color: black;
    border-radius: 12px;
    padding: 12px;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    max-height: 360px;
    overflow: auto; 
  }
`;

export default CurrencySelector;