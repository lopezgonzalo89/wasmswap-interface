import { Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import {
  formatDate,
  formateNumberDecimals,
  getDates,
  timeToDate,
} from 'util/format'

import { LiquidityInfoType, Price } from '../charts.types'

export const LiquidityInfo = ({
  title,
  range,
  data,
  currency = { value: '$', before: true },
}: LiquidityInfoType): JSX.Element => {
  const [currentInfo, setCurrentInfo] = useState<Price>({
    price: '',
    date: '-',
  })

  const formatDateForDisplay = (date: Date, range: string): string => {
    if (range && range !== 'd') {
      const dates: Date[] = getDates(date, range)
      return `${formatDate(dates[0])} - ${formatDate(dates[1])}`
    }
    return formatDate(date)
  }

  useEffect(() => {
    const formatPriceForDisplay = (price: number): string => {
      const value: string = formateNumberDecimals(price, 0)

      return currency.before
        ? `${currency.value}${value}`
        : `${value} ${currency.value}`
    }

    if (data?.time && data?.value) {
      setCurrentInfo({
        price: formatPriceForDisplay(data.value),
        date: formatDateForDisplay(timeToDate(data.time), range),
      })
    }
  }, [currency.before, currency.value, data, range])

  return (
    <div>
      <Text color="white">{title}</Text>
      <Text color="white" variant="hero">
        {currentInfo.price}
      </Text>
      <Text color="white">{currentInfo.date}</Text>
    </div>
  )
}

export default LiquidityInfoType
