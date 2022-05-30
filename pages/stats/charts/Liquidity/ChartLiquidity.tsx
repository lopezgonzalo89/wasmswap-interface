import { createChart } from 'lightweight-charts'
import React, { useEffect, useRef } from 'react'
import { ResizeObserver } from 'resize-observer'

export const formatterNumber = (num) => {
  if (Math.abs(num) < 1_000) {
    return num
  } else if (Math.abs(num) < 1_000_000) {
    return parseFloat((num / 1000).toFixed(1)) + 'K' // convert to K for number from > 1000 < 1 million
  } else if (Math.abs(num) < 1_000_000_000) {
    return parseFloat((num / 1_000_000).toFixed(1)) + 'M' // convert to M for number from > 1 million
  } else {
    return parseFloat((num / 1_000_000_000).toFixed(1)) + 'B' // convert to M for number from > 1 billion
  }
}

// TODO: tipificar
export const ChartLiquidity = ({ data, crossMove, onMouseLeave }) => {
  const chartRef = useRef(null)
  const containerRef = useRef(null)
  const serieRef = useRef(null)
  const resizeObserver = useRef(null)

  useEffect(() => {
    if (chartRef.current && containerRef.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect
        chartRef.current.applyOptions({ width, height })
        setTimeout(() => {
          chartRef.current.timeScale().fitContent()
        }, 0)
      })
      resizeObserver.current.observe(containerRef.current, {
        box: 'content-box',
      })
      return () => {
        resizeObserver.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    // Initialization
    if (chartRef.current === null && containerRef.current) {
      let chart = createChart(containerRef.current, {
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

      serieRef.current = chart.addAreaSeries({
        topColor: 'rgba(196, 164, 106, 0.4)',
        bottomColor: 'rgba(196, 164, 106, 0.0)',
        lineColor: 'rgba(251, 192, 45, 1)',
        lineWidth: 3,
      })
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
  }, [crossMove])

  useEffect(() => {
    // When data is updated
    serieRef.current.setData(data)
    chartRef.current.timeScale().fitContent()
  }, [data])

  return <div onMouseLeave={onMouseLeave} ref={containerRef} />
}

export default ChartLiquidity
