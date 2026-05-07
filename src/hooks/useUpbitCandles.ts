import { useQuery } from '@tanstack/react-query'
import type { UpbitCandle } from '@/types'

const CANDLE_URL = 'https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=200'

const fetchCandles = async (): Promise<UpbitCandle[]> => {
  const res = await fetch(CANDLE_URL)
  if (!res.ok) throw new Error(`업비트 캔들 API 오류: ${res.status}`)
  return res.json() as Promise<UpbitCandle[]>
}

export function useUpbitCandles() {
  return useQuery({
    queryKey: ['upbit', 'candles', 'KRW-BTC'],
    queryFn: fetchCandles,
    staleTime: 1000 * 60 * 60, // 1시간 캐싱
    retry: 3,
    refetchOnWindowFocus: false,
  })
}
