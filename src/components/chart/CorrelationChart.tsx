'use client'

import { memo, useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useDashboardStore } from '@/store/dashboardStore'
import { useCorrelationData } from '@/hooks/useCorrelationData'
import { isWebView } from '@/lib/device'
import ChartWrapper from './ChartWrapper'
import styles from './CorrelationChart.module.scss'

const CorrelationChart = memo(function CorrelationChart() {
  const { data, isLoading } = useCorrelationData()
  const { assetToggle } = useDashboardStore()

  const chartOptions = useMemo(() => {
    if (!data || data.length === 0) return null

    const btcSeries = data.map(d => [d.timestamp, d.btc])
    const goldSeries = data.map(d => [d.timestamp, d.gold])
    const usdSeries = data.map(d => [d.timestamp, d.usd])
    const fgSeries = data.map(d => [d.timestamp, d.fearGreed])

    const options: Highcharts.Options = {
      chart: {
        type: 'spline',
        backgroundColor: 'transparent',
        height: 350,
        style: { fontFamily: 'inherit' },
        animation: !isWebView(),
        // @ts-expect-error Highcharts types issue
        pinchType: isWebView() ? undefined : 'x',
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(22, 26, 36, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        style: { color: '#f0f2f5' },
        valueSuffix: '%',
        valueDecimals: 2,
      },
      xAxis: {
        type: 'datetime',
        lineColor: 'rgba(255, 255, 255, 0.08)',
        tickColor: 'rgba(255, 255, 255, 0.08)',
        crosshair: {
          color: 'rgba(255, 255, 255, 0.1)',
          dashStyle: 'Dash',
        },
      },
      yAxis: {
        title: { text: '등락률 (%)' },
        labels: {
          formatter: function () {
            return `${Number(this.value) > 0 ? '+' : ''}${this.value}%`
          },
        },
        gridLineColor: 'rgba(255, 255, 255, 0.04)',
        plotLines: [
          {
            value: 0,
            color: 'rgba(255, 255, 255, 0.2)',
            width: 1,
            zIndex: 2,
          },
        ],
      },
      plotOptions: {
        spline: {
          lineWidth: 2,
          marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } },
        },
      },
      series: [
        {
          type: 'spline',
          name: 'BTC',
          data: btcSeries,
          color: '#f7931a',
          visible: assetToggle.btc,
        },
        {
          type: 'spline',
          name: '금 (PAXG)',
          data: goldSeries,
          color: '#ffd700',
          visible: assetToggle.gold,
        },
        {
          type: 'spline',
          name: '달러 환율',
          data: usdSeries,
          color: '#4caf82',
          visible: assetToggle.usd,
        },
        {
          type: 'spline',
          name: '공포탐욕지수',
          data: fgSeries,
          color: '#9b59b6',
          visible: assetToggle.fearGreed,
          dashStyle: 'ShortDot', // F&G는 점선으로 구분
        },
      ],
    }

    return options
  }, [data, assetToggle])

  return (
    <div className={styles.root}>
      <ChartWrapper isLoading={isLoading} height={350}>
        {chartOptions && (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            containerProps={{ className: styles.chartContainer }}
          />
        )}
      </ChartWrapper>
    </div>
  )
})

export default CorrelationChart
