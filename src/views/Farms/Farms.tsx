import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styled from 'styled-components';
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Input } from '@onidex-libs/uikit'
import { BLOCKS_PER_YEAR } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'

export interface FarmsProps{
  tokenMode?: boolean
}

const HomeBgContainer = styled.div`
  background-image: url('/images/${({ theme }) => theme.isDark ? 'dark-background.png' : 'light-background.png'}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: -1;
`;

const SearchInput = styled(Input)`
  background: ${({ theme }) => theme.isDark ? 'rgba(229, 229, 229, 0.11)' : 'rgba(255,255,255,0.9)'};
  margin-bottom: 3rem;
  margin-top: 1rem;

  &:focus {
    box-shadow: none !important;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 5rem;
  }
`;
    
const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const {tokenMode} = farmsProps;
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly] = useState(false)

  // const activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
  // const inactiveFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')

  // const stakedOnlyFarms = activeFarms.filter(
  //   (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  // )

  const { activeFarms, inactiveFarms, stakedOnlyFarms } = useMemo(() => {
    const displayedFarms = farmsLP.filter(farm => farm.visible);
    const filteredFarms = displayedFarms.filter(farm => farm.lpSymbol.toLowerCase().includes(searchTerm.toLowerCase()));
    const activeFarmList = filteredFarms.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
    const inactiveFarmList = filteredFarms.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')

    const stakedOnlyFarmList = activeFarmList.filter(
      (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
    )

    return { 
      activeFarms: activeFarmList, 
      inactiveFarms: inactiveFarmList, 
      stakedOnlyFarms: stakedOnlyFarmList 
    };
  }, [searchTerm, tokenMode, farmsLP]);

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const cakeRewardPerBlock = new BigNumber(farm.tokenPerBlock || 1).times(new BigNumber(farm.poolWeight)) .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear);

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice);
        }

        if(totalValue.comparedTo(0) > 0){
          apy = apy.div(totalValue);
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setSearchTerm(inputValue)
  }

  return (
    <Page>
      {/* <Heading as="h1" size="lg" color="primary" mb="50px" style={{ textAlign: 'center' }}>
        {tokenMode ? 'Stake tokens to earn BAKE'
          : 'Stake LP tokens to earn BAKE'
        }
      </Heading>
      <Heading as="h2" color="secondary" mb="50px" style={{ textAlign: 'center' }}>
        Deposit Fee will be used to buyback BAKE
      </Heading>
      <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly}/> */}
      {/* <HomeBgContainer /> */}
      <div>
        <SearchInput
          onChange={handleChange}
          placeholder="Search token..."
          value={searchTerm}
        />
        {/* <Divider /> */}
        <FlexLayout>
          <Route exact path={`${path}`}>
            {stakedOnly ? farmsList(stakedOnlyFarms, false) : farmsList(activeFarms, false)}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsList(inactiveFarms, true)}
          </Route>
        </FlexLayout>
      </div>
    </Page>
  )
}

export default Farms
