import { useEffect, useState } from 'react'
import axios from 'axios';
import { DEX_API_BASE_URL2 } from 'config/constants/endpoints';
import useRefresh from './useRefresh';

const usePairData = (pairAddress, jwtToken) => {
  const [pairData, setPairData] = useState([])
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchPairData = async () => {
      try {
        const result = await axios.get(`${DEX_API_BASE_URL2}pairData?pair=${pairAddress}&exchange=Pancake%20v2&network=bsc`, {
          headers: {
            token: jwtToken.jwtToken
          }
        });
        const dexTrades = [...result.data.tokenLastTrades.data.ethereum.dexTrades];
        setPairData(dexTrades.slice(0, 5));
      // eslint-disable-next-line no-empty
      } catch (error) {
      }
    };

    if (jwtToken) {
      fetchPairData()
    }
  }, [pairAddress, jwtToken, slowRefresh])

  return pairData
}

export default usePairData
