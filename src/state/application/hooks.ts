import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../index'
import { addPopup, PopupContent } from './actions'

export function useBlockNumber(): number | undefined {
  // const { chainId } = useActiveWeb3React()
  const chainId = process.env.REACT_APP_CHAIN_ID;

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch]
  )
}


export default useBlockNumber;