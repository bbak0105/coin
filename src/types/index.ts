// 업비트 WebSocket 수신 데이터 타입
export interface UpbitTicker {
  type: 'ticker'
  code: string // 'KRW-BTC'
  trade_price: number // 현재가
  signed_change_rate: number // 전일 대비 등락률 (소수점, 예: 0.03 = +3%)
  high_price: number // 당일 고가
  low_price: number // 당일 저가
  acc_trade_volume_24h: number // 24시간 거래량
  prev_closing_price: number // 전일 종가
  timestamp: number // ms
}

// 업비트 일봉 캔들 데이터
export interface UpbitCandle {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number // 종가
  timestamp: number
  candle_acc_trade_volume: number
  candle_acc_trade_price: number
  prev_closing_price: number
  change_price: number
  change_rate: number
}

// CoinGecko 응답
export interface CoinGeckoPrice {
  bitcoin: { usd: number; krw: number }
  'pax-gold': { usd: number; krw: number }
}

// 공포탐욕지수 응답
export interface FearGreedItem {
  value: string
  value_classification:
    | 'Extreme Fear'
    | 'Fear'
    | 'Neutral'
    | 'Greed'
    | 'Extreme Greed'
  timestamp: string
}

export interface FearGreedResponse {
  data: FearGreedItem[]
}

// 정규화된 자산 데이터 포인트
export interface NormalizedDataPoint {
  timestamp: number
  btc: number | null
  gold: number | null
  usd: number | null
  fearGreed: number | null
}

// WebSocket 연결 상태
export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

// 기간 선택 옵션
export type RangeOption = '1D' | '1W' | '1M' | '3M'

// 자산 토글 상태
export interface AssetToggle {
  btc: boolean
  gold: boolean
  usd: boolean
  fearGreed: boolean
}

// 공포탐욕 분류 한글 매핑
export const FEAR_GREED_MAP: Record<FearGreedItem['value_classification'], string> = {
  'Extreme Fear': '극공포',
  Fear: '공포',
  Neutral: '중립',
  Greed: '탐욕',
  'Extreme Greed': '극탐욕',
}
