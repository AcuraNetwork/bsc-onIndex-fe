import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('limitOrders/selectCurrency')
export const switchCurrencies = createAction<void>('limitOrders/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('limitOrders/typeInput')
export const replaceLimitOrdersState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('limitOrders/replaceLimitOrdersState')
export const setRecipient = createAction<{ recipient: string | null }>('limitOrders/setRecipient')
