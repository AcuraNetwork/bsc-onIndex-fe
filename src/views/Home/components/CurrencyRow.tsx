/* eslint-disable no-nested-ternary */
import { Currency, CurrencyAmount, ETHER, Token } from '@pancakeswap-libs/sdk-v2'
import React from 'react'
import styled from 'styled-components'
import { Text } from '@onidex-libs/uikit'
import Loader from 'components/Loader'
import { useActiveWeb3React } from 'hooks'
import { WrappedTokenInfo } from 'state/tokens/hooks'
import { RowFixed, RowBetween } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { MouseoverTooltip } from 'components/Tooltip'
import { useCurrencyBalance } from 'state/wallet/hooks'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

export const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  background-color: ${({ theme }) => theme.colors.background};
  :hover {
    opacity: 0.6;
    // background-color: ${({ theme, disabled }) => !disabled && theme.colors.invertedContrast};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`


function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const { tags } = currency
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

export default function CurrencyRow({
  currency,
  onSelect,
  isSelected,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
}) {
  const { account } = useActiveWeb3React()
  const key = currencyKey(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      // selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size="24px" />
      <Text title={currency.name}>{currency.symbol}</Text>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}
