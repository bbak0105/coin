/**
 * 숫자 포맷 유틸리티
 */

/** KRW 원화 포맷 — ₩148,230,000 */
export const formatKRW = (value: number): string =>
  `₩${value.toLocaleString('ko-KR')}`

/** USD 달러 포맷 — $81,156 */
export const formatUSD = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** 등락률 포맷 — +2.34% / -1.23% */
export const formatChangeRate = (rate: number): string => {
  const sign = rate >= 0 ? '+' : ''
  return `${sign}${(rate * 100).toFixed(2)}%`
}

/** 정규화 % 포맷 — +3.20% */
export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/** 거래량 포맷 — 1.23K / 4.56M */
export const formatVolume = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toFixed(4)
}

/** 환율 포맷 — 1,449원/$ */
export const formatExchangeRate = (value: number): string =>
  `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원/$`
