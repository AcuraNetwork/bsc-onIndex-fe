import styled from 'styled-components'
import { Text, Flex } from '@onidex-libs/uikit'

export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
  @media screen and (max-width: 576px) {
    font-size: 12px !important;
  }
`

export const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  flex-direction: column;
  gap: 16px;
  // background-color: ${({ theme }) => theme.card.background};
  background: ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.7)' : '#fff'};
  color: ${({ theme }) => theme.isDark ? '#fff' : '#000'};
  border-radius: 15px;
  // border-radius: ${({ theme }) => theme.radii.card};
`

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

export const Break = styled.div`
  height: 1px;
  width: 100%;
`
