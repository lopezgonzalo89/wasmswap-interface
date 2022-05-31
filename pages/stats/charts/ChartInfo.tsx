import { Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import {
  formatDateForDisplay,
  formateNumberDecimals,
  timeToDate,
} from 'util/format'

import { LiquidityInfoType, Price } from './charts.types'

export const ChartInfo = ({
  title,
  range,
  data,
  currency = { value: '$', before: true },
}: LiquidityInfoType): JSX.Element => {
  const [currentInfo, setCurrentInfo] = useState<Price>({
    price: '',
    date: '-',
  })

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
