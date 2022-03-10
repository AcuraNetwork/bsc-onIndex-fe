/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components'
import { ButtonMenu, Text, Flex, ArrowBackIcon, ArrowForwardIcon } from '@onidex-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useBnbPrices } from 'views/Pools/hooks/useBnbPrices';
import { useAllPoolData } from 'state/info/hooks';
import { PoolUpdater } from 'state/info/updaters';
import formatTime from 'utils/date'
import { formatDollarAmount, formatAmount } from 'utils/formatBalance'
import RedStarIcon from 'assets/images/redStar.svg'
import GreyStarIcon from 'assets/images/greyStar.svg'
import SearchInputSection from './SearchInputSection'
import { OrderTypesWrapper, TradeTypeItem } from './AutoHistoryStyles'
import { PageButtons, Arrow } from './shared'

const ITEMS_PER_INFO_TABLE_PAGE = 15;
const ITEMS_PER_TRADE_TABLE_PAGE = 10;

const OrderBookCard = styled.div`
  background: ${({ theme }) => (theme.isDark ? '#070707' : '#fff')};
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000')};
  padding: 16px;
  min-width: 240px;
  width: 25%;
  margin-left: 5px;
  margin-right: 5px;

  // height: 953px;
  border-radius: 15px;
  // padding: 10px 20px;
  text-align: center;

  table {
    width: 100%;
    margin: 16px 0;
  }

  p {
    font-weight: normal;
    font-size: 14px;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .order_book_table_heading {
    font-size: 14px;
    letter-spacing: 0.1em;
    color: ${({ theme }) => (theme.isDark ? '#d3d3d5' : '#000')};
    opacity: 0.79;
    line-height: 2;
  }

  .order_book_table_body {
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 12px;
    color: ${({ theme }) => (theme.isDark ? '#d3d3d5' : '#000')};
    td {
      padding: 6px 0px;
    }

  }
  @media screen and (max-width: 1144px) {
    width: calc(100% - 16px);
    margin-top: 30px;
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  // @media screen and (max-width: 1144px) {
  //   flex-direction: row;
  // }
  @media screen and (max-width: 490px) {
    flex-direction: column;
  }
`

