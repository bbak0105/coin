import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // SCSS 전역 변수/믹스인 자동 import
  sassOptions: {
    additionalData: `@use "@/styles/variables" as *; @use "@/styles/mixins" as *;`,
  },

  // Highcharts 서버 사이드 렌더링 제외 처리를 위한 설정
  transpilePackages: ['highcharts', 'highcharts-react-official'],
}

export default nextConfig
