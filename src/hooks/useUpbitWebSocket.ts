'use client'

import { useEffect, useRef } from 'react'
import type { UpbitTicker, WebSocketStatus } from '@/types'
import { ExponentialBackoff } from '@/lib/websocket'
import { useUpbitStore } from '@/store/upbitStore'

const WS_URL = 'wss://api.upbit.com/websocket/v1'

const SUBSCRIBE_MSG = JSON.stringify([
  { ticket: 'btc-dashboard' },
  {
    type: 'ticker',
    codes: ['KRW-BTC'],
    isOnlyRealtime: true,
  },
])

export interface UseUpbitWebSocketReturn {
  price: number | null
  ticker: UpbitTicker | null
  status: WebSocketStatus
  reconnectCount: number
}

export function useUpbitWebSocket(): UseUpbitWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null)
  const backoff = useRef(new ExponentialBackoff(1000, 30_000))
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastMessageRef = useRef<number>(0)

  const { setPrice, setTicker, setStatus, incrementReconnect, resetReconnect } = useUpbitStore()

  const price = useUpbitStore(state => state.price)
  const ticker = useUpbitStore(state => state.ticker)
  const status = useUpbitStore(state => state.status)
  const reconnectCount = useUpbitStore(state => state.reconnectCount)

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setStatus('connecting')
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(SUBSCRIBE_MSG)
      setStatus('connected')
      backoff.current.reset()
      resetReconnect()
      lastMessageRef.current = Date.now()

      // 30초 데이터 없음 감지 → 재연결
      heartbeatRef.current = setInterval(() => {
        if (Date.now() - lastMessageRef.current > 30_000) {
          ws.close()
        }
      }, 10_000)
    }

    ws.onmessage = async event => {
      try {
        // 업비트 WebSocket은 Binary 포맷으로 응답 → blob.text()로 파싱
        const text = event.data instanceof Blob ? await event.data.text() : event.data
        const data = JSON.parse(text) as UpbitTicker

        if (data.type === 'ticker') {
          // 렌더링 최적화: price만 분리하여 저장
          setPrice(data.trade_price)
          setTicker(data)
          lastMessageRef.current = Date.now()
        }
      } catch {
        // 파싱 에러는 조용히 무시
      }
    }

    ws.onerror = () => {
      setStatus('error')
    }

    ws.onclose = () => {
      setStatus('disconnected')
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)

      // 지수 백오프 재연결
      incrementReconnect()
      backoff.current.schedule(connect)
    }
  }

  useEffect(() => {
    connect()

    // 탭 비활성화 후 복귀 시 재연결
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          backoff.current.cancel()
          connect()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // 메모리 누수 방지 — cleanup
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      backoff.current.cancel()
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
      wsRef.current?.close()
      wsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { price, ticker, status, reconnectCount }
}
