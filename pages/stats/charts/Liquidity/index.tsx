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
  const [token, setToken] = useState<string>('value')
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

  const getDataByRange = ({ idRange, idToken }): Data[] => {
    if (idRange === 'd') {
      return dataDay.map((item: Data) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    } else if (idRange === 'w') {
      return dataWeek.map((item) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    } else if (idRange === 'm') {
      return dataMonth.map((item) => ({
        time: item.time,
        value: Number(item[idToken]),
      }))
    }
  }

  const changeRange = (idRange: string) => {
    const data: Data[] = getDataByRange({ idRange, idToken: token })

    setCurrantData(data)
    setCurrentItem({ ...data[data.length - 1] })
    setRange(idRange)
  }
  const changeToken = (idToken: string) => {
    const data: Data[] = getDataByRange({ idRange: range, idToken })

    setCurrantData(data)
    setCurrentItem({ ...data[data.length - 1] })
    setToken(idToken)

    let currency: Currency = {
      value: '$',
      before: true,
    }
    if (idToken === 'value_source') {
      currency = { value: 'SOURCE', before: false }
    } else if (idToken === 'value_atom') {
      currency = { value: 'ATOM', before: false }
    }
    setCurrency(currency)
  }

  useEffect(() => {
    if (dataDay.length > 0) changeRange('d')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDay])

  const liquidityFilters: Filter[] = [
    {
      id: 'token',
      values: [
        { id: 'value', label: 'USD' },
        { id: 'value_atom', label: 'ATOM' },
        { id: 'value_source', label: 'SOURCE' },
      ],
      callback: changeToken,
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
                          token === id || range === id
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
