import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ResetCSS } from '@onidex-libs/uikit'
import BigNumber from 'bignumber.js'
import { useFetchPublicData } from 'state/hooks'
import Interceptor from 'Interceptors'
import MobileFooter from 'components/MobileFooter'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
// eslint-disable-next-line import/extensions
import Web3ReactManager from './components/Web3ReactManager';
// import NftGlobalNotification from './views/Nft/components/NftGlobalNotification'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const PoolsExplorer = lazy(() => import('./views/Pools'))
const PriceBot = lazy(() => import('./views/PriceBot'))
const Farms = lazy(() => import("./views/Farms"))
const Swap = lazy(() => import('./views/Swap'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Pools = lazy(() => import('./views/Pools'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Nft = lazy(() => import('./views/Nft'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  useFetchPublicData()

  return (
    <Router>
      {/* <Interceptor /> */}
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Web3ReactManager>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path='/token/:tokenAddress' exact>
                <Home />
              </Route>
              <Route path="/polystake">
                <Farms />
              </Route>
              <Route path="/swap">
                <Swap />
              </Route>
              {/* <Route path="/nests">
              </Route> */}
              <Route path="/pools">
                <PoolsExplorer />
              </Route>
              <Route path="/price-bot">
                <PriceBot />
              </Route>
              {/* <Route path="/lottery"> */}
              {/*  <Lottery /> */}
              {/* </Route> */}
              {/* <Route path="/ifo"> */}
              {/*  <Ifos /> */}
              {/* </Route> */}
              {/* <Route path="/nft"> */}
              {/*  <Nft /> */}
              {/* </Route> */}
              {/* Redirect */}
              {/* <Route path="/staking">
                <Redirect to="/pools" />
              </Route> */}
              {/* <Route path="/syrup"> */}
              {/*  <Redirect to="/pools" /> */}
              {/* </Route> */}
              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </Web3ReactManager>
        </Suspense>
        <MobileFooter />
      </Menu>
      {/* <NftGlobalNotification /> */}
    </Router>
  )
}

export default React.memo(App)
