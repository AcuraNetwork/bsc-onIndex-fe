import React from 'react'
import BigNumber from 'bignumber.js'
import Countdown from 'react-countdown'
import { Flex, Text } from '@onidex-libs/uikit'
import isEmpty from '../../../../utils/utility';

interface FarmCardActionsProps {
  pid?: number
  depositedAt?: BigNumber
  stakedBalance?: BigNumber
}

const TimeCount: React.FC<FarmCardActionsProps> = ({ depositedAt, stakedBalance }) => {

  const feeUpdateUnixTime = depositedAt.toNumber() + 259200

  const addZeroTime = (time) => time < 10 ? `0${time}` : time;

  const timeRender = ({ days, hours, minutes, seconds, completed }) => {
    if (!completed) {
      return (
        <div>
          <Text fontSize='14px' ml='32px' >
            0.5 % fee after 3 days
          </Text>
          <Text fontSize='14px' ml='32px' >
            {`${addZeroTime(hours + (days * 24))}  : `}
            {`${addZeroTime(minutes)} : `}
            {`${addZeroTime(seconds)} left`}
          </Text>
          <Text fontSize='14px' ml='32px' >
            2 % fee before 3 days
          </Text>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {!isEmpty(depositedAt) && stakedBalance.toNumber() !== 0 && feeUpdateUnixTime > new Date().getTime() / 1000 ?
        <Flex flexDirection='column'>
          <Countdown
            date={(new Date(feeUpdateUnixTime * 1000)) || 0}
            renderer={timeRender}
            zeroPadTime={3}
          />
        </Flex>
      : null}
    </>
  )
}

export default TimeCount
