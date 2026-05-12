# 코인 세금 계산기 사이트 빌드 프롬프트 템플릿
> 이 문서를 AI 에이전트(Replit Agent, Claude, GPT 등)에게 붙여넣으면  
> CryptoTax.cloud와 동일한 구조의 정적 웹사이트를 처음부터 만들 수 있습니다.

---

## 마스터 프롬프트 (최초 1회 — 전체 구조 세팅)

```
[사이트명]을 위한 정적 HTML/CSS/JS 웹사이트를 만들어줘.

기술 스택:
- 순수 정적 HTML/CSS/JS (빌드 시스템 없음, npm 없음)
- Python3 HTTP 서버로 포트 5000에서 서빙
- 외부 CDN만 허용 (Pretendard 폰트, TradingView 위젯 등)
- 로컬스토리지 키 'ctc-theme'으로 다크/라이트 모드 전환

디자인 시스템 (CSS 변수):
- --orange: #FF8C00 (주요 액센트)
- --bg: #0d0d1a (다크 배경)
- --bg-surface: #1a1a2e (카드 배경)
- --bg-elevated: #24243e (버튼/입력 배경)
- --text: #e8e8f0 (기본 텍스트)
- --text-sub: #9999bb (보조 `ㅡㅊ텍스트)
- --text-muted: #6666aa (약한 호텍스트)
- --green: #3fb950 (상승/성공)ㅕㅌ
- --red: #f85149 (하락/경고)
- --blue: #58a6ff (정보)
- --border: #2a2a4a`쇼 (테두리)
- 라이트모드: [data-theme="light"] 셀렉터로 오버라이드
- 폰트: Pretendard CDN (https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css)
ㅎ
ㅂㅎㅋㅌㅅㅂ프로젝트 구조:>>--
assets/
  css/common.css    — 공통 CSS (nav, footer, drawer, 티커, 컴포넌트)
  js/common.js      — 공통 JS (테마 토글, 스크롤 애니메이션, 코인 티커 자동주입, 햄버거 드로어)
  js/coin-data.js   — 코인 데이터베이스
  img/              — 이미지 파일
  components/
    nav.html        — 공통 nav 참고용
    footer.html     — 공통 footer 참고용
tools/              — 계산기 도구 페이지들
blog/               — 블로그 포스트들
  index.html        — 블로그 인덱스
  coin-tax/         — 세금 카테고리
  investment/       — 투자전략 카테고리
  guide/            — 입문가이드 카테고리
index.html          — 메인 랜딩 페이지
sitemap.xml
robots.txt

공통 nav 구조:
- 로고 (좌측)
- 데스크탑 링크: 세금계산기 | 도구모음 | 시장데이터 | 블로그 | FAQ + CTA버튼
- 모바일: 햄버거 버튼 → 우측에서 슬라이드 드로어
- 다크/라이트 토글 버튼
- 스티키(sticky) 포지션, backdrop-filter:blur(10px)

공통 footer 구조:
- 4컬럼 그리드 (계산기 도구 / 시장데이터 / 블로그 / 사이트정보)
- 저작권 + 면책조항
- 국세청·홈택스 공식 링크 포함

Python 서버 설정:
fuser -k 5000/tcp 2>/dev/null; sleep 1; python3 -m http.server 5000 --bind 0.0.0.0

이 구조로 먼저 common.css, common.js, index.html을 만들어줘.
```

---

## 페이지별 프롬프트

### A. 메인 랜딩 페이지 (`index.html`)

```
index.html 메인 랜딩 페이지를 만들어줘.

섹션 순서:
1. 히어로 섹션
   - 뱃지: "2027 과세 D-[일수]" + "국세청 기준 적용" + "이동평균법 적용"
   - H1: "2027년 세금 22%, 당신의 수익을 지키는 계산기 모음"
   - 통계 4개: 세율 22% / 한국 코인 투자자 1,326만 / 계산기 도구 N종 / 즉시 계산
   - CTA 버튼 2개: "무료 세금 계산 시작하기" (주황) + "모든 계산기 보기" (아웃라인)

2. 공포·탐욕 지수 섹션 (LIVE)
   - Alternative.me API 또는 TradingView 위젯으로 현재 지수 표시
   - 0~100 슬라이더 바 + 단계별 색상 (공포=빨강, 탐욕=초록)

3. 도구 그리드 (3열)
   - 각 도구 카드: 아이콘 + 제목 + 설명 + 무료/LIVE 뱃지
   - 코인 세금 계산기 / 수익률 계산기 / DCA 계산기 / 물타기 계산기 / 김치프리미엄 / 업비트 급등순위 등

