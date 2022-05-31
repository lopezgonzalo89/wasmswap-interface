import { Data } from 'pages/stats/charts/charts.types'

export const getDataByRange = ({ data, idRange, idToken }): Data[] => {
  if (data?.dataDay) {
    if (idRange === 'd') {
      return data.dataDay.map((item: Data) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    } else if (idRange === 'w') {
      return data.dataWeek.map((item) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    } else if (idRange === 'm') {
      return data.dataMonth.map((item) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    }
  }
}
