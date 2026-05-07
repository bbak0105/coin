'use client'

import { memo } from 'react'
import { useDashboardStore } from '@/store/dashboardStore'
import type { AssetToggle as AssetToggleType } from '@/types'
import styles from './AssetToggle.module.scss'

const ASSETS: { key: keyof AssetToggleType; label: string; colorClass: string }[] = [
  { key: 'btc', label: 'BTC', colorClass: styles.btc },
  { key: 'gold', label: '금', colorClass: styles.gold },
  { key: 'usd', label: '달러', colorClass: styles.usd },
  { key: 'fearGreed', label: 'F&G', colorClass: styles.fearGreed },
]

const AssetToggle = memo(function AssetToggle() {
  const { assetToggle, toggleAsset } = useDashboardStore()

  return (
    <div className={styles.root} role="group" aria-label="차트 표시 자산 선택">
      {ASSETS.map(({ key, label, colorClass }) => {
        const isActive = assetToggle[key]
        return (
          <button
            key={key}
            className={`${styles.button} ${isActive ? styles.active : ''} ${
              isActive ? colorClass : ''
            }`}
            onClick={() => toggleAsset(key)}
            aria-pressed={isActive}
          >
            <span className={styles.checkbox}>
              {isActive && (
                <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {label}
          </button>
        )
      })}
    </div>
  )
})

export default AssetToggle
