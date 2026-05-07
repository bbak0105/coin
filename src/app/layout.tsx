import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import './globals.scss'

export const metadata: Metadata = {
  title: 'BTC 멀티자산 대시보드 — 실시간 비트코인 & 금·달러 상관관계',
  description:
    '비트코인을 메인으로 금·달러 환율·공포탐욕지수와의 상관관계를 실시간으로 시각화하는 멀티자산 대시보드',
  keywords: ['비트코인', 'BTC', '실시간 차트', '금 시세', '달러 환율', '공포탐욕지수'],
  openGraph: {
    title: 'BTC 멀티자산 대시보드',
    description: '실시간 비트코인 & 멀티자산 상관관계 시각화',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // WebView 핀치줌 + Highcharts 줌 충돌 방지
  userScalable: false,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
