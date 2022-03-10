import React, { useState } from 'react';
import styled from 'styled-components';

const FilterInput = ({ value, isMobile, placeholder, onChange }) => {
  // const [searchQuery, setSearchQuery] = useState<string>('')

  const handleInput = event => {
    onChange(event.target.value);
  }

  return (
    <SearchInputWrapper isMobile={isMobile}>
      <SearchInput
        type="number"
        autoComplete='off'
        id="token-search-input"
        placeholder={placeholder}
        value={value}
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
  min-width: 240px;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.isDark ? theme.colors.text : 'black'};
  border-style: solid;
  border: 1px solid #CF203C;
  background-color: ${({ theme }) => theme.isDark ? 'rgba(143,90,255,.05)' : 'white' };
  -webkit-appearance: none;
  height: 44px;
  font-size: 18px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 44px;
    // background-color: ${({ theme }) => theme.isDark ? 'rgba(143,90,255,.05)' : 'rgba(143,90,255,.08)' };
    font-size: 16px;
    min-width: 240px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 240px;
  }

  transition: border 100ms;
  :focus {
    border: 1px solid #CF203C;
    outline: none;
  }
`

const SearchInputWrapper = styled.div<{ isMobile: boolean }>`
  position: relative;
  width: 100%;
  margin-bottom: 8px;
  margin-top: 8px;
  margin-left: 8px;
  margin-right: 8px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 260px;
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
  @media screen and (max-width: 570px) {
    margin-left: 0px;
    margin-right: 0px;
  }
`;

export default FilterInput;