import { memo } from 'react'
import { formatUSD, formatKRW, formatPercent } from '@/lib/formatters'
import styles from './AssetCard.module.scss'

interface AssetCardProps {
  title: string
  subtitle?: string
  value: number | null
  krwValue?: number | null
  changeRate?: number | null // 정규화된 등락률 (%)
  icon?: React.ReactNode
  color: 'gold' | 'usd' | 'fearGreed'
}

const AssetCard = memo(function AssetCard({
  title,
  subtitle,
  value,
  krwValue,
  changeRate,
  icon,
  color,
}: AssetCardProps) {
  const isPositive = changeRate ? changeRate > 0 : false
  const isNegative = changeRate ? changeRate < 0 : false

  return (
    <div className={`${styles.root} ${styles[color]}`}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
        </div>
        {changeRate !== undefined && changeRate !== null && (
          <div
            className={`${styles.badge} ${
              isPositive ? styles.positive : isNegative ? styles.negative : ''
            }`}
          >
            {formatPercent(changeRate)}
          </div>
        )}
      </div>

      <div className={styles.valueArea}>
        <div className={styles.primaryValue}>
          {value !== null ? (
            color === 'fearGreed' ? (
              value
            ) : (
              formatUSD(value)
            )
          ) : (
            <span className={styles.skeleton} />
          )}
        </div>
        {krwValue !== undefined && krwValue !== null && (
          <div className={styles.secondaryValue}>{formatKRW(krwValue)}</div>
        )}
      </div>
    </div>
  )
})

export default AssetCard
