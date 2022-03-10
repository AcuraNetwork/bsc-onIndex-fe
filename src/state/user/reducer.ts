import { createReducer } from '@reduxjs/toolkit'
import { INITIAL_ALLOWED_SLIPPAGE, DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { updateVersion } from '../global/actions'
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateMatchesDarkMode,
  updateUserDarkMode,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserDeadline,
  toggleURLWarning,
  enableAutonomyPrepay,
  disableAutonomyPrepay,
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  matchesDarkMode: boolean // whether the dark mode media query matches

  userExpertMode: boolean

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }
  
  autonomyPrepay: boolean
  timestamp: number
  URLWarningVisible: boolean
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  userDarkMode: null,
  matchesDarkMode: false,
  userExpertMode: true,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
  autonomyPrepay: false,
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateVersion, state => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        // eslint-disable-next-line no-param-reassign
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        // eslint-disable-next-line no-param-reassign
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      // eslint-disable-next-line no-param-reassign
      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserDarkMode, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.userDarkMode = action.payload.userDarkMode
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.matchesDarkMode = action.payload.matchesDarkMode
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserExpertMode, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.userExpertMode = action.payload.userExpertMode
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.userDeadline = action.payload.userDeadline
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      // eslint-disable-next-line no-param-reassign
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      // eslint-disable-next-line no-param-reassign
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      // eslint-disable-next-line no-param-reassign
      state.tokens[chainId] = state.tokens[chainId] || {}
      // eslint-disable-next-line no-param-reassign
      delete state.tokens[chainId][address]
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        // eslint-disable-next-line no-param-reassign
        state.pairs[chainId] = state.pairs[chainId] || {}
        // eslint-disable-next-line no-param-reassign
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        // eslint-disable-next-line no-param-reassign
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
        // eslint-disable-next-line no-param-reassign
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
      // eslint-disable-next-line no-param-reassign
      state.timestamp = currentTimestamp()
    })
    .addCase(toggleURLWarning, state => {
      // eslint-disable-next-line no-param-reassign
      state.URLWarningVisible = !state.URLWarningVisible
    })
    .addCase(enableAutonomyPrepay, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.autonomyPrepay = true
    })
    .addCase(disableAutonomyPrepay, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.autonomyPrepay = false
    }),
)