4. TradingView 코인 티커 위젯 (상단 스크롤 티커)

5. 블로그 최신 글 3개 미리보기 카드

6. FAQ 섹션 (FAQPage 스키마 포함)
   - 7개 질문: 세금 시작일, 세율, 기본공제, 이동평균법, CSV, 절세방법, 신고방법

7. SEO 구조화 데이터:
   - WebSite, Organization, FAQPage 스키마
   - Speakable 스키마 (GEO/AEO 최적화)
   - BreadcrumbList

메타 설정:
- title: "[사이트명] — 2027 코인 세금 계산기 무료 | 한국 가상자산 양도소득세"
- description: "한국 코인 투자자를 위한 2027 가상자산 양도소득세 계산기. 업비트·빗썸 투자자 무료 제공. 국세청 기준 22% 세율 자동 적용."
```

---

### B. 계산기 도구 페이지 템플릿

```
[계산기명] 계산기 페이지 (tools/[파일명].html)를 만들어줘.

구조:
1. <head>
   - title: "[계산기명] 2027 무료 | [핵심 기능 설명] — [사이트명]"
   - description: SEO 최적화 설명 (150자 이내)
   - canonical, OG, Twitter 태그
   - JSON-LD 스키마: WebApplication + HowTo + FAQPage
   - 인라인 <style> (페이지별 CSS) + <link> common.css

2. <body>
   - 공통 nav (common.js가 자동 삽입)
   - 브레드크럼: 홈 > 계산기 모음 > [계산기명]
   - 히어로 섹션: 뱃지 + H1 + 설명 + 통계 4개
   - 광고 슬롯 (728×90)
   - "이렇게 사용하세요" 3단계 박스 (HowTo 마크업)
   - 계산기 카드 (입력 폼 + 계산 버튼 + 결과 영역)
   - 관련 계산기 3개 링크
   - 관련 블로그 글 3~5개 링크
   - 공식 외부 링크 (국세청·홈택스·금융위원회)
   - FAQ 아코디언 (5~7개)
   - 공통 footer (common.js가 자동 삽입)

"이렇게 사용하세요" 박스 구조:
<div class="howto-box" itemscope itemtype="https://schema.org/HowTo">
  <meta itemprop="name" content="[계산기명] 사용 방법">
  <div class="howto-title">📋 이렇게 사용하세요</div>
  <div class="howto-steps">
    [3개의 .howto-step div — step-num (주황 원형 번호) + step-body (제목+설명)]
  </div>
</div>

세금 공식 ([사이트명]에서 사용):
- 세율: 22% (소득세 20% + 지방소득세 2%)
- 기본공제: 연 250만원
- 과세표준 = MAX(0, 총 수익 - 250만원)
- 세액 = 과세표준 × 22%
- 취득원가: 이동평균법

CSS 클래스 패턴:
.hero { padding:40px 24px 28px; text-align:center; }
.hero-badge { 주황 pill 뱃지 }
.hero-stats { 4개 통계 flex 행 }
.container { max-width:820px; margin:0 auto; padding:0 20px 64px; }
.card { bg-surface, border, border-radius:14px, padding:24px }
.card-title { 주황색 소문자 레이블 }
.form-group { label + input + hint 텍스트 }
.form-grid { 2열 그리드 }
.result-box { 계산 결과 영역, 초기 hidden }
.result-grid { 결과 값 4개 그리드 }
.ad-slot { 점선 광고 박스 }
```

---

### C. 블로그 인덱스 (`blog/index.html`)

```
블로그 인덱스 페이지 (blog/index.html)를 만들어줘.

구조:
1. 히어로: "코인 세금 · 투자 가이드 블로그" H1 + 통계 (N편의 글)
2. 카테고리 필터 탭:
   - 전체 | 세금·절세 | 투자전략 | 입문가이드
   - JS로 클릭 시 해당 카테고리만 표시
3. 블로그 카드 그리드 (3열)
   각 카드: 썸네일 이미지 + 카테고리 뱃지 + 제목 + 요약 + 날짜 + 읽기 →
4. "더 보기" 버튼 (처음 12개 표시 → 클릭 시 전체 표시)

블로그 카드 HTML:
<article class="blog-card" data-category="[카테고리]">
  <a href="/blog/[카테고리]/[슬러그].html">
    <div class="blog-card-thumb"><img src="[이미지]" alt="[제목]"></div>
    <div class="blog-card-body">
      <span class="badge badge-[카테고리]">[카테고리명]</span>
      <h3 class="blog-card-title">[제목]</h3>
      <p class="blog-card-summary">[요약 2줄]</p>
      <div class="blog-card-meta">[날짜] · [읽기 시간]분</div>
    </div>
  </a>