const PairInfo = ({ selectedTokenInfo, transactions }) => {
  const { account } = useWeb3React()
  const [tradeType, setTradeType] = useState(0)
  // const bnbPriceUsd = useBnbPrices();
  // const bnbCurrentPriceUsd = bnbPriceUsd !== undefined ? bnbPriceUsd.current : 0

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [pageTrade, setPageTrade] = useState(1)
  const [marketMaxPage, setMarketMaxPage] = useState(1)

  const allPoolData = useAllPoolData()

  const poolDatas = useMemo(() => {
    const dataList = Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)

    return dataList;
  }, [allPoolData])

  useEffect(() => {
    if (poolDatas){
      let extraPages = 1
      if (poolDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(poolDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages)
      setPage(1);
    }
  }, [poolDatas])

  useEffect(() => {
    if (transactions){
      let extraPages = 1
      if (transactions.length % ITEMS_PER_TRADE_TABLE_PAGE === 0) {
        extraPages = 0
      }
      setMarketMaxPage(Math.floor(transactions.length / ITEMS_PER_TRADE_TABLE_PAGE) + extraPages)
      setPageTrade(1);
    }
  }, [transactions])
  
  const renderPoolData = useMemo(() => {
    const temp = poolDatas.map((_item) => {
      return {
        ..._item,
        fav: false,
      }
    })
    return temp.filter((_pool, i) => i >= (page-1) * ITEMS_PER_INFO_TABLE_PAGE && i < page * ITEMS_PER_INFO_TABLE_PAGE)
  }, [poolDatas, page])

  const handleChangeTradeType = (type) => {
    setTradeType(type)
  }


  const myTradeData1 = useMemo(() => {
    return transactions ?
      transactions.filter((t) => t.sender.toLowerCase() === account?.toLowerCase())
      :
      []
  }, [transactions, account])

  const renderTradeData = useMemo(() => {
    return transactions ?
      transactions.filter((_, i) => i >= (pageTrade-1) * ITEMS_PER_TRADE_TABLE_PAGE && i < pageTrade * ITEMS_PER_TRADE_TABLE_PAGE)
      :
      []
  }, [transactions, pageTrade])

  const renderMyTradeData = useMemo(() => {
    return myTradeData1 ?
      myTradeData1.filter((_, i) => i >= (pageTrade-1) * ITEMS_PER_TRADE_TABLE_PAGE && i < pageTrade * ITEMS_PER_TRADE_TABLE_PAGE)
      :
      []
  }, [myTradeData1, pageTrade])

  const tradeData = tradeType === 0 ? renderTradeData : renderMyTradeData
  const tradeMaxPage = tradeType === 0 ? marketMaxPage : (renderMyTradeData.length + 1)
  
  return (
    <OrderBookCard>
      <PoolUpdater />
      <SearchInputSection />
      <ContentContainer>
        <table className="table mt-5 table-borderless">
          <thead>
            <tr className="order_book_table_heading">
              <td />
              <td>Pair</td>
              <td>Price</td>
              <td>Change</td>
            </tr>
          </thead>
          <tbody>
            {
              renderPoolData.map((_p, i) => {
                return (
                  <tr className="order_book_table_body" key={`${_p.token0.address}/${_p.token1.address}-${_p.volumeUSDChange}`}>
                    {
                      _p.fav ?
                      <img src={RedStarIcon} alt="icon" />:
                      <img src={GreyStarIcon} alt="icon" />
                    }
                    <td style={{ color: '#F1FFF8' }}>{`${_p.token1.symbol}/${_p.token0.symbol}`}</td>
                    <td style={{ color: '#1BC870' }}>{_p.token0Price.toFixed(2)}</td>
                    <td style={{ color: _p.volumeUSDChange < 0 ? '#CF203C' : 'rgb(27, 200, 112)' }}>{_p.volumeUSDChange.toFixed(2)}%</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

        <PageButtons>
          <Arrow
            onClick={() => {
              setPage(page === 1 ? page : page - 1)
            }}
          >
            <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>

          <Text>{`Page ${page} of ${maxPage}`}</Text>

          <Arrow
            onClick={() => {
              setPage(page === maxPage ? page : page + 1)
            }}
          >
            <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
          </Arrow>
        </PageButtons>
        
        <OrderTypesWrapper>
          <ButtonMenu activeIndex={tradeType} variant="primary" onClick={handleChangeTradeType}>
            <TradeTypeItem active={tradeType === 0}>
              Market Trades
            </TradeTypeItem>
            <TradeTypeItem active={tradeType === 1}>
              My Trades
            </TradeTypeItem>
          </ButtonMenu>
        </OrderTypesWrapper>

        <table className="table mt-5 table-borderless">
          <thead>
            <tr className="order_book_table_heading">
              <td>Time</td>
              <td>Traded</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            {
              tradeData.map((_t, index) => {
                const abs0 = Math.abs(_t.amountToken0)
                const abs1 = Math.abs(_t.amountToken1)

                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <tr className="order_book_table_body" key={`${_t.hash}-${index}`}>
                    <td style={{ color: _t.tradeAmt > 0 ? '#1BC870' : '#1BC870' }}>
                      {formatTime(_t.timestamp, 0)}
                    </td>
                    <td style={{ color: _t.tradeAmt > 0 ? '#1BC870' : '#1BC870', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Flex flexDirection="column" alignItems="center" justifyContent="center">
                        <Flex mb="4px">
                          {`${formatAmount(abs0)}`}
                          <p style={{color: '#787878', fontSize: '12px'}}>&nbsp;{`${_t.token0Symbol}->`}</p>
                        </Flex>
                        <Flex> 
                          <p style={{color: '#EF5350', fontSize: '12px'}}>{`${formatAmount(abs1)}`}</p>
                          <p style={{color: '#787878', fontSize: '12px'}}>&nbsp;{`${_t.token1Symbol}`}</p>
                        </Flex>
                      </Flex>
                    </td>
                    <td style={{ color: _t.tradeAmt > 0 ? '#1BC870' : '#1BC870' }}>
                      {formatDollarAmount(_t.amountUSD)}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <PageButtons>
          <Arrow
            onClick={() => {
              setPageTrade(pageTrade === 1 ? pageTrade : pageTrade - 1)
            }}
          >
            <ArrowBackIcon color={pageTrade === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>

          <Text>{`Page ${pageTrade} of ${tradeMaxPage}`}</Text>

          <Arrow
            onClick={() => {
              setPageTrade(pageTrade === tradeMaxPage ? pageTrade : pageTrade + 1)
            }}
          >
            <ArrowForwardIcon color={pageTrade === tradeMaxPage ? 'textDisabled' : 'primary'} />
          </Arrow>
        </PageButtons>
      </ContentContainer>
    </OrderBookCard>
  )
}

export default PairInfo
