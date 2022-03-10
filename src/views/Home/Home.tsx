// @ts-nocheck

import React, { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { Flex } from '@onidex-libs/uikit';
import Page from 'components/layout/Page'
import MobileFooter from 'components/MobileFooter'
import useLatestTrades from 'hooks/useLatestTrades';
import useTokenInfo from 'hooks/useTokenInfo';
import { usePriceBnbBusd } from 'state/hooks';
import { useToken } from 'hooks/useTokens';
import useLocalStorageState from 'hooks/useLocalStorageState';
import TransactionsTable from './components/TransactionsTable';
import CurrencySelector from './components/CurrencySelector';
import TransactionHeader from './components/TransactionHeader';
import TVChartContainer from './components/TVChartContainer';
import PolySwap from './components/PolySwap/PolySwap';
import OrderBook from './components/OrderBook/OrderBook';
import TradingCard from './components/TradingCard';
import PairInfo from './components/PairInfo';
import TradeSection from './components/Spot/TradeSection';
import HistorySection from './components/Spot/HistorySection';
import BottomSection from './components/Spot/BottomSection';

const StyledPage = styled(Page)`
  padding: 8px;
  max-width: 100%;

  article {
    div {
      width: 100% !important;
    }
  }

  .header {
    display: none;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: block;
    }
  }

  .header-mobile {
    display: block;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: none;
    }
  }

  .currency-selector {
    display: block;
    margin-bottom: 16px;
    ${({ theme }) => theme.mediaQueries.sm} {
      display: none;
      margin-bottom: 0;
    }
  }
  /* @media screen and (max-width: 768px) {
    flex-direction: column;
  } */
`;
const PageFlex = styled(Flex)`
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`
const ChartFlex = styled(Flex)`
  @media screen and (max-width: 1144px) {
    flex-direction: column;
  }
`
const TokenDetails = styled.div`
  width: 100%;
`;

const ChartContent = styled(Flex)`
  width: 100%;
`;

const PriceBotChartContainer = styled.div`
  position: absolute;
  opacity: 0;
  display: none;
`;

const WebPage = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 576px) {
    display: none;
  }
`
const MobilePage = styled.div`
  display: none;
  @media screen and (max-width: 576px) {
    display: flex;
    flex-direction: column;
    border-radius: 20px 20px 0;
  }
