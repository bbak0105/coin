'use client'

import { memo, useEffect, useRef } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useUpbitStore } from '@/store/upbitStore'
import { isWebView } from '@/lib/device'
import styles from './RealtimeChart.module.scss'

// WebView 환경 분기 옵션
const getChartOptions = (base: Highcharts.Options): Highcharts.Options => {
  if (!isWebView()) return base

  return {
    ...base,
    chart: {
      ...base.chart,
      animation: false,
      // @ts-expect-error Highcharts types issue
      pinchType: undefined, // 핀치줌 비활성화
    },
    plotOptions: {
      ...base.plotOptions,
      series: {
        ...base.plotOptions?.series,
        animation: false,
      },
    },
  }
}

const baseOptions: Highcharts.Options = {
  chart: {
    type: 'line',
    backgroundColor: 'transparent',
    height: 300,
    margin: [20, 0, 30, 0], // top, right, bottom, left
    style: {
      fontFamily: 'inherit',
    },
  },
  title: { text: undefined },
  credits: { enabled: false },
  legend: { enabled: false },
  tooltip: {
    enabled: true,
    backgroundColor: 'rgba(22, 26, 36, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    style: { color: '#f0f2f5' },
    xDateFormat: '%H:%M:%S',
    pointFormat: '<b>{point.y:,.0f} 원</b>',
  },
  xAxis: {
    type: 'datetime',
    labels: {
      style: { color: '#8b95a8' },
      formatter: function () {
        return Highcharts.dateFormat('%H:%M', Number(this.value))
      },
    },
    lineColor: 'rgba(255, 255, 255, 0.08)',
    tickColor: 'rgba(255, 255, 255, 0.08)',
    gridLineWidth: 0,
    crosshair: {
      color: 'rgba(255, 255, 255, 0.1)',
      dashStyle: 'Dash',
    },
  },
  yAxis: {
    title: { text: undefined },
    labels: { enabled: false },
    gridLineColor: 'rgba(255, 255, 255, 0.04)',
    crosshair: {
      color: 'rgba(255, 255, 255, 0.1)',
      dashStyle: 'Dash',
    },
  },
  plotOptions: {
    series: {
      color: '#f7931a', // BTC 오렌지
      lineWidth: 2,
      marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
      states: { hover: { lineWidth: 2 } },
      animation: { duration: 150 }, // 부드러운 이동
    },
  },
  series: [
    {
      type: 'line',
      name: 'BTC',
      data: [],
    },
  ],
}

const RealtimeChart = memo(function RealtimeChart() {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const rafRef = useRef<number | null>(null)
  const lastPriceRef = useRef<number | null>(null)
  const isInitialized = useRef(false)

  // 컴포넌트 마운트 시 초기 설정
  useEffect(() => {
    // 하이드레이션 이후에 초기화됨
    isInitialized.current = true
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Zustand Store subscribe (리렌더링 우회)
  useEffect(() => {
    if (!isInitialized.current) return

    const unsubscribe = useUpbitStore.subscribe(state => {
      const { ticker } = state
      if (!ticker) return

      // 중복 데이터 방지
      if (lastPriceRef.current === ticker.trade_price) return
      lastPriceRef.current = ticker.trade_price

      // RAF Throttle 적용 (초당 최대 60프레임, 보통 브라우저 환경)
      if (rafRef.current !== null) return // 이미 예약된 프레임이 있으면 무시

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null

        const chart = chartRef.current?.chart
        if (!chart) return

        const series = chart.series[0]
        if (!series) return

        const shift = series.data.length > 100 // 100개 데이터 포인트 유지

        // addPoint로 특정 포인트만 업데이트 (전체 리렌더 방지)
        series.addPoint(
          [ticker.timestamp, ticker.trade_price],
          true, // redraw
          shift, // shift
          !isWebView() // animation
        )
      })
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className={styles.root}>
      <HighchartsReact
        highcharts={Highcharts}
        options={getChartOptions(baseOptions)}
        ref={chartRef}
        containerProps={{ className: styles.chartContainer }}
      />
    </div>
  )
})

export default RealtimeChart
