import { useEffect, useState } from 'react'
import axios from 'axios';
import useRefresh from './useRefresh'

const useTokenInfo = (tokenAddress) => {
  const [tokenInfo, setTokenInfo] = useState();
  const { slowRefresh } = useRefresh()
  
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const result = await axios({
          url: "https://graphql.bitquery.io/", 
          method: "post",
          data: {
            query: "query GetTokenInfo(\n $tokenAddress: String!) {\n  ethereum(network: bsc) {\n    dexTrades(\n      options: {desc: [\"block.height\",\"tradeIndex\"], limit: 1}\n      exchangeName: {in: [\"Pancake\", \"Pancake v2\"]}\n      baseCurrency: {is: $tokenAddress}\n      quoteCurrency: {is: \"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c\"}\n      date: {after: \"2021-07-28\"}\n    ) {\n      transaction {\n        hash\n      }\n      tradeIndex\n      smartContract {\n        address {\n          address\n        }\n        contractType\n        currency {\n          name\n        }\n      }\n      tradeIndex\n      block {\n        height\n      }\n      baseCurrency {\n        symbol\n        address\n      }\n      quoteCurrency {\n        symbol\n        address\n      }\n      quotePrice\n   \n    }\n  }\n}\n",
            variables: {
              tokenAddress
            }
          }
        });
        setTokenInfo(result.data.data.ethereum.dexTrades[0]);
      // eslint-disable-next-line no-empty
      } catch (error) {
      }
    };

    fetchTokenInfo()
  }, [tokenAddress, slowRefresh])

  return tokenInfo
}

export default useTokenInfo
