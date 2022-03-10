import React, { RefObject, useCallback, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window'

import { isAddress } from '../filtering'

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

const SearchInputSection = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const fixedList = useRef<FixedSizeList>()
  const inputRef = useRef<HTMLInputElement>()
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

  return (
    <SearchInputWrapper isMobile={false}>
      <SearchInput
        type="text"
        autoComplete='off'
        id="pair-search-input"
        placeholder='Search'
        value={searchQuery}
        ref={inputRef as RefObject<HTMLInputElement>}
        onChange={handleInput}
      />
    </SearchInputWrapper>
  );
};

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  border-style: solid;
  border: none;
  background-color: ${({ theme }) => theme.isDark ? 'rgba(82, 51, 51, 0.13)' : 'white' };
  -webkit-appearance: none;
  height: 44px;
  font-size: 18px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 44px;
    background-color: ${({ theme }) => theme.isDark ? 'rgba(82, 51, 51, 0.13)' : 'rgba(82, 51, 51, 0.13)' };
    font-size: 16px;
  }

  transition: border 100ms;
  :focus {
    border: none;
    outline: none;
  }
`

const SearchInputWrapper = styled.div<{ isMobile: boolean }>`
  position: relative;
  margin-top: ${props => props.isMobile && '8px'};

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

export default SearchInputSection;