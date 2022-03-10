
export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
      ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
      return 0
  }
  return adjustedPercentChange
}

export const get2DayPercentChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  // get volume info for both 24 hour periods
  const currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo)
  const previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo)

  const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
      return [currentChange, 0]
  }
  return [currentChange, adjustedPercentChange]
}

export function parseData(data, oneDayData, twoDayData, oneWeekData, ethPrice, oneDayBlock) {
  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
      data?.volumeUSD,
      oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
      twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0
  )
  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
      data?.untrackedVolumeUSD,
      oneDayData?.untrackedVolumeUSD ? parseFloat(oneDayData?.untrackedVolumeUSD) : 0,
      twoDayData?.untrackedVolumeUSD ? twoDayData?.untrackedVolumeUSD : 0
  )

  const oneWeekVolumeUSD = parseFloat(oneWeekData ? data?.volumeUSD - oneWeekData?.volumeUSD : data.volumeUSD)

  const oneWeekVolumeUntracked = parseFloat(
      oneWeekData ? data?.untrackedVolumeUSD - oneWeekData?.untrackedVolumeUSD : data.untrackedVolumeUSD
  )

  let updatedData = {
    ...data,
    oneDayVolumeUSD,
    oneWeekVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    oneWeekVolumeUntracked,
    volumeChangeUntracked,
    trackedReserveUSD: data.trackedReserveETH * ethPrice,
    liquidityChangeUSD: getPercentChange(data.reserveUSD, oneDayData?.reserveUSD)
  }

  // format if pair hasnt existed for a day or a week
  if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
    updatedData = {
      ...updatedData,
      oneDayVolumeUSD: parseFloat(data.volumeUSD)
    }
  }
  if (!oneDayData && data) {
    updatedData = {
      ...updatedData,
      oneDayVolumeUSD: parseFloat(data.volumeUSD)
    }
  }
  if (!oneWeekData && data) {
    updatedData = {
      ...updatedData,
      oneWeekVolumeUSD: parseFloat(data.volumeUSD)
    }
  }

  // format incorrect names
  // updateNameData(data)

  return updatedData
}