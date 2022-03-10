import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from '@onidex-libs/uikit'
import ReactGA from 'react-ga'
import { Currency } from '@pancakeswap-libs/sdk-v2'
import useLast from 'hooks/useLast'
import { ListSelect } from './ListSelect'
import { CurrencySearch } from './CurrencySearch'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  // eslint-disable-next-line react/require-default-props
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  // eslint-disable-next-line react/require-default-props
  otherSelectedCurrency?: Currency | null
  // eslint-disable-next-line react/require-default-props
  showCommonBases?: boolean
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  const handleClickChangeList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Change Lists'
    })
    setListView(true)
  }, [])
  const handleClickBack = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Back'
    })
    setListView(false)
  }, [])

  return (
    <Modal title={listView ? 'Manage List' : 'Select a token'} onDismiss={onDismiss}>
      {listView ? (
        <ListSelect onDismiss={onDismiss} onBack={handleClickBack} />
      ) : (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          onChangeList={handleClickChangeList}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </Modal>
  )
}
