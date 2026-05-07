/**
 * 등락률 정규화 유틸
 * BTC(KRW), 금/달러(USD) 등 단위가 다른 자산을 % 기준으로 통일
 * 기준점(base)은 선택된 기간의 첫 번째 데이터 포인트
 */
export const normalize = (current: number, base: number): number => {
  if (base === 0) return 0
  return ((current - base) / base) * 100
}

/**
 * 배열의 첫 번째 유효한 값을 기준점으로 찾기
 */
export const findBase = (values: (number | null)[]): number | null => {
  const first = values.find(v => v !== null && v !== undefined)
  return first ?? null
}