</article>

카테고리별 권장 글 수: 세금 15편 / 투자전략 15편 / 입문가이드 10편
```

---

### D. 블로그 아티클 템플릿

```
블로그 아티클 페이지 (blog/[카테고리]/[슬러그].html)를 만들어줘.

필수 규칙:
- <body data-no-ticker> — TradingView 티커 없음
- 스크롤 애니메이션 없음 (fade-up 클래스 사용 금지)
- stat-box 없음

구조 순서:
1. summary-box: 이 글의 핵심 요약 (3~5개 bullet)
2. 관련 글 3개 링크 (summary-box 바로 아래)
3. 목차 (h2 기준 자동 생성 또는 수동)
4. 본문 (h2/h3 소제목, 표, 예시, 외부 링크 포함)
5. 관련 계산기 3개 카드 (calc-cta 블록)
6. 함께 읽으면 좋은 글 3개
7. 공식 출처 3개 (국세청·홈택스·위키백과 등)

외부 링크 삽입 규칙:
- 본문 핵심 용어에 1~3개 자연스럽게 삽입
- 국세청: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2412
- 홈택스: https://www.hometax.go.kr
- 금융위원회: https://www.fsc.go.kr/no010101
- 위키백과: https://ko.wikipedia.org
- 나무위키: https://namu.wiki

JSON-LD 스키마:
- Article (author, datePublished, headline)
- BreadcrumbList
- FAQPage (해당 아티클 주제 관련 3~5개)

메타:
- title: "[핵심 키워드] 2027 완벽 가이드 | [사이트명]"
- description: [핵심 키워드] + 구체적 내용 + 무료/즉시/자동 키워드 포함 (150자)
```

---

### E. 시장 데이터 페이지 템플릿

```
실시간 시장 데이터 페이지를 만들어줘.

업비트 공개 API (인증 불필요):
- 전체 KRW 마켓 목록: GET https://api.upbit.com/v1/market/all
- 실시간 시세: GET https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,...
- 일봉 데이터: GET https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=30

빗썸 공개 API:
- 시세: GET https://api.bithumb.com/public/ticker/BTC_KRW

김치프리미엄 자동 계산:
1. 업비트 BTC 원화가: api.upbit.com/v1/ticker?markets=KRW-BTC → trade_price
2. 바이낸스 BTC 달러가: api.binance.com/api/v3/ticker/price?symbol=BTCUSDT → price
3. 달러 환율: api.frankfurter.app/latest?from=USD&to=KRW → rates.KRW
4. 김프(%) = (업비트가 ÷ (바이낸스가 × 환율) - 1) × 100

실시간 순위 페이지 (급등·급락):
1. fetchMarkets() — 전체 KRW 마켓 조회
2. fetchTickers(markets) — 배치 100개씩 조회
3. 등락률 기준 정렬 (급등/급락/거래량)
4. 60초마다 setInterval로 자동 새로고침
5. 카운트다운 프로그레스 바

TradingView 무료 위젯:
- 코인 히트맵: embed-widget-crypto-coins-heatmap.js
- 차트: embed-widget-advanced-chart.js
- 심볼 오버뷰: embed-widget-symbol-overview.js
- 마켓 오버뷰: embed-widget-market-overview.js
```

---

## SEO / 스키마 프롬프트

### F. 구조화 데이터 추가

```
[페이지명]에 SEO 구조화 데이터를 추가해줘.

계산기 페이지용 (3개 스키마 모두 추가):
1. WebApplication 스키마:
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[계산기명]",
  "url": "https://[도메인]/tools/[파일명]",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "inLanguage": "ko-KR",
  "isAccessibleForFree": true,
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "KRW"}
}

2. HowTo 스키마:
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[계산기명] 사용 방법",
  "totalTime": "PT1M",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "[단계1]", "text": "[설명]"},
    {"@type": "HowToStep", "position": 2, "name": "[단계2]", "text": "[설명]"},
    {"@type": "HowToStep", "position": 3, "name": "[단계3]", "text": "[설명]"}
  ]
}

3. FAQPage 스키마:
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "[질문]", "acceptedAnswer": {"@type": "Answer", "text": "[답변]"}},
    ...
  ]
}

