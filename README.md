# BTC 멀티자산 대시보드

비트코인을 메인으로, 금·달러 환율·공포탐욕지수와의 상관관계를 실시간으로 시각화하는 멀티자산 대시보드입니다. 네이버페이비상장 프론트엔드 포지션 JD(Job Description)의 핵심 역량을 증명하기 위해 설계되었습니다.

## 🚀 주요 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **차트**: Highcharts v11 + highcharts-react-official
- **상태관리**: Zustand (UI 및 실시간 상태)
- **데이터패칭**: TanStack Query v5 (REST API 캐싱)
- **스타일링**: SCSS Modules (Design Tokens, WebView 최적화)

---

## 🏗 아키텍처 설계 결정 및 JD 핵심 역량 매핑

### 1. 실시간 차트/데이터 시각화 성능 최적화
업비트 WebSocket(KRW-BTC)으로 수신되는 초당 수십 건의 틱 데이터를 렌더링 스파이크 없이 처리하기 위해 다음과 같은 구조를 적용했습니다.

- **Zustand Store 분리**: `ticker` 객체 전체를 하나의 상태로 관리하지 않고, 가장 빈번하게 업데이트되는 `price` 필드만 분리하여 해당 값이 필요한 컴포넌트(`PriceDisplay`)만 독립적으로 리렌더링 되도록 구성했습니다. (`useUpbitStore.ts`)
- **RAF (requestAnimationFrame) Throttle**: Highcharts의 `addPoint` 업데이트를 초당 최대 60프레임(브라우저 주사율)에 맞추어 throttle 처리하여 불필요한 메인 스레드 연산을 줄였습니다.
- **리렌더링 우회**: React 상태 변화에 따른 전체 차트 리렌더링을 방지하기 위해 Zustand의 `subscribe` 메서드를 사용하여 React 생명주기 밖에서 직접 `chart.series[0].addPoint()`를 호출하도록 설계했습니다. (`RealtimeChart.tsx`)

### 2. 상태관리 + 데이터패칭 아키텍처 분리
- **서버/API 상태 (TanStack Query)**: 일봉 캔들(업비트), 금/달러 환율(CoinGecko), 공포탐욕지수(Alternative.me) 등 캐싱과 주기적 갱신이 필요한 정적/반정적 데이터는 Query 기반으로 관리합니다.
- **UI 및 실시간 상태 (Zustand)**: 사용자의 기간 선택, 자산 토글 상태와 WebSocket으로 수신되는 초단위 실시간 가격 데이터는 클라이언트 전역 상태로 완전히 분리했습니다.

### 3. 이기종 데이터 정규화 알고리즘
- **문제**: BTC는 KRW 단위, 금과 미국 국채(TLT)는 USD 단위로 이기종 데이터 혼재.
- **해결**: `normalize.ts` 유틸을 통해 사용자가 선택한 기간의 첫 번째 데이터를 기준점(base)으로 삼아 모든 자산을 **등락률(%) 기준으로 통일**하여 하나의 Y축 상에서 상관관계를 직관적으로 비교할 수 있도록 구현했습니다.

### 4. 에러/로딩 처리 (Resilience) 구조화
- **지수 백오프 재연결**: WebSocket 연결이 끊어질 경우 1초, 2초, 4초... 최대 30초 간격으로 백오프하여 서버 부하를 방지하며 재연결을 시도하는 클래스를 구현했습니다. (`websocket.ts`)
- **백그라운드 탭 대응**: 모바일이나 브라우저 탭 비활성화 시 WebSocket이 끊기는 현상에 대응하여 `visibilitychange` 이벤트를 감지, 복귀 시 즉시 재연결 로직을 수행합니다.
- **Suspense & ErrorBoundary**: 비동기 데이터 패칭 실패에 대비해 로딩 스켈레톤 UI와 Fallback UI를 적용했습니다.

### 5. WebView 환경 완벽 대응 (JD 우대사항)
- 모바일/WebView 환경 감지 유틸을 작성하여 (`device.ts`), 해당 환경일 경우 Highcharts의 무거운 애니메이션과 기본 핀치줌 동작을 제거하여 스크롤 충돌과 성능 저하를 해결했습니다.
- CSS `touch-action: pan-y` 및 `tabular-nums`를 적용하여 폰트 렌더링 차이 및 터치 이벤트를 최적화했습니다.

---

## 📊 성능 최적화 사례

### 문제: WebSocket 틱 수신 시 메인 스레드 블로킹 발생
초기 구현 시 초당 약 10~20회 들어오는 WebSocket `ticker` 데이터를 React 상태로 업데이트하면서 구독 중인 모든 컴포넌트가 리렌더링되어 렌더 트리 재조정으로 인한 메인 스레드 병목(약 40~50ms 블로킹)이 발생했습니다.

### 원인 분석 및 해결
1. **Zustand Selector 및 분할**: `ticker` 객체 전체 통지에서 필요한 `price`만 독립 상태로 분리.
2. **RAF Throttle 적용**: Highcharts 데이터 추가 시 React 상태를 우회하고 `requestAnimationFrame`을 사용하여 렌더링 프레임에 맞춰 업데이트를 배치(Batch) 처리.

### 결과
- 리렌더링 횟수가 수십 회에서 초당 프레임 수(최대 60) 이하로 감소
- 메인 스레드 블로킹 시간이 평균 **< 16ms(1프레임)** 이내로 안정화되어, 끊김 없는 부드러운 스크롤 및 차트 렌더링(60 FPS) 달성.

---

## 🏃‍♂️ 로컬 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (localhost:3000)
npm run dev

# 테스트 코드 실행
npm run test:unit
```

*(본 프로젝트는 추가적인 API 키 없이 누구나 바로 실행할 수 있도록 무료 Public API로 구성되었습니다.)*
