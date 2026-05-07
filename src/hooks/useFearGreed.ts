import { useQuery } from '@tanstack/react-query'
import type { FearGreedResponse, FearGreedItem } from '@/types'
import { FEAR_GREED_MAP } from '@/types'

const FEAR_GREED_URL = 'https://api.alternative.me/fng/?limit=30'

const fetchFearGreed = async (): Promise<FearGreedResponse> => {
  const res = await fetch(FEAR_GREED_URL)
  if (!res.ok) throw new Error(`공포탐욕지수 API 오류: ${res.status}`)
  return res.json() as Promise<FearGreedResponse>
}

export interface FearGreedData {
  current: FearGreedItem | null
  currentValue: number | null
  currentLabel: string | null
  history: FearGreedItem[]
}

export function useFearGreed() {
  const query = useQuery({
    queryKey: ['fearGreed', 'history-30'],
    queryFn: fetchFearGreed,
    staleTime: 1000 * 60 * 60, // 1시간 캐싱 (하루 1회 업데이트)
    retry: 3,
    refetchOnWindowFocus: false,
  })

  const data = query.data

  const derived: FearGreedData = {
    current: data?.data[0] ?? null,
    currentValue: data?.data[0] ? parseInt(data.data[0].value, 10) : null,
    currentLabel: data?.data[0]
      ? (FEAR_GREED_MAP[data.data[0].value_classification] ?? data.data[0].value_classification)
      : null,
    history: data?.data ?? [],
  }

  return { ...query, ...derived }
}
