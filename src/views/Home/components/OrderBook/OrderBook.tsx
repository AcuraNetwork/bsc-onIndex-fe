/* eslint-disable react/react-in-jsx-scope */
import styled, {useTheme} from 'styled-components';
import { Text } from '@onidex-libs/uikit';

import { usePriceCakeBusd, usePriceBnbBusd, useCakePriceUSD } from 'state/hooks';
import AutoHistory from './AutoHistory';

const OrderBookCard = styled.div`
  // background: ${({ theme }) => theme.isDark ? '#070707' : '#fff'};
  // color: ${({ theme }) => theme.isDark ? '#fff' : '#000'};
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
    margin-bottom: 16px;
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
    color: ${({ theme }) => theme.isDark ? '#d3d3d5' : '#000'};
    opacity: 0.79;
    line-height: 2;
  }

  .order_book_table_body {
    font-weight: 300;
    font-size: 14px;
    color: ${({ theme }) => theme.isDark ? '#d3d3d5' : '#000'};
    td {
      padding: 6px 0px;
    }
  }
	@media screen and (max-width: 1144px) {
		width: calc(100% - 16px);
		margin-top: 30px;
	}
`;

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;

	// @media screen and (max-width: 1144px) {
	// 	flex-direction: row;
	// }
	@media screen and (max-width: 490px) {
		flex-direction: column;
	}
`
const OrderBook = ({ selectedTokenInfo, latestTrades }) => {
  // const cakePriceUsd = usePriceCakeBusd();
  const cakePriceUsd = useCakePriceUSD();
  const bnbPriceUsd = usePriceBnbBusd();
  const theme = useTheme()

  const quoteTokenPrice = selectedTokenInfo ? selectedTokenInfo.quotePrice * bnbPriceUsd.toNumber() : cakePriceUsd;

  const maxSellAmount = Math.max(...latestTrades.map(function (o) { return o.sellAmount.toFixed(2) }));
  const maxBuyAmount = Math.max(...latestTrades.map(function (o) { return o.buyAmount.toFixed(2) }));

  return (
    <OrderBookCard>
      <Text fontSize='20px' color='primary'>Order Book</Text>
      <ContentContainer>
        {/* <AutoHistory type='Limit' /> */}
        <table className="table mt-3 table-borderless">
          <thead>
            <tr className="order_book_table_heading">
              <td>Price</td>
              <td>Amount</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {
              latestTrades?.map((item, index) => {
                const price = item.sellAmountInUsd / item.sellAmount
                return (
                  <tr className="order_book_table_body" style={{ background: `linear-gradient(to right, #422641 ${item.sellAmount / maxSellAmount * 100}%, ${theme.isDark ? '#070707' : '#fff'} 1%)` }} key={index.toString()}>
                    <td className="left" style={{ color: '#ef5350' }}>{price.toFixed(2)}</td>
                    <td>{item.sellAmount.toFixed(2)}</td>
                    <td className="right">{item.sellAmountInUsd.toFixed(2)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <table className="table mt-5 table-borderless">
          <thead>
            <tr className="order_book_table_heading">
              <td>Price</td>
              <td>Amount</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {
              latestTrades?.map((item, index) => {
                const price = item.buyAmountInUsd / item.buyAmount
                return (
                  <tr className="order_book_table_body" key={index.toString()} style={{ background: `linear-gradient(to right, #1F4344  ${item.buyAmount / maxBuyAmount * 100}%, ${theme.isDark ? '#070707' : '#fff'} 1%)` }}>
                    <td className="left" style={{ color: '#1bc870', }}>{price.toFixed(2)}</td>
                    <td>{item.buyAmount.toFixed(2)}</td>
                    <td className="right">{item.buyAmountInUsd.toFixed(2)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </ContentContainer>
    </OrderBookCard>
  )
}

export default OrderBook
