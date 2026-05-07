/**
 * WebSocket 재연결 로직 — 지수 백오프
 * 1s → 2s → 4s → ... → max 30s
 */
export class ExponentialBackoff {
  private attempt = 0
  private readonly baseDelay: number
  private readonly maxDelay: number
  private timerId: ReturnType<typeof setTimeout> | null = null

  constructor(baseDelay = 1000, maxDelay = 30_000) {
    this.baseDelay = baseDelay
    this.maxDelay = maxDelay
  }

  get currentAttempt(): number {
    return this.attempt
  }

  /** 다음 재연결 대기 시간(ms) 계산 */
  getDelay(): number {
    const delay = Math.min(this.baseDelay * Math.pow(2, this.attempt), this.maxDelay)
    return delay
  }

  /** 재연결 스케줄링 */
  schedule(callback: () => void): void {
    this.cancel()
    const delay = this.getDelay()
    this.timerId = setTimeout(() => {
      this.attempt++
      callback()
    }, delay)
  }

  /** 타이머 취소 */
  cancel(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
  }

  /** 재연결 횟수 초기화 (연결 성공 시 호출) */
  reset(): void {
    this.attempt = 0
    this.cancel()
  }
}
