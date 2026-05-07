import { create } from 'zustand'
import type { UpbitTicker, WebSocketStatus } from '@/types'

interface UpbitState {
  // 실시간 데이터 — price만 분리하여 필요한 컴포넌트만 리렌더
  price: number | null
  ticker: UpbitTicker | null

  // WebSocket 연결 상태
  status: WebSocketStatus
  reconnectCount: number
  lastUpdatedAt: number | null

  // Actions
  setPrice: (price: number) => void
  setTicker: (ticker: UpbitTicker) => void
  setStatus: (status: WebSocketStatus) => void
  incrementReconnect: () => void
  resetReconnect: () => void
}

export const useUpbitStore = create<UpbitState>(set => ({
  price: null,
  ticker: null,
  status: 'disconnected',
  reconnectCount: 0,
  lastUpdatedAt: null,

  setPrice: price => set({ price, lastUpdatedAt: Date.now() }),
  setTicker: ticker => set({ ticker }),
  setStatus: status => set({ status }),
  incrementReconnect: () => set(state => ({ reconnectCount: state.reconnectCount + 1 })),
  resetReconnect: () => set({ reconnectCount: 0 }),
}))
