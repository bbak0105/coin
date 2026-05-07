'use client'

import { memo } from 'react'
import { useDashboardStore } from '@/store/dashboardStore'
import type { RangeOption } from '@/types'
import styles from './RangeSelector.module.scss'

const OPTIONS: RangeOption[] = ['1D', '1W', '1M', '3M']

const RangeSelector = memo(function RangeSelector() {
  const { selectedRange, setRange } = useDashboardStore()

  return (
    <div className={styles.root} role="group" aria-label="기간 선택">
      {OPTIONS.map(option => (
        <button
          key={option}
          className={`${styles.button} ${selectedRange === option ? styles.active : ''}`}
          onClick={() => setRange(option)}
          aria-pressed={selectedRange === option}
        >
          {option}
        </button>
      ))}
    </div>
  )
})

export default RangeSelector
