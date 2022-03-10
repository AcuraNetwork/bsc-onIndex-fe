/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import fetchTransactions from './fetchTransactions'
// import { TransactionsState, Pool } from '../types'

const initialState = { data: [] }

export const TransactionsSlice = createSlice({
  name: 'Transactions',
  initialState,
  reducers: {
    setTransactionsData: (state, action) => {
      const livePoolsData = action.payload
      state.data = [...livePoolsData]
    }
  },
})

// Actions
export const { setTransactionsData } = TransactionsSlice.actions

// Thunks
export const fetchTransactionsDataAsync = () => async (dispatch) => {
  const transactions = await fetchTransactions()

  dispatch(setTransactionsData(transactions))
}

export default TransactionsSlice.reducer
