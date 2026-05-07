// normalize.ts 유닛 테스트
import { describe, it, expect } from 'vitest'
import { normalize, findBase } from '@/lib/normalize'

describe('normalize', () => {
  it('기준 대비 상승 시 양수 반환', () => {
    expect(normalize(110, 100)).toBeCloseTo(10)
  })

  it('기준 대비 하락 시 음수 반환', () => {
    expect(normalize(90, 100)).toBeCloseTo(-10)
  })

  it('기준과 동일하면 0 반환', () => {
    expect(normalize(100, 100)).toBe(0)
  })

  it('기준이 0이면 0 반환 (Division by zero 방지)', () => {
    expect(normalize(100, 0)).toBe(0)
  })
})

describe('findBase', () => {
  it('배열의 첫 번째 유효 값 반환', () => {
    expect(findBase([null, null, 5000])).toBe(5000)
  })

  it('모두 null이면 null 반환', () => {
    expect(findBase([null, null])).toBeNull()
  })
})
