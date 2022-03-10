import React, { useCallback } from 'react'
import { ethers } from 'ethers'
import { Token } from '@pancakeswap-libs/sdk-v2'
import styled from 'styled-components'
import { Button, Flex } from '@onidex-libs/uikit'
import { useRegistryContract } from 'hooks/useContracts'
import CurrencyLogo from 'components/CurrencyLogo';
import { Transaction } from './AutoHistoryStyles'

interface TxProps {
  tx: any
  tokenPair: {
    input: Token
    output: Token
  }
}

export default ({ tx, tokenPair }: TxProps) => {
  if (!tx || !tokenPair) return null

  const registryContract = useRegistryContract()

  const cancelTx = useCallback(async () => {
    if (!registryContract) return
    const transaction = await registryContract.cancelHashedReq(tx.id, [
      tx.requester,
      tx.target,
      tx.referer,
      tx.callData,
      tx.initEthSent,
      tx.ethForCall,
      tx.verifySender,
      tx.insertFeeAmount,
      tx.payWithAuto,
    ])
    await transaction.wait()
  }, [tx, registryContract])

  const isMobile = window.innerWidth <= 500
  const inputAmount = ethers.utils.formatUnits(tx.inputAmount, tokenPair.input?.decimals)
  const outputAmount = ethers.utils.formatUnits(tx.outputAmount, tokenPair.output?.decimals)

  return (
    <Transaction>
      <div className="txContainer">
        {/* <small style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'underline' }}>{tx.typeof}</small> */}
        <Flex justifyContent='space-between'>
          <div className="txInfo">
            <p>
              Sell
              <span className="token">
                <CurrencyLogo currency={tokenPair.input} size="14px" style={{ marginRight: '5px' }} />
                {isMobile ? inputAmount.substring(0, 10) : inputAmount.substring(0, 20)}{' '}
                <div style={{ marginLeft: '2px' }}>{tokenPair.input?.symbol}</div>
              </span>
            </p>
            <p>
              Buy
              <span className="token">
                <CurrencyLogo currency={tokenPair.output} size="14px" style={{ marginRight: '5px' }} />
                {isMobile ? outputAmount.substring(0, 10) : outputAmount.substring(0, 20)}{' '}
                <div style={{ marginLeft: '2px' }}> {tokenPair.output?.symbol}</div>
              </span>
            </p>
          </div>
          {/* {tx.status === 'open' && (
            <StyledButton onClick={cancelTx} variant='secondary' color='primary'>Cancel</StyledButton>
          )} */}
        </Flex>
        <Flex justifyContent='space-between' mt='16px' mb='8px'>
          <div className="txTime">
            <small>
              <i>Placed On: {tx.time}</i>
            </small>
          </div>
          {tx.status === 'open' && (
            <StyledButton onClick={cancelTx} variant='secondary' color='primary'>Cancel</StyledButton>
          )}
        </Flex>
        {/* <div className="limit_box_footer">
          <div className="txTime">
            <small>
              <i>Placed On: {tx.time}</i>
            </small>
          </div>
          <div className="action">
            {tx.status === 'open' && (
              <StyledButton onClick={cancelTx} variant='secondary' color='primary'>Cancel</StyledButton>
            )}
          </div>
        </div> */}
      </div>
    </Transaction>
  )
}

const StyledButton = styled(Button)`
  font-size: 12px;
  font-weight: 400;
  width: 56px;
  height: 28px;
  border-radius: 8px;
  margin-left: 16px;

  &:focus:not(:active) {
    box-shadow: none;
  }
`;
