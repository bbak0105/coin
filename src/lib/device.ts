/**
 * 디바이스/환경 감지 유틸 (WebView 대응)
 */

/** 인앱 WebView 환경인지 감지 */
export const isWebView = (): boolean => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return (
    /KAKAOTALK|NAVER|Line|Instagram|FB_IAB/.test(ua) ||
    (ua.includes('iPhone') && !ua.includes('Safari')) ||
    (ua.includes('Android') && ua.includes('wv'))
  )
}

/** 모바일 환경인지 감지 */
export const isMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|Android/i.test(navigator.userAgent)
}
