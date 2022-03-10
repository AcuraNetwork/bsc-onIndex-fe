import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const SearchInputComponent = ({ value, isMobile, onChange }) => {
  // const [searchQuery, setSearchQuery] = useState<string>('')
  
  const handleInput = useCallback((event) => {
    const input = event.target.value
    onChange(input)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SearchInputWrapper isMobile={isMobile}>
      <SearchInput
        type="text"
        autoComplete='off'
        id="token-search-input"
        placeholder='Search...'
        value={value}
        onChange={handleInput}
      />
      <SearchImage src='/images/swap/searchIcon.svg' alt="searchicon" />
    </SearchInputWrapper>
  );
};

const SearchImage = styled.img`
  position: absolute;
  right: 12px;
  top: 20px;
`;

export const SearchInput = styled.input`
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
  color: #48CAE4;
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.isDark ? 'rgba(72, 202, 228,.21)' : 'white' };
  -webkit-appearance: none;
  height: 44px;
  font-size: 18px;
  margin: 8px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 44px;
    background-color: ${({ theme }) => theme.isDark ? 'rgba(72, 202, 228,.21)' : 'rgba(72, 202, 228,.21)' };
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

  ::-webkit-input-placeholder { /* Edge */
    color: #48CAE4;
  }
  
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #48CAE4;
  }
  
  ::placeholder {
    color: #48CAE4;
  }
`

const SearchInputWrapper = styled.div<{ isMobile: boolean }>`
  position: relative;
  width: 100%;
  margin-top: ${props => props.isMobile && '8px'};

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 300px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
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

export default SearchInputComponent;