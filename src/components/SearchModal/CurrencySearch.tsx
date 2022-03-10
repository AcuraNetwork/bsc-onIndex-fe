import { Currency, ETHER, Token } from '@pancakeswap-libs/sdk-v2'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Text, Flex } from '@onidex-libs/uikit';
import ReactGA from 'react-ga'
import { FixedSizeList } from 'react-window'
import { useDispatch } from 'react-redux'
import styled, { ThemeContext } from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useActiveWeb3React } from 'hooks'
import { useAllTokens, useToken } from 'hooks/useTokens'
import { useSelectedListInfo } from 'state/tokens/hooks'
import { selectList } from 'state/tokens/actions'
// import QUICKSWAP_TOKENS_URL from "constants/token/index";

import { AppDispatch } from '../../state'
import { isAddress } from '../../utils'
import { filterTokens } from './filtering'
import { useTokenComparator } from './sorting'
import Column from '../Column'
import Row, { RowBetween } from '../Row'
import CommonBases from './CommonBases'
import { PaddedColumn, Separator } from './styleds'
import SortButton from './SortButton'
import CurrencyList from './CurrencyList'
import ListLogo from '../ListLogo'
import Card from '../Card'
// import QuestionHelper from '../QuestionHelper'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  // eslint-disable-next-line react/require-default-props
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  // eslint-disable-next-line react/require-default-props
  otherSelectedCurrency?: Currency | null
  // eslint-disable-next-line react/require-default-props
  showCommonBases?: boolean
  onChangeList: () => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  onChangeList
}: CurrencySearchProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const dispatch = useDispatch<AppDispatch>()


  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [searchQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

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

  const selectedListInfo = useSelectedListInfo()

//   if (selectedListInfo.current === null) {
//     dispatch(selectList(QUICKSWAP_TOKENS_URL))
//   }
//   selectedListInfo = useSelectedListInfo()


  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <SearchInput
        type="text"
        id="token-search-input"
        placeholder='Search name or paste address'
        value={searchQuery}
        ref={inputRef as RefObject<HTMLInputElement>}
        onChange={handleInput}
        onKeyDown={handleEnter}
      />
      {showCommonBases && (
        <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
      )}
      <Flex alignItems='center' justifyContent='space-between' mb='8px'>
        <Text color='primary' fontSize='16px'>
          Token Name
        </Text>
        <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder(iso => !iso)} />
      </Flex>

      <Separator />

      <CurrencyList
        height={300}
        showETH={showETH}
        currencies={filteredSortedTokens}
        onCurrencySelect={handleCurrencySelect}
        otherCurrency={otherSelectedCurrency}
        selectedCurrency={selectedCurrency}
        fixedListRef={fixedList}
      />
      {/* <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              showETH={showETH}
              currencies={filteredSortedTokens}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div> */}

      <Separator />
      {/* <Card> */}
        <Flex mt='24px' justifyContent='space-between' alignItems='center'>
          <Text color='textSubtle'>Token List</Text>
          <Button
            variant='secondary'
            size='sm'
            onClick={onChangeList}
            id="currency-search-change-list-button"
          >
            {selectedListInfo.current ? 'Change' : 'Select a list'}
          </Button>
        </Flex>
      {/* </Card> */}
    </Column>
  )
}

const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  min-width: 300px;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.isDark ? 'rgba(143,90,255,.05)' : 'white' };
  -webkit-appearance: none;
  height: 44px;
  font-size: 18px;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 44px;
    background-color: ${({ theme }) => theme.isDark ? 'rgba(143,90,255,.05)' : 'rgba(143,90,255,.08)' };
    font-size: 16px;
    min-width: 300px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 300px;
  }

  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`

export default CurrencySearch;