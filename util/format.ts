/* eslint-disable no-unused-vars */
export enum Range {
  day = 'd',
  week = 'w',
  month = 'm',
}

// FIXME: This Enum could be created from asset list
export enum Token {
  value_atom = 'value_atom',
  value_source = 'value_source',
}

/* eslint-enable no-unused-vars */

export const twoNumber = (num: string): string => {
  let newNum = num
  newNum = newNum + ''
  return newNum.length === 1 ? '0' + newNum : newNum
}

export const timeToDate = (
  time: string | number | { year: string; month: string; day: string }
): Date => {
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

export const formatNumberDecimals = (
  price: number,
  decimals: number = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: decimals,
  }).format(price)
}

export const getDates = (startDate: Date, range: string): Date[] => {
  if (range === Range.month) {
    // let firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    let lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    return [startDate, lastDay]
  }
  if (range === Range.week) {
    let first = startDate.getDate() - startDate.getDay()
    let last = first + 6

    let firstDay = new Date(startDate.setDate(first))
    let lastDay = new Date(firstDay.setDate(last))
    return [startDate, lastDay]
  }
}

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export const formatNumberUnit = (num: number): string => {
  if (Math.abs(num) < 1_000) {
    return String(num)
  } else if (Math.abs(num) < 1_000_000) {
    return parseFloat((num / 1000).toFixed(1)) + 'K' // convert to K for number from > 1000 < 1 million
  } else if (Math.abs(num) < 1_000_000_000) {
    return parseFloat((num / 1_000_000).toFixed(1)) + 'M' // convert to M for number from > 1 million
  } else {
    return parseFloat((num / 1_000_000_000).toFixed(1)).toString()
  }
}

export const formatDateForDisplay = (date: Date, range: string): string => {
  if (range && range !== Range.day) {
    const dates: Date[] = getDates(date, range)
    return `${formatDate(dates[0])} - ${formatDate(dates[1])}`
  }
  return formatDate(date)
}
