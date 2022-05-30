import { Button, styled } from 'junoblocks'
import dynamic from 'next/dynamic'
import { getLiquidityData } from 'queries/stats/getLiquidityData'
import React, { useEffect, useState } from 'react'

import { Currency, Data, Filter, Item } from '../charts.types'
import { LiquidityInfo } from './LiquidityInfo'

// In Server side Chart library cannot be imported
// This is used to import Chart Library in Client Side
const ChartLiquidity = dynamic(() => import('./ChartLiquidity'), {
  ssr: false,
})

export const Liquidity = (): JSX.Element => {
  const title: string = 'Liquidity'
  const [dataDay, setDataDay] = useState<Data[]>([])
  const [dataWeek, setDataWeek] = useState<Data[]>([])
  const [dataMonth, setDataMonth] = useState<Data[]>([])
  const [currentData, setCurrantData] = useState<Data[]>([])
  const [currentItem, setCurrentItem] = useState<Item>({
    time: null,
    value: null,
  })
  const [range, setRange] = useState<string>('d')
  const [rangeType, setRangeType] = useState<string>('usd')
  const [currency, setCurrency] = useState<Currency>({
    value: '$',
    before: true,
  })

  useEffect(() => {
    const { dataDay, dataWeek, dataMonth } = getLiquidityData()
    setDataDay(dataDay)
    setDataWeek(dataWeek)
    setDataMonth(dataMonth)
  }, [])

  const changeRange = (value: string) => {
    let data: Data[] = []

    let key: string = ''
    if (rangeType === 'usd') {
      key = 'value'
    } else if (rangeType === 'source') {
      key = 'value_source'
    } else {
      key = 'value_atom'
    }
    if (value === 'd') {
      data = dataDay.map((item: Data) => ({
        time: item.time,
        value: Number(item[key]),
      }))
    } else if (value === 'w') {
      data = dataWeek.map((item) => ({
        time: item.time,
        value: Number(item[key]),
      }))
    } else if (value === 'm') {
      data = dataMonth.map((item) => ({
        time: item.time,
        value: Number(item[key]),
      }))
    }
    setCurrantData(data)
    setCurrentItem({ ...data[data.length - 1] })
    setRange(value)
  }
  const changeRangeType = (value: string) => {
    let data: Data[] = []
    let key: string = ''
    let currency: Currency = {
      value: '$',
      before: true,
    }
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
      data = dataDay.map((item) => ({
        time: item.time,
        value: Number(item[key]),
      }))
    } else if (range === 'w') {
      data = dataWeek.map((item) => ({
        time: item.time,
        value: Number(item[key]),
      }))
    } else if (range === 'm') {
      data = dataMonth.map((item) => ({
        time: item.time,
        value: Number(item[key]),
      }))
    }
    setCurrantData(data)
    setCurrentItem({ ...data[data.length - 1] })
    setRangeType(value)
    setCurrency(currency)
  }

  useEffect(() => {
    if (dataDay.length > 0) changeRange('d')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDay])

  const liquidityFilters: Filter[] = [
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

  const handleOnMouseLeave = () => {
    if (currentData.length > 0)
      setCurrentItem({
        time: currentData[currentData.length - 1].time,
        value: currentData[currentData.length - 1].value,
      })
  }

  return (
    <ChartContainer>
      <InfoContainer>
        <LiquidityInfo
          title={title}
          range={range}
          data={currentItem}
          currency={currency}
        />
        <div>
          {liquidityFilters.map(({ id, values, callback }: Filter) => {
            return (
              <ButtonsGroup key={id}>
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
              </ButtonsGroup>
            )
          })}
        </div>
      </InfoContainer>
      <ChartLiquidity
        data={currentData}
        crossMove={setCurrentItem}
        onMouseLeave={handleOnMouseLeave}
      />
    </ChartContainer>
  )
}

export default Liquidity

const ChartContainer = styled('div', {
  height: '100%',
  display: 'grid',
  gridTemplateRows: '20% 80%',
  gap: 15,
})

const InfoContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
})

const ButtonsGroup = styled('div', {
  marginBottom: 10,
  display: 'flex',
  justifyContent: 'end',
})
