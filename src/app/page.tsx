'use client'

import { useUpbitWebSocket } from '@/hooks/useUpbitWebSocket'
import ConnectionStatus from '@/components/ticker/ConnectionStatus'
import PriceDisplay from '@/components/ticker/PriceDisplay'
import StatCard from '@/components/ticker/StatCard'
import RealtimeChart from '@/components/chart/RealtimeChart'
import ChartWrapper from '@/components/chart/ChartWrapper'
import AssetPanel from '@/components/assets/AssetPanel'
import RangeSelector from '@/components/ui/RangeSelector'
import AssetToggle from '@/components/ui/AssetToggle'
import CorrelationChart from '@/components/chart/CorrelationChart'
import CandleChart from '@/components/chart/CandleChart'
import { formatKRW, formatVolume } from '@/lib/formatters'
import styles from './page.module.scss'

export default function DashboardPage() {
  const { price, ticker, status, reconnectCount } = useUpbitWebSocket()

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <span className={styles.coinIcon}>₿</span>
            <h1 className={styles.title}>BTC/KRW</h1>
            <span className={styles.badge}>업비트 실시간</span>
          </div>
          <ConnectionStatus status={status} reconnectCount={reconnectCount} />
        </div>

        <PriceDisplay price={price} changeRate={ticker?.signed_change_rate ?? null} />
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          label="고가 (24H)"
          value={ticker ? formatKRW(ticker.high_price) : null}
          highlight={ticker?.trade_price === ticker?.high_price}
        />
        <StatCard
          label="저가 (24H)"
          value={ticker ? formatKRW(ticker.low_price) : null}
          highlight={ticker?.trade_price === ticker?.low_price}
        />
        <StatCard
          label="거래량 (24H)"
          value={ticker ? `${formatVolume(ticker.acc_trade_volume_24h)} BTC` : null}
        />
      </section>

      <section className={styles.layoutGrid}>
        <div className={styles.mainColumn}>
          <section className={styles.chartSection}>
            <h2 className="sr-only">실시간 비트코인 차트</h2>
            <div className={styles.chartCard}>
              <ChartWrapper isLoading={false} height={300}>
                <RealtimeChart />
              </ChartWrapper>
            </div>
          </section>

          <section className={styles.chartSection}>
            <div className={styles.sectionHeader}>
              <h2>멀티자산 등락률 비교</h2>
              <div className={styles.controls}>
                <AssetToggle />
                <RangeSelector />
              </div>
            </div>
            <div className={styles.chartCard}>
              <CorrelationChart />
            </div>
          </section>

          <section className={styles.chartSection}>
            <h2>일봉 캔들 & 시장 심리</h2>
            <CandleChart />
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <AssetPanel />
        </aside>
      </section>
    </main>
  )
}
