import { Button } from 'junoblocks'
import dynamic from 'next/dynamic'
import { getLiquidityData } from 'queries/stats/getLiquidityData'
import React, { useEffect, useState } from 'react'

import LiquidityInfo from './LiquidityInfo'

// In Server side Chart library cannot be imported
// This is used to import Chart Library in Client Side
const ChartLiquidity = dynamic(() => import('./ChartLiquidity'), {
  ssr: false,
})

export const Liquidity = () => {
  const title = 'Liquidity'
  const [dataDay, setDataDay] = useState([])
  const [dataWeek, setDataWeek] = useState([])
  const [dataMonth, setDataMonth] = useState([])
  const [currentData, setCurrantData] = useState([])
  const [currentItem, setCurrentItem] = useState({ time: null, value: '' })
  const [range, setRange] = useState('d')
  const [rangeType, setRangeType] = useState('usd')
  const [currency, setCurrency] = useState({ value: '$', before: true })

  useEffect(() => {
    const { dataDay, dataWeek, dataMonth } = getLiquidityData()
    setDataDay(dataDay)
    setDataWeek(dataWeek)
    setDataMonth(dataMonth)
  }, [])

  const changeRange = (value) => {
    let data = []
    let key = ''
    if (rangeType === 'usd') {
      key = 'value'
    } else if (rangeType === 'source') {
      key = 'value_source'
    } else {
      key = 'value_atom'
    }
    if (value === 'd') {
      data = dataDay.map((item) => ({ time: item.time, value: item[key] }))
    } else if (value === 'w') {
      data = dataWeek.map((item) => ({ time: item.time, value: item[key] }))
    } else if (value === 'm') {
      data = dataMonth.map((item) => ({ time: item.time, value: item[key] }))
    }
    setCurrantData(data)
    setCurrentItem({ ...data[data.length - 1] })
    setRange(value)
  }

  useEffect(() => {
    if (dataDay.length > 0) changeRange('d')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDay])

  const changeRangeType = (value) => {
    let data = []
    let key = ''
    let currency = { value: '$', before: true }
    if (value === 'usd') {
      key = 'value'
    } else if (value === 'source') {
      key = 'value_source'
      currency = { value: 'SOURCE', before: false }
    } else {
      key = 'value_atom'
      currency = { value: 'ATOM', before: false }
    }
    if (range === 'd') {
      data = dataDay.map((item) => ({ time: item.time, value: item[key] }))
    } else if (range === 'w') {
      data = dataWeek.map((item) => ({ time: item.time, value: item[key] }))
    } else if (range === 'm') {
      data = dataMonth.map((item) => ({ time: item.time, value: item[key] }))
    }
    setCurrantData(data)
    setCurrentItem({ ...data[data.length - 1] })
    setRangeType(value)
    setCurrency(currency)
  }

  const handleOnMouseLeave = () => {
    if (currentData.length > 0)
      setCurrentItem({
        time: currentData[currentData.length - 1].time,
        value: currentData[currentData.length - 1].value,
      })
  }

  const handleCrossMove = (item) => {
    setCurrentItem(item)
  }

  // TODO: move
  const liquidityDataType = [
    {
      id: 'rangeType',
      values: [
        { id: 'usd', label: 'USD' },
        { id: 'atom', label: 'ATOM' },
        { id: 'source', label: 'SOURCE' },
      ],
      callback: changeRangeType,
    },
    {
      id: 'range',
      values: [
        { id: 'd', label: 'D' },
        { id: 'w', label: 'W' },
        { id: 'm', label: 'M' },
      ],
      callback: changeRange,
    },
  ]

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: '20% 80%',
        gap: 15,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <LiquidityInfo
          title={title}
          range={range}
          data={currentItem}
          currency={currency}
        />
        <div>
          {liquidityDataType.map(({ id, values, callback }) => {
            return (
              <div key={id}>
                <div
                  style={{
                    marginBottom: 10,
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  {values.map(({ id, label }) => {
                    return (
                      <Button
                        key={id}
                        variant="secondary"
                        onClick={() => {
                          callback(id)
                        }}
                        css={{
                          color: '$colors$white',
                          marginRight: 2,
                          backgroundColor: `${
                            rangeType === id || range === id
                              ? '$colors$black80'
                              : '$colors$black50'
                          }`,
                        }}
                      >
                        {label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <ChartLiquidity
        data={currentData}
        crossMove={handleCrossMove}
        onMouseLeave={handleOnMouseLeave}
      />
    </div>
  )
}

export default Liquidity
