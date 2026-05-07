import { create } from 'zustand'
import type { RangeOption, AssetToggle } from '@/types'

interface DashboardState {
  // 기간 선택
  selectedRange: RangeOption

  // 자산 토글 (멀티자산 비교 차트)
  assetToggle: AssetToggle

  // UI 상태
  isSidePanelOpen: boolean

  // Actions
  setRange: (range: RangeOption) => void
  toggleAsset: (asset: keyof AssetToggle) => void
  setSidePanel: (open: boolean) => void
}

export const useDashboardStore = create<DashboardState>(set => ({
  selectedRange: '1M',
  assetToggle: {
    btc: true,
    gold: true,
    usd: true,
    fearGreed: true,
  },
  isSidePanelOpen: true,

  setRange: range => set({ selectedRange: range }),
  toggleAsset: asset =>
    set(state => ({
      assetToggle: {
        ...state.assetToggle,
        [asset]: !state.assetToggle[asset],
      },
    })),
  setSidePanel: open => set({ isSidePanelOpen: open }),
}))