GEO/AEO 최적화 (AI 검색 대응):
- Speakable 스키마 추가 (cssSelector로 핵심 섹션 지정)
- 사실 기반 팩트 박스 (수치+출처 명시)
- 직접 답변형 문장 ("2027년 코인 세금은 22%입니다." 형태)
```

---

## 공통 컴포넌트 프롬프트

### G. 공통 Nav 드로어 메뉴

```
common.js의 햄버거 드로어 메뉴를 만들어줘.

구조 (우측 슬라이드 드로어):
- 섹션: 🧮 세금 계산기 / 🧰 투자 도구 / 📊 시장 데이터 / 📰 블로그 / ℹ️ 사이트 정보
- 각 항목: .drawer-item { di-icon + di-label + (선택) di-badge 또는 di-new }
- 뱃지 스타일: di-badge (주황 pill) / di-new (초록 pill, "LIVE" 또는 "NEW")
- 하단: 다크/라이트 테마 토글 행

CSS:
.drawer-item { padding: 10px 20px; border-left: 3px solid transparent; }
.drawer-item:hover { background: orange-dim; border-left-color: orange; }
.drawer-section-title { padding: 10px 20px 4px; font-size: .7rem; uppercase; }
.drawer-divider { height: 1px; margin: 5px 0; }
```

### H. 코인 티커 바

```
상단 실시간 코인 가격 티커를 만들어줘.

- common.js에서 body[data-no-ticker]가 없을 때만 자동 주입
- TradingView embed-widget-ticker-tape.js 사용
- 표시 코인: BTC, ETH, XRP, SOL, BNB, ADA, DOGE, AVAX
- 다크/라이트 테마 연동 (themeChange 이벤트 수신)
- nav 아래에 삽입
```

### I. 계산기 CTA 공통 블록

```
계산기 페이지 하단 CTA 박스를 만들어줘.

<div class="calc-cta">
  <div style="font-size:2rem">💰</div>
  <div class="calc-cta-text">
    <h3>[CTA 제목]</h3>
    <p>[설명 — 세금, 수익, 절세 등 연결]</p>
  </div>
  <a href="/tools/tax-calculator.html" class="calc-cta-btn">🧮 무료 세금 계산</a>
</div>

CSS:
.calc-cta { display:flex; align-items:center; gap:16px; 
  border:1px solid var(--orange); border-radius:14px; padding:20px 24px; }
.calc-cta-btn { background:var(--orange); color:#000; font-weight:800; 
  padding:10px 22px; border-radius:9px; }
```

---

## 사이트 전체 빌드 순서 (추천)

```
다음 순서로 사이트를 만들어줘:

Phase 1 — 기초 설정 (1회)
1. Python 서버 워크플로우 설정 (포트 5000)
2. assets/css/common.css 생성 (CSS 변수, nav, footer, drawer, 티커, 카드 컴포넌트)
3. assets/js/common.js 생성 (테마, 스크롤, 티커 자동주입, 드로어)
4. index.html 메인 랜딩 페이지

Phase 2 — 핵심 계산기 (우선순위 순)
5. tools/tax-calculator.html — 코인 세금 계산기 (핵심)
6. tools/roi-calculator.html — 수익률 계산기
7. tools/multa-calculator.html — 물타기 평균단가
8. tools/dca-calculator.html — DCA 적립식
9. tools/kimchi-calculator.html — 김치프리미엄 (업비트 API 자동)
10. tools/staking-calculator.html — 스테이킹 이자

Phase 3 — 시장 데이터 (트래픽 확보)
11. tools/hot-coins.html — 업비트 급등·급락 실시간 순위
12. tools/market-index.html — 시장지수 대시보드 (공포·탐욕 + 도미넌스)
13. market/crypto-charts.html — 실시간 차트 허브

Phase 4 — 블로그 콘텐츠
14. blog/index.html — 블로그 인덱스 (카테고리 필터)
15. 세금 카테고리 15편 생성
16. 투자전략 카테고리 15편 생성
17. 입문가이드 카테고리 10편 생성

