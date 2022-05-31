import {
  createChart,
  IChartApi,
  ISeriesApi,
  SeriesType,
} from 'lightweight-charts'
import React, { LegacyRef, MutableRefObject, useEffect, useRef } from 'react'
import { ResizeObserver } from 'resize-observer'
import { ChartType } from 'types/charts.types'
import { formatterNumber } from 'util/format'

export const Chart = ({
  data,
  crossMove,
  onMouseLeave,
  chartType,
  options = {},
}: ChartType): JSX.Element => {
  const chartRef: MutableRefObject<IChartApi> = useRef(null)
  const containerRef: LegacyRef<HTMLDivElement> = useRef(null)
  const serieRef: MutableRefObject<ISeriesApi<SeriesType>> = useRef(null)
  const resizeObserver: MutableRefObject<ResizeObserver> = useRef(null)

  useEffect(() => {
    if (chartRef.current && containerRef.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect
        chartRef.current.applyOptions({ width, height })
        setTimeout(() => {
          chartRef.current.timeScale().fitContent()
        }, 0)
      })
      resizeObserver.current.observe(containerRef.current)
      return () => {
        resizeObserver.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    // Initialization
    if (chartRef.current === null && containerRef.current) {
      const chart: IChartApi = createChart(containerRef.current, {
        rightPriceScale: {
          scaleMargins: {
            bottom: 0,
          },
        },
        layout: {
          backgroundColor: 'rgba(31, 33, 40,0)',
          textColor: '#c3c5cb',
          fontFamily: "'Inter'",
        },
        localization: {
          priceFormatter: (price) => {
            return formatterNumber(price)
          },
        },
        grid: {
          horzLines: {
            visible: false,
          },
          vertLines: {
            visible: false,
          },
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: 'rgba(32, 38, 46, 0.1)',
            labelVisible: false,
          },
        },
        timeScale: {
          rightOffset: 1,
          barSpacing: 28,
          lockVisibleTimeRangeOnResize: true,
        },
      })

      serieRef.current = chart[chartType](options)
      chartRef.current = chart
    }

    const hover = (event) => {
      let item = {
        time: event.time,
        value: event.seriesPrices.get(serieRef.current),
      }
      crossMove(item)
    }
    chartRef.current.subscribeCrosshairMove(hover)
    return () => {
      chartRef.current.unsubscribeCrosshairMove(hover)
    }
  }, [chartType, crossMove, options])

  useEffect(() => {
    serieRef.current.setData(data)
    chartRef.current.timeScale().fitContent()
  }, [data])

  return <div onMouseLeave={onMouseLeave} ref={containerRef} />
}

export default Chart
