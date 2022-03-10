import { configureStore } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import poolsReducer from './pools'
import transactionsReducer from './transactions'
import listsReducer from './tokens/reducer'
import multicallReducer from './multicall/reducer'
import applcationReducer from './application/reducer'
import userReducer from './user/reducer'
import swapReducer from './swap/reducer'
import limitOrdersReducer from './limitOrders/reducer'
import infoReducer from './info'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    pools: poolsReducer,
    transactions: transactionsReducer,
    lists: listsReducer,
    multicall: multicallReducer,
    application: applcationReducer,
    user: userReducer,
    swap: swapReducer,
    info: infoReducer,
    limitOrders: limitOrdersReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})

export default store;

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
