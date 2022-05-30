import { Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'

// TODO: move functions
export const twoNumber = (num) => {
  let newNum = num
  newNum = newNum + ''
  return newNum.length === 1 ? '0' + newNum : newNum
}

export const timeToDate = (time) => {
  switch (typeof time) {
    case 'string':
      return new Date(time)
    case 'number':
      return new Date(time * 1_000)
    case 'object':
      return new Date(
        `${twoNumber(time.year)}/${twoNumber(time.month)}/${twoNumber(
          time.day
        )}`
      )
    default:
      return new Date(time)
  }
}

export const formateNumberDecimals = (price, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: decimals,
  }).format(price)
}

export const getDates = (startDate, range) => {
  if (range === 'm') {
    // let firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    let lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    return [startDate, lastDay]
  }
  if (range === 'w') {
    let first = startDate.getDate() - startDate.getDay()
    let last = first + 6

    let firstday = new Date(startDate.setDate(first))
    let lastday = new Date(firstday.setDate(last))
    return [startDate, lastday]
  }
}

export const formatDate = (date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

// TODO: tipificar
export const LiquidityInfo = ({
  title,
  range,
  data,
  currency = { value: '$', before: true },
}): JSX.Element => {
  const [currentInfo, setCurrentInfo] = useState({
    price: '',
    date: '-',
  })

  const formatDateForDisplay = (date, range) => {
    if (range && range !== 'd') {
      let dates = getDates(date, range)
      return `${formatDate(dates[0])} - ${formatDate(dates[1])}`
    }
    return formatDate(date)
  }

  useEffect(() => {
    const formatPriceForDisplay = (price): string => {
      let value = formateNumberDecimals(price, 0)
      if (currency.before) {
        value = `${currency.value}${value}`
      } else {
        value = `${value} ${currency.value}`
      }
      return value
    }

    if (data.time) {
      const item = { price: data.value, date: timeToDate(data.time) }
      setCurrentInfo({
        price: formatPriceForDisplay(item.price),
        date: formatDateForDisplay(item.date, range),
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

export default LiquidityInfo
