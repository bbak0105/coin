import { type ReactNode, Suspense } from 'react'

interface ChartWrapperProps {
  children: ReactNode
  isLoading?: boolean
  error?: Error | null
  height?: number
}

/** 차트 로딩/에러 래퍼 — Suspense + ErrorBoundary 연동 */
export default function ChartWrapper({ children, isLoading, error, height = 300 }: ChartWrapperProps) {
  if (isLoading) {
    return (
      <div
        style={{
          height,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 10,
          animation: 'pulse 1.5s ease infinite',
        }}
        aria-busy="true"
        aria-label="차트 로딩 중"
      />
    )
  }

  if (error) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4d6a',
          fontSize: '0.875rem',
        }}
        role="alert"
      >
        데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
      </div>
    )
  }

  return <Suspense fallback={<div style={{ height }} aria-busy="true" />}>{children}</Suspense>
}