`

const columns = [
  {
    name: "time",
    label: "Time",
    render: ({ value }: { value: React.ReactNode }): React.ReactNode => value,
  },
  {
    name: "traded",
    label: "Traded",
  },
  {
    name: "tokenPrice",
    label: 'Token Price'
  },
  {
    name: "value",
    label: 'Value'
  },
  {
    name: "dex",
    label: 'Dex'
  }
];

const Home: React.FC = () => {
  const params = useParams();
  const history = useHistory();
  const address = params.tokenAddress ? params.tokenAddress : '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82';
  const [jwtToken, setJwtToken] = useLocalStorageState('jwtToken');
  const latestTrades = useLatestTrades(address, jwtToken);
  const selectedTokenInfo = useTokenInfo(address);
  // const bnbPriceUsd = new BigNumber(0);
  // usePriceBnbBusd();
  const bnbPriceUsd = usePriceBnbBusd();
  // const selectedCurrency = {
  //   name: 'QUICK',
  //   address: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13'
  // }
  const selectedCurrency = useToken(address);

  useEffect(() => {
    const apiParams = new URLSearchParams();
    apiParams.append('password', process.env.REACT_APP_JWT_TOKEN);

    const fetchJwtToken = async () => {
      try {
        const response = await axios.post(`https://dapp-backend-bsc.vercel.app/auth`, apiParams, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        setJwtToken({
          time: new Date().getTime(),
          jwtToken: response.data.token
        });
      } catch (error) {
        console.log('ant : Token Error => ', error);
      }
    };

    if (!jwtToken || (new Date().getTime() - jwtToken.time) >= 86400000) {
      fetchJwtToken();
    }
  }, [jwtToken, setJwtToken]);

  const transactions = 
  selectedTokenInfo && latestTrades ? latestTrades.map(trade => {
    const date = new Date(trade.date.date);
    const timeDate = new Date(Date.UTC(
      date.getFullYear(), date.getMonth(), date.getDate(), trade.block.timestamp.hour, trade.block.timestamp.minute, trade.block.timestamp.second
    ));
    return {
      time: timeDate.toLocaleTimeString(),
      traded: trade.buyCurrency.symbol === selectedTokenInfo.baseCurrency.symbol ? `${trade.buyAmount.toFixed(3)} BNB` : `${trade.sellAmount.toFixed(3)} BNB`,
      tokenPrice: (trade.buyCurrency.symbol === selectedTokenInfo.baseCurrency.symbol ? (trade.buyAmountInUsd / trade.buyAmount).toFixed(3) : (trade.sellAmountInUsd / trade.sellAmount).toFixed(3))
        || selectedTokenInfo ? (selectedTokenInfo.quotePrice * bnbPriceUsd.toNumber()).toFixed(3) : 0,
      value: trade.buyCurrency.symbol === selectedTokenInfo.baseCurrency.symbol ? `$${trade.buyAmountInUsd.toFixed(3)}/${trade.sellAmount.toFixed(3)} BNB`
        :  `$${trade.sellAmountInUsd.toFixed(3)}/${trade.buyAmount.toFixed(3)} BNB`,
      dex: 'PancakeSwap',
      buy: trade.buyCurrency.symbol === selectedTokenInfo.baseCurrency.symbol
    }
  }) : []

  const handleSetCurrency = currency => {
    history.push(`/token/${currency.address}`);
  }

  return (
    <StyledPage> 
      {selectedCurrency && 
        <WebPage>
          <PageFlex>
            {/* <PolySwap /> */}
            <OrderBook latestTrades={latestTrades} selectedTokenInfo={selectedTokenInfo} />
            <ChartContent flexDirection='column'>
              <div className='header'>
                <TransactionHeader 
                  isMobile={false} 
                  selectedCurrency={selectedCurrency}
                  selectedTokenInfo={selectedTokenInfo} 
                  onSetCurrency={handleSetCurrency} />
              </div>
              <ChartFlex>
                <TokenDetails>
                  <div className='currency-selector'>
                    <CurrencySelector isMobile onSetCurrency={handleSetCurrency} />
                  </div>
                  <TVChartContainer jwtToken={jwtToken} containerId='tv_chart_container' selectedCurrency={selectedCurrency} />
                  {/* <PriceBotChartContainer>
                    <TVChartContainer containerId='price_tv_chart_container' priceBot selectedCurrency={priceBotCurrency} />
                  </PriceBotChartContainer> */}
                  <div className='header-mobile'>
                    <TransactionHeader 
                      isMobile 
                      selectedCurrency={selectedCurrency}
                      selectedTokenInfo={selectedTokenInfo} 
                      onSetCurrency={handleSetCurrency} />
                  </div>
                  {/* <HomeBgContainer /> */}
                  <Flex mt='8px' justifyContent='space-between'>
                    {transactions.length > 0 && 
                      <TransactionsTable _columns={columns} _data={transactions} />
                    }
                    <TradingCard />
                  </Flex>
                </TokenDetails>
                <PairInfo selectedTokenInfo={selectedTokenInfo} transactions={transactions === undefined ? null : transactions}/>
                {/* <OrderBook selectedTokenInfo={selectedTokenInfo} /> */}
              </ChartFlex>
            </ChartContent>
          </PageFlex>
          {/* <MobileFooter /> */}
        </WebPage>
      }
      {selectedCurrency && 
        <MobilePage>
          <Flex>
            <TradeSection />
            <HistorySection />
          </Flex>
          <BottomSection jwtToken={jwtToken} containerId='tv_chart_container_mobile' selectedCurrency={selectedCurrency}/>
        </MobilePage>
      }
    </StyledPage>
  )
}

export default Home
