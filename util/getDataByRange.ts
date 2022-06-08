import { Data } from 'types/charts.types'

import { Range } from './format'

export const getDataByRange = ({ data, idRange, idToken }): Data[] => {
  // TODO: check data when removed mockup and set backend API
  if (data?.dataDay) {
    if (idRange === Range.day) {
      return data.dataDay.map((item: Data) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    } else if (idRange === Range.week) {
      return data.dataWeek.map((item) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    } else if (idRange === Range.month) {
      return data.dataMonth.map((item) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    }
  }
}
