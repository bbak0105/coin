'use client'

import { memo, useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
import { useUpbitCandles } from '@/hooks/useUpbitCandles'
import { useFearGreed } from '@/hooks/useFearGreed'
import { isWebView } from '@/lib/device'
import ChartWrapper from './ChartWrapper'
import styles from './CandleChart.module.scss'

const getChartOptions = (
  candleData: number[][],
  volumeData: number[][],
  fgData: number[][]
): Highcharts.Options => {
  const base: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      height: 400,
      style: { fontFamily: 'inherit' },
      animation: !isWebView(),
      // @ts-expect-error Highcharts types issue
      pinchType: isWebView() ? undefined : 'x',
    },
    title: { text: undefined },
    credits: { enabled: false },
    navigator: { enabled: false },
    scrollbar: { enabled: false },
    rangeSelector: { enabled: false },
    tooltip: {
      split: true,
      backgroundColor: 'rgba(22, 26, 36, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      style: { color: '#f0f2f5' },
    },
    xAxis: {
      type: 'datetime',
      lineColor: 'rgba(255, 255, 255, 0.08)',
      tickColor: 'rgba(255, 255, 255, 0.08)',
    },
    yAxis: [
      {
        labels: { align: 'right', x: -3 },
        title: { text: '가격 (KRW)' },
        height: '60%',
        lineWidth: 2,
        resize: { enabled: true },
        gridLineColor: 'rgba(255, 255, 255, 0.04)',
      },
      {
        labels: { align: 'right', x: -3 },
        title: { text: '거래량' },
        top: '65%',
        height: '15%',
        offset: 0,
        lineWidth: 2,
        gridLineColor: 'rgba(255, 255, 255, 0.04)',
      },
      {
        labels: { align: 'right', x: -3 },
        title: { text: 'F&G' },
        top: '85%',
        height: '15%',
        offset: 0,
        lineWidth: 2,
        gridLineColor: 'rgba(255, 255, 255, 0.04)',
        min: 0,
        max: 100,
        plotBands: [
          { from: 0, to: 25, color: 'rgba(255, 77, 106, 0.1)' }, // 공포
          { from: 75, to: 100, color: 'rgba(38, 216, 138, 0.1)' }, // 탐욕
        ],
      },
    ],
    plotOptions: {
      candlestick: {
        color: '#ff4d6a', // 하락 (업비트 기준 파란/빨간색이지만 글로벌 표준 적용하거나 원하면 변경)
        upColor: '#26d88a', // 상승
        lineColor: '#ff4d6a',
        upLineColor: '#26d88a',
      },
    },
    series: [
      {
        type: 'candlestick',
        name: 'BTC',
        data: candleData,
        yAxis: 0,
      },
      {
        type: 'column',
        name: '거래량',
        data: volumeData,
        yAxis: 1,
        color: 'rgba(255, 255, 255, 0.2)',
      },
      {
        type: 'spline',
        name: '공포탐욕지수',
        data: fgData,
        yAxis: 2,
        color: '#9b59b6',
        lineWidth: 2,
      },
    ],
  }

  return base
}

const CandleChart = memo(function CandleChart() {
  const { data: candles, isLoading: isCandlesLoading, error: candlesError } = useUpbitCandles()
  const { history: fgHistory, isLoading: isFgLoading, error: fgError } = useFearGreed()

  const chartOptions = useMemo(() => {
    if (!candles) return null

    // 업비트 데이터는 최신순이므로 역순으로 정렬 필요
    const sortedCandles = [...candles].reverse()

    const candleData = sortedCandles.map(c => [
      c.timestamp,
      c.opening_price,
      c.high_price,
      c.low_price,
      c.trade_price,
    ])

    const volumeData = sortedCandles.map(c => [c.timestamp, c.candle_acc_trade_volume])

    // 공포탐욕지수 데이터 매핑 (timestamp 기준)
    const fgData = fgHistory
      .map(item => [Number(item.timestamp) * 1000, Number(item.value)])
      .sort((a, b) => a[0] - b[0])

    return getChartOptions(candleData, volumeData, fgData)
  }, [candles, fgHistory])

  const isLoading = isCandlesLoading || isFgLoading
  const error = candlesError || fgError

  return (
    <div className={styles.root}>
      <ChartWrapper isLoading={isLoading} error={error} height={400}>
        {chartOptions && (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType="stockChart"
            options={chartOptions}
            containerProps={{ className: styles.chartContainer }}
          />
        )}
      </ChartWrapper>
    </div>
  )
})

export default CandleChart
