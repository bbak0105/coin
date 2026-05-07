import { memo } from 'react'
import type { WebSocketStatus } from '@/types'
import styles from './ConnectionStatus.module.scss'

interface ConnectionStatusProps {
  status: WebSocketStatus
  reconnectCount: number
}

const STATUS_CONFIG: Record<
  WebSocketStatus,
  { label: string; pulse: boolean }
> = {
  connected: { label: 'LIVE', pulse: true },
  connecting: { label: '연결 중...', pulse: false },
  disconnected: { label: '연결 끊김', pulse: false },
  error: { label: '오류', pulse: false },
}

const ConnectionStatus = memo(function ConnectionStatus({
  status,
  reconnectCount,
}: ConnectionStatusProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div
      className={`${styles.root} ${styles[status]}`}
      role="status"
      aria-label={`WebSocket 상태: ${config.label}`}
    >
      <span className={`${styles.dot} ${config.pulse ? styles.pulse : ''}`} />
      <span className={styles.label}>{config.label}</span>
      {reconnectCount > 0 && status !== 'connected' && (
        <span className={styles.retry}>재연결 {reconnectCount}회</span>
      )}
    </div>
  )
})

export default ConnectionStatus
