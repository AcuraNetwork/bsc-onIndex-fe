import React, { useContext, useState } from 'react'
import BigNumber from 'bignumber.js';
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useTheme from 'hooks/useTheme'
// import { usePriceCakeBusd, useTotalValue, usePriceBnbBusd, useFarms } from 'state/hooks'
// import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
// import { getCakeAddress } from 'utils/addressHelpers'
import { Menu as UikitMenu } from '@onidex-libs/uikit'
import config, { socials } from './config'
import { ONIDEX_LINKS } from '../../constants';

const Menu = (props) => {
  const [networkIndex, setNetworkIndex] = useState(0)

  const { account, connect, reset } = useWallet()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = new BigNumber(0);
  // usePriceCakeBusd()
  const bnbPriceUSD = new BigNumber(0);
  // usePriceBnbBusd()
  const totalValue = new BigNumber(0);
  // useTotalValue();
  const totalSupply = new BigNumber(0);
  // useTotalSupply()
  // const farmsLP = useFarms()
  const burnedBalance = new BigNumber(0);
  // useBurnedBalance(getCakeAddress())
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0);
  // const farm = farmsLP.find(farmItem => farmItem.lpSymbol === 'TBAKE-BNB LP');

  const handleTabClick = (index) => {
    setNetworkIndex(index)
    const link = ONIDEX_LINKS[index]
    window.open(link, "_self")
  }

  return (
    <UikitMenu
      account={account}
      login={connect}
      logout={reset}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      totalValue={totalValue}
      networkIndex={networkIndex}
      handleTabClick={handleTabClick}
      // lpTotalSupply={farm.lpTotalSupply || 0}
      lpTotalSupply={0}
      circSupply={circSupply}
      bnbPriceUSD={bnbPriceUSD}
      tokenBalanceLP={new BigNumber(0)}
      // tokenBalanceLP={farm.tokenBalanceLP || new BigNumber(0)}
      quoteTokenBalanceLP={new BigNumber(0)}
      // quoteTokenBalanceLP={farm.quoteTokenBalanceLP || new BigNumber(0)}
      links={config}
      socials={socials}
      priceLink="https://www.coingecko.com/en/coins/bakerytools"
      {...props}
    />
  )
}

export default Menu