Phase 5 — SEO 마무리
18. sitemap.xml (전체 URL)
19. robots.txt
20. 각 페이지 HowTo + FAQPage + HowTo 스키마 추가
21. Speakable 스키마 (GEO/AEO 최적화)
```

---

## 자주 쓰는 단일 기능 프롬프트

### 도구 페이지에 HowTo 박스 추가
```
[파일명].html의 광고 슬롯 아래, 계산기 카드 위에
"이렇게 사용하세요" 3단계 박스를 추가해줘.
단계: 1)[첫번째 입력 단계] 2)[두번째 단계] 3)[결과 확인 및 다음 액션]
SEO를 위해 itemprop="step" HowTo 마크업도 포함해줘.
CSS 클래스는 .howto-box / .howto-steps / .howto-step / .step-num / .step-body 사용.
```

### 업비트 API 자동 입력 추가
```
[파일명].html의 [입력 필드 ID] 필드에 업비트 실시간 가격을 자동 입력해줘.
API: https://api.upbit.com/v1/ticker?markets=KRW-[코인심볼]
응답의 trade_price를 [필드 ID]에 설정하고, 자동으로 계산 함수를 실행해줘.
60초마다 setInterval로 갱신하고, 실패 시 에러 메시지를 표시해줘.
```

### 관련 계산기 카드 추가
```
[파일명].html 하단에 관련 계산기 3개 카드를 추가해줘.
각 카드: 이모지 아이콘 + 계산기명 + 한줄 설명 + 링크
카드 1: [계산기명] ([URL])
카드 2: [계산기명] ([URL])
카드 3: [계산기명] ([URL])
CSS는 .related-tools 그리드 (3열, 모바일 2열)로 만들어줘.
```

### 블로그 글 1편 생성
```
[주제]에 대한 블로그 글을 blog/[카테고리]/[슬러그].html로 만들어줘.

필수:
- <body data-no-ticker>
- summary-box → 관련 글 3줄 → 목차 → 본문 → 관련 계산기 3개 → 참고 자료
- 본문 1500~2500자 (한국어)
- H2 소제목 5~7개
- 본문 내 핵심 용어에 국세청·위키백과·나무위키 외부링크 1~3개
- FAQPage 스키마 (관련 질문 5개)
- Article 스키마 (datePublished, author 포함)
- 제목: [핵심 키워드] + 년도 + 가이드/방법/뜻 키워드
```

### 사이트맵 업데이트
```
sitemap.xml에 다음 URL들을 추가해줘:
- [URL1] (priority: 0.9, changefreq: weekly)
- [URL2] (priority: 0.85, changefreq: monthly)
lastmod는 오늘 날짜([YYYY-MM-DD])로 설정해줘.
```

---

## 세금 계산 핵심 공식 (2027 기준)

```javascript
// 세율 22% (소득세 20% + 지방소득세 2%)
// 기본공제 연 250만원
// 취득원가: 이동평균법

function calcTax(totalProfit) {
  const BASIC_DEDUCTION = 2500000;  // 250만원
  const TAX_RATE = 0.22;            // 22%
  
  const taxBase = Math.max(0, totalProfit - BASIC_DEDUCTION);
  const tax = taxBase * TAX_RATE;
  const netProfit = totalProfit - tax;
  
  return { taxBase, tax, netProfit };
}

// 수익률 계산
function calcROI(buyAmount, sellAmount, fee = 0) {
  const profit = sellAmount - buyAmount - fee;
  const roi = (profit / buyAmount) * 100;
  return { profit, roi };
}

// 이동평균 단가
function calcAvgPrice(buys) {
  // buys = [{price, qty}, ...]
  const totalCost = buys.reduce((s, b) => s + b.price * b.qty, 0);
  const totalQty = buys.reduce((s, b) => s + b.qty, 0);
  return totalQty > 0 ? totalCost / totalQty : 0;
}
```

---

## 한국어 SEO 핵심 키워드 목록

```
세금 계산기 키워드:
- 코인 세금 계산기, 가상자산 세금, 2027 코인 세금, 업비트 세금, 암호화폐 세금
- 양도소득세 계산, 22% 세율, 기본공제 250만원, 이동평균법

투자 도구 키워드:
- 코인 수익률 계산기, 물타기 계산기, DCA 적립식, 평균단가 계산
- 김치프리미엄, 업비트 급등 코인, 스테이킹 이자 계산, 손익분기점

시장 데이터 키워드:
- 공포 탐욕 지수, 비트코인 도미넌스, 코인 실시간 차트
- 업비트 실시간, 업비트 급등 코인, 코인 급락 순위

블로그 키워드:
- 2027 가상자산 과세, 코인 세금 신고 방법, 절세 방법, 손익통산
- 업비트 CSV 다운로드, 코인 장기 투자, 비트코인 매수 타이밍
```

---

*이 템플릿 문서는 CryptoTax.cloud 구조를 기반으로 작성되었습니다.*  
*AI 에이전트에게 각 섹션의 프롬프트를 순서대로 입력하면 동일한 구조의 사이트를 빌드할 수 있습니다.*
