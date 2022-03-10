/* eslint-disable jsx-a11y/click-events-have-key-events */
// @ts-nocheck
import { CurrencyAmount, currencyEquals, ETHER, Token, Currency } from '@pancakeswap-libs/sdk-v2'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { Button, Text, Flex } from '@onidex-libs/uikit';
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { useSelectedTokenList, WrappedTokenInfo } from 'state/tokens/hooks'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useAddUserToken, useRemoveUserAddedToken } from 'state/user/hooks'
import { useIsUserAddedToken } from 'hooks/useTokens'
import { isTokenOnList } from 'utils'
import Column from '../Column'
import { RowFixed } from '../Row'
import CurrencyLogo, { getTokenLogoURL } from '../CurrencyLogo'
import { MouseoverTooltip } from '../Tooltip'
import { FadedSpan, MenuItem } from './styleds'
import Loader from '../Loader'
import { PlusHelper } from '../QuestionHelper'
// import { getTokenLogoURL } from '../CurrencyLogo'

function currencyKey(currency: Token): string {
  // eslint-disable-next-line no-nested-ternary
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
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

const AddTokenHandler = styled.span`
  margin-left: 4px;
  margin-bottom: -4px;
`;


function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Token }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
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

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style
}: {
  currency: Token
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { ethereum } = window;

  const { account, chainId } = useActiveWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useSelectedTokenList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  const removeToken = useRemoveUserAddedToken()
  const addToken = useAddUserToken()
  const isMetamask = (ethereum && ethereum.isMetaMask && Number(ethereum.chainId) === 56 && isOnSelectedList);

  
  const addTokenToMetamask = (tokenAddress:any, tokenSymbol:any, tokenDecimals:any, tokenImage:any) => {
    if(ethereum) {
      // @ts-ignore
      ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      })
      .then((result:any) => {
        return null;
      })
      .catch((error:any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('We can encrypt anything without the key.');
        } else {
          console.error(error);
        }
      });
    }
    
  }

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} />
      <Column>
        <Text color='textSubtle' title={currency.name} fontWeight={500}>
          {currency.symbol}
          {isMetamask && currency !== ETHER && (
              // <StyledButton
              //   size='sm'
              //   ml='8px'
              //   variant='secondary'
              //   onClick={event => {
              //     addTokenToMetamask(
              //       currency.address,
              //       currency.symbol,
              //       currency.decimals,
              //       getTokenLogoURL(currency.address),
              //     )
              //     event.stopPropagation()
              //   }}
              // >
              
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <AddTokenHandler
                onClick={event => {
                  addTokenToMetamask(
                    currency.address,
                    currency.symbol,
                    currency.decimals,
                    getTokenLogoURL(currency.address),
                  )
                  event.stopPropagation()
                }}>
                <PlusHelper 
                  text="Add to metamask." />
              </AddTokenHandler>
              // </StyledButton>
          )}
        </Text>
        <FadedSpan>
          {!isOnSelectedList && customAdded ? (
            <Text>
              Added by user
              <Button
              variant='secondary'
                onClick={event => {
                  event.stopPropagation()
                  if (chainId && currency instanceof Token) removeToken(chainId, currency.address)
                }}
              >
                (Remove)
              </Button>
            </Text>
          ) : null}
          {!isOnSelectedList && !customAdded ? (
            <Text>
              Found by address
              <Button
              variant='secondary'
                onClick={event => {
                  event.stopPropagation()
                  if (currency instanceof Token) addToken(currency)
                }}
              >
                (Add)
              </Button>
            </Text>
          ) : null}
        </FadedSpan>
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance && <Balance balance={balance} />}
        {(!balance && account) ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH
}: {
  height: number
  currencies: Token[]
  // eslint-disable-next-line react/require-default-props
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Token) => void
  // eslint-disable-next-line react/require-default-props
  otherCurrency?: Currency | null
  // eslint-disable-next-line react/require-default-props
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
}) {
  const itemData = useMemo(() => (showETH ? [Token.ETHER, ...currencies] : currencies), [currencies, showETH])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Token = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency]
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
