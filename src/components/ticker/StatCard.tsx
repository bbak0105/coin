import { memo } from 'react'
import styles from './StatCard.module.scss'

interface StatCardProps {
  label: string
  value: string | null
  icon?: string
  highlight?: boolean
}

const StatCard = memo(function StatCard({ label, icon, value, highlight }: StatCardProps) {
  return (
    <div className={`${styles.root} ${highlight ? styles.highlight : ''}`}>
      <div className={styles.label}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {label}
      </div>
      <div className={styles.value}>
        {value ?? <span className={styles.skeleton} />}
      </div>
    </div>
  )
})

export default StatCard
