import { Button } from 'junoblocks'
import dynamic from 'next/dynamic'
import { ButtonsGroup, ChartContainer, InfoContainer } from 'pages/stats'
import { getLiquidityData } from 'queries/stats/getLiquidityData'
import React, { useCallback, useEffect, useState } from 'react'
import { getDataByRange } from 'util/getDataByRange'

import { ChartInfo } from '../ChartInfo'
import { Currency, Data, Datas, Filter, Item } from '../charts.types'

// In Server side Chart library cannot be imported
// This is used to import Chart Library in Client Side
const Chart = dynamic(() => import('../Chart'), {
  ssr: false,
})

export const Liquidity = (): JSX.Element => {
  const title: string = 'Liquidity'
  const [data, setData] = useState<Datas>({})
  const { dataDay } = data

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
    const data: Datas = getLiquidityData()
    setData(data)
  }, [])

  const changeRange = useCallback(
    (idRange: string) => {
      const currentData: Data[] = getDataByRange({
        data,
        idRange,
        idToken: token,
      })

      setCurrantData(currentData)
      setCurrentItem({ ...currentData[currentData.length - 1] })
      setRange(idRange)
    },
    [data, token]
  )

  const changeToken = (idToken: string) => {
    const currentData: Data[] = getDataByRange({
      data,
      idRange: range,
      idToken,
    })

    setCurrantData(currentData)
    setCurrentItem({ ...currentData[currentData.length - 1] })
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
    if (dataDay?.length > 0) changeRange('d')
  }, [changeRange, dataDay])

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
        <ChartInfo
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
      <Chart
        data={currentData}
        crossMove={setCurrentItem}
        onMouseLeave={handleOnMouseLeave}
        chartType="addAreaSeries"
        options={{
          topColor: 'rgba(196, 164, 106, 0.4)',
          bottomColor: 'rgba(196, 164, 106, 0.0)',
          lineColor: 'rgba(251, 192, 45, 1)',
          lineWidth: 3,
        }}
      />
    </ChartContainer>
  )
}

export default Liquidity
