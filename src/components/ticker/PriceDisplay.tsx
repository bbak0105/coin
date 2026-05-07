import { memo } from 'react'
import { formatKRW, formatChangeRate } from '@/lib/formatters'
import styles from './PriceDisplay.module.scss'

interface PriceDisplayProps {
  price: number | null
  changeRate: number | null // 소수점 (0.03 = +3%)
}

const PriceDisplay = memo(function PriceDisplay({ price, changeRate }: PriceDisplayProps) {
  const isPositive = changeRate !== null ? changeRate >= 0 : null
  const changeClass =
    isPositive === null ? '' : isPositive ? styles.positive : styles.negative

  return (
    <div className={styles.root}>
      <div className={`${styles.price} ${changeClass}`} aria-live="polite" aria-atomic="true">
        {price !== null ? formatKRW(price) : <span className={styles.skeleton} />}
      </div>

      <div className={`${styles.change} ${changeClass}`}>
        {changeRate !== null ? (
          <>
            <span className={styles.changeArrow}>{isPositive ? '▲' : '▼'}</span>
            <span className={styles.changeValue}>{formatChangeRate(changeRate)}</span>
          </>
        ) : (
          <span className={styles.skeleton} style={{ width: 80 }} />
        )}
      </div>
    </div>
  )
})

export default PriceDisplay
