import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useUpbitCandles } from './useUpbitCandles'
import { useFearGreed } from './useFearGreed'
import { useDashboardStore } from '@/store/dashboardStore'
import { normalize, findBase } from '@/lib/normalize'
import type { RangeOption, NormalizedDataPoint } from '@/types'

// CoinGecko Historical API
const fetchHistory = async (id: string, vs: string, days: number) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vs}&days=${days}`
  )
  if (!res.ok) throw new Error('CoinGecko History API Error')
  const data = await res.json()
  return data.prices as [number, number][] // [timestamp, price][]
}

const RANGE_DAYS: Record<RangeOption, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
}

export function useCorrelationData() {
  const { selectedRange } = useDashboardStore()
  const days = RANGE_DAYS[selectedRange]

  // BTC, F&G는 기존 훅 데이터 활용 (Upbit 일봉은 200일치, F&G는 30일치뿐이므로 3M일 땐 F&G가 일부 잘릴 수 있음)
  const { data: candles } = useUpbitCandles()
  const { history: fgHistory } = useFearGreed()

  // 금(PAXG) + 비트코인(USD/KRW 환율 계산용) 히스토리 패칭
  const { data: paxgUsd, isLoading: isPaxgLoading } = useQuery({
    queryKey: ['coingecko', 'history', 'pax-gold', 'usd', days],
    queryFn: () => fetchHistory('pax-gold', 'usd', days),
    staleTime: 1000 * 60 * 60,
  })

  const { data: btcUsd, isLoading: isBtcUsdLoading } = useQuery({
    queryKey: ['coingecko', 'history', 'bitcoin', 'usd', days],
    queryFn: () => fetchHistory('bitcoin', 'usd', days),
    staleTime: 1000 * 60 * 60,
  })

  const { data: btcKrw, isLoading: isBtcKrwLoading } = useQuery({
    queryKey: ['coingecko', 'history', 'bitcoin', 'krw', days],
    queryFn: () => fetchHistory('bitcoin', 'krw', days),
    staleTime: 1000 * 60 * 60,
  })

  const isLoading = isPaxgLoading || isBtcUsdLoading || isBtcKrwLoading

  const normalizedData = useMemo(() => {
    let result: NormalizedDataPoint[] = []

    if (!isLoading && btcKrw && btcUsd && paxgUsd && candles) {
      // 1. 기준 시간축 생성 (1일 단위)
      // eslint-disable-next-line react-hooks/purity
      const now = Date.now()
      const points = []

      // 단순화를 위해 하루에 하나의 포인트만 추출
      for (let i = days; i >= 0; i--) {
        const targetTime = now - i * 24 * 60 * 60 * 1000

        // BTC (Upbit)
        const btcCandle = candles.find(c => c.timestamp <= targetTime)
        const btcPrice = btcCandle ? btcCandle.trade_price : null

        // Gold (PAXG)
        const goldPoint = paxgUsd.find(p => p[0] >= targetTime)
        const goldPrice = goldPoint ? goldPoint[1] : null

        // USD/KRW (BTC_KRW / BTC_USD)
        const usdPoint = btcUsd.find(p => p[0] >= targetTime)
        const krwPoint = btcKrw.find(p => p[0] >= targetTime)
        const usdRate = usdPoint && krwPoint ? krwPoint[1] / usdPoint[1] : null

        // F&G
        const fgPoint = fgHistory.find(f => Number(f.timestamp) * 1000 <= targetTime)
        const fgValue = fgPoint ? Number(fgPoint.value) : null

        points.push({
          timestamp: targetTime,
          btc: btcPrice,
          gold: goldPrice,
          usd: usdRate,
          fearGreed: fgValue,
        })
      }

      // 2. Base 찾기 (배열의 첫 번째 유효한 값)
      const btcBase = findBase(points.map(p => p.btc)) ?? 1
      const goldBase = findBase(points.map(p => p.gold)) ?? 1
      const usdBase = findBase(points.map(p => p.usd)) ?? 1
      const fgBase = findBase(points.map(p => p.fearGreed)) ?? 1

      // 3. 정규화 (%)
      result = points.map(p => ({
        timestamp: p.timestamp,
        btc: p.btc !== null ? normalize(p.btc, btcBase) : null,
        gold: p.gold !== null ? normalize(p.gold, goldBase) : null,
        usd: p.usd !== null ? normalize(p.usd, usdBase) : null,
        fearGreed: p.fearGreed !== null ? normalize(p.fearGreed, fgBase) : null,
      }))
    }

    return result
  }, [isLoading, btcKrw, btcUsd, paxgUsd, candles, fgHistory, days])

  return { data: normalizedData, isLoading }
}
