'use client'

import { memo } from 'react'
import { useCoinGecko } from '@/hooks/useCoinGecko'
import { useFearGreed } from '@/hooks/useFearGreed'
import AssetCard from './AssetCard'
import styles from './AssetPanel.module.scss'

const AssetPanel = memo(function AssetPanel() {
  const { goldPriceUsd, goldPriceKrw, usdToKrw } = useCoinGecko()
  const { currentValue, currentLabel } = useFearGreed()

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>상관 자산</h2>
      <div className={styles.grid}>
        <AssetCard
          title="금 (PAXG)"
          subtitle="1온스 페깅"
          icon="🥇"
          color="gold"
          value={goldPriceUsd}
          krwValue={goldPriceKrw}
        />
        <AssetCard
          title="달러 환율"
          subtitle="USD/KRW"
          icon="💵"
          color="usd"
          value={usdToKrw}
          // 환율은 krwValue 표시 안함
        />
        <AssetCard
          title="공포탐욕지수"
          subtitle={currentLabel ?? ''}
          icon="😱"
          color="fearGreed"
          value={currentValue}
        />
      </div>
    </div>
  )
})

export default AssetPanel
