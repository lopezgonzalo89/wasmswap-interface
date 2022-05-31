import { ChartInfo } from 'components/Chart/ChartInfo'
import { Button } from 'junoblocks'
import dynamic from 'next/dynamic'
import { ButtonsGroup, ChartContainer, InfoContainer } from 'pages/stats'
import { getLiquidityData } from 'queries/stats/getLiquidityData'
import React, { useCallback, useEffect, useState } from 'react'
import { Currency, Data, Datas, Filter, Item } from 'types/charts.types'
import { getDataByRange } from 'util/getDataByRange'

// This is used to import and render Chart Library in Client Side
const Chart = dynamic(() => import('components/Chart/Chart'), {
  ssr: false,
})

export const Liquidity = (): JSX.Element => {
  const title: string = 'Liquidity'
  const [data, setData] = useState<Datas>({})

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
      setRange(idRange)

      const currentData: Data[] = getDataByRange({
        data,
        idRange,
        idToken: token,
      })
      if (currentData) {
        setCurrantData(currentData)
        setCurrentItem({ ...currentData[currentData.length - 1] })
      }
    },
    [data, token]
  )

  const changeToken = (idToken: string) => {
    setToken(idToken)

    const currentData: Data[] = getDataByRange({
      data,
      idRange: range,
      idToken,
    })
    if (currentData) {
      setCurrantData(currentData)
      setCurrentItem({ ...currentData[currentData.length - 1] })
    }

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
    if (data) changeRange('d')
  }, [changeRange, data])

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
      {currentData ? (
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
      ) : (
        // TODO: Add loading
        <div>LOADING</div>
      )}
    </ChartContainer>
  )
}

export default Liquidity
