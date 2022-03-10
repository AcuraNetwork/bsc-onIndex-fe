
import masterchefABI from 'config/abi/masterchef.json'
import plockMasterchefABI from 'config/abi/plockMasterchef.json'

const getMasterchefABI = masterChefSymbol => {
  return masterChefSymbol === 'PLOCK' ? plockMasterchefABI : masterchefABI;
};

export default getMasterchefABI;