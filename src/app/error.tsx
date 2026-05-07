'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '2rem',
        textAlign: 'center',
        color: '#f0f2f5',
      }}
    >
      <h2 style={{ marginBottom: '1rem', color: '#ff4d6a' }}>
        데이터를 불러오는 중 오류가 발생했습니다
      </h2>
      <p style={{ color: '#8b95a8', marginBottom: '2rem' }}>
        네트워크 연결 상태를 확인하고 다시 시도해주세요.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#161a24',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        다시 시도
      </button>
    </div>
  )
}
