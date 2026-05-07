import { useQuery } from '@tanstack/react-query'
import type { CoinGeckoPrice } from '@/types'

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=usd,krw'

const fetchCoinGecko = async (): Promise<CoinGeckoPrice> => {
  const res = await fetch(COINGECKO_URL)
  if (!res.ok) throw new Error(`CoinGecko API 오류: ${res.status}`)
  return res.json() as Promise<CoinGeckoPrice>
}

export interface CoinGeckoData {
  raw: CoinGeckoPrice | undefined
  /** USD/KRW 환율 (bitcoin.krw / bitcoin.usd) */
  usdToKrw: number | null
  /** 금 시세 (PAXG USD) */
  goldPriceUsd: number | null
  /** 금 시세 (PAXG KRW) */
  goldPriceKrw: number | null
  /** BTC USD 가격 */
  btcPriceUsd: number | null
}

export function useCoinGecko() {
  const query = useQuery({
    queryKey: ['coingecko', 'btc-gold-usd'],
    queryFn: fetchCoinGecko,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: 3,
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
    refetchOnWindowFocus: true,
  })

  const data = query.data

  const derived: CoinGeckoData = {
    raw: data,
    usdToKrw: data ? data.bitcoin.krw / data.bitcoin.usd : null,
    goldPriceUsd: data ? data['pax-gold'].usd : null,
    goldPriceKrw: data ? data['pax-gold'].krw : null,
    btcPriceUsd: data ? data.bitcoin.usd : null,
  }

  return { ...query, ...derived }
}
