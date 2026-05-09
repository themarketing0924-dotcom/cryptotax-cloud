# AI 에이전트로 코인 세금 계산기 사이트 만들기
## 강의용 단계별 프롬프트 가이드

> **사용법**: Replit Agent (또는 Claude, GPT-4o)에게 아래 프롬프트를 단계 순서대로 붙여넣기만 하면
> CryptoTax.cloud와 동일한 구조의 완성된 웹사이트가 만들어집니다.
>
> - 각 단계의 `[ ]` 안에 있는 내용만 여러분의 정보로 바꿔서 사용하세요
> - 한 단계가 완료된 것을 눈으로 확인한 후 다음 단계로 넘어가세요
> - 예상 소요 시간: 전체 약 3~4시간 (따라하기 기준)

---

---

# STEP 1 — 프로젝트 초기 세팅
> ⏱ 예상 시간: 10분
> ✅ 완료 기준: 브라우저에서 사이트가 열리고 네비게이션이 보임

## 1-1. 프로젝트 생성 및 서버 설정

Replit에서 새 프로젝트(Blank Repl)를 만든 후 아래 프롬프트를 입력하세요.

```
정적 HTML/CSS/JS 웹사이트 프로젝트를 세팅해줘.

요구사항:
- 빌드 시스템 없음 (npm, webpack 불필요)
- Python3 HTTP 서버로 포트 5000에서 서빙
- 워크플로우 명령어: fuser -k 5000/tcp 2>/dev/null; sleep 1; python3 -m http.server 5000 --bind 0.0.0.0

아래 폴더 구조를 만들어줘:
assets/
  css/
  js/
  img/
  components/
tools/
blog/
  coin-tax/
  investment/
  guide/
market/
index.html (빈 파일)
sitemap.xml (빈 파일)
robots.txt (빈 파일)

완료 후 서버를 시작해줘.
```

---

## 1-2. 디자인 시스템 (공통 CSS) 생성

```
assets/css/common.css 파일을 만들어줘.

반드시 포함할 내용:

1. CSS 변수 (CSS custom properties):
:root {
  --orange: #FF8C00;
  --bg: #0d0d1a;
  --bg-surface: #1a1a2e;
  --bg-elevated: #24243e;
  --text: #e8e8f0;
  --text-sub: #9999bb;
  --text-muted: #6666aa;
  --green: #3fb950;
  --red: #f85149;
  --blue: #58a6ff;
  --border: #2a2a4a;
  --radius: 12px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
}

2. 라이트 모드 (body[data-theme="light"]):
  배경 흰색 계열, 텍스트 어두운 계열로 오버라이드

3. 공통 nav 스타일 (.ctc-nav):
   - 스티키, 높이 64px
   - backdrop-filter: blur(10px)
   - 로고 + 데스크탑 링크 + CTA 버튼 + 테마 토글 버튼
   - 모바일(768px 이하): 햄버거 버튼만 표시

4. 햄버거 드로어 스타일 (.ctc-drawer):
   - 우측에서 슬라이드 (width: 300px)
   - .drawer-item: padding 10px 20px
   - .drawer-section-title: padding 10px 20px 4px, 대문자, 0.7rem
   - .drawer-divider: height 1px, margin 5px 0
   - .di-badge: 주황 pill (배지)
   - .di-new: 초록 pill (LIVE/NEW 배지)

5. 공통 footer 스타일 (.ctc-footer):
   - 4컬럼 그리드 (모바일: 2열)
   - 저작권 행

6. 코인 티커 바 (.ctc-ticker):
   - nav 바로 아래 위치
   - TradingView 위젯 컨테이너

7. 유틸리티 클래스:
   - .container (max-width: 820px, margin: 0 auto)
   - .card (bg-surface, border, border-radius, padding)
   - .badge (pill 형태 뱃지)
   - .btn-primary (주황 버튼)
   - .btn-outline (테두리 버튼)
   - fade-up 스크롤 애니메이션 (IntersectionObserver용)

8. 폰트: Pretendard CDN 임포트
   @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
```

---

## 1-3. 공통 JavaScript 생성

```
assets/js/common.js 파일을 만들어줘.

반드시 포함할 기능:

1. 다크/라이트 테마 토글
   - localStorage 키: 'ctc-theme'
   - 페이지 로드 시 저장된 테마 복원
   - body에 data-theme="light" 또는 data-theme="dark" 설정
   - 'themeChange' 커스텀 이벤트 dispatch (TradingView 위젯 재로드용)

2. 공통 Nav 자동 주입
   - 모든 페이지 <body> 최상단에 nav HTML 자동 삽입
   - Nav 구조:
     <nav class="ctc-nav">
       <div class="ctc-nav-inner">
         [로고] [데스크탑 링크들] [CTA버튼] [테마토글] [햄버거버튼]
       </div>
     </nav>
   - 로고: "CryptoTax .cloud" (또는 [사이트명])
   - 데스크탑 링크: 세금계산기 / 계산기모음 / 시장데이터 / 블로그
   - CTA 버튼: "무료 계산" → /tools/tax-calculator.html

3. 햄버거 드로어 자동 주입
   - Nav 주입 시 드로어도 함께 주입
   - 드로어 섹션 구성:
     [🧮 세금 계산기] 세금계산기, CSV 세금계산기, 절세 하베스팅
     [🧰 투자 도구] DCA 계산기, 물타기 계산기, 스테이킹 계산기, 김치프리미엄
     [📊 시장 데이터] 업비트 급등·급락 순위(LIVE), 시장지수 대시보드(LIVE), 실시간 차트
     [📰 블로그] 전체 글 보기, 세금 가이드, 2027 완벽 가이드
     [ℹ️ 사이트 정보] 서비스 소개, 문의하기

4. 공통 Footer 자동 주입
   - 모든 페이지 </body> 바로 위에 footer 자동 삽입
   - 4컬럼: 계산기 도구 / 시장 데이터 / 블로그 / 사이트 정보
   - 하단: 저작권 + "국세청 공식 기준" 면책문구

5. 코인 티커 자동 주입
   - body[data-no-ticker] 속성이 없는 페이지에만 삽입
   - TradingView embed-widget-ticker-tape.js 위젯
   - 표시 코인: BTC, ETH, XRP, SOL, BNB, ADA, DOGE, AVAX (업비트 기준 한국 원화 표시)
   - 테마 변경 시 위젯 재생성

6. 스크롤 애니메이션
   - IntersectionObserver로 .fade-up 클래스 요소 감지
   - 뷰포트 진입 시 opacity 0→1, translateY 20px→0 전환

7. ctcCloseDrawer() 함수 전역 노출
   - 드로어 닫기 (drawer-item 클릭 시 호출)
```

---

---

# STEP 2 — 메인 랜딩 페이지
> ⏱ 예상 시간: 20분
> ✅ 완료 기준: 홈페이지에 히어로 섹션, 도구 그리드, 블로그 미리보기가 보임

```
index.html 메인 랜딩 페이지를 만들어줘.

<head> 설정:
- title: "[사이트명] — 2027 코인 세금 계산기 무료 | 한국 가상자산 양도소득세"
- description: "한국 코인 투자자를 위한 2027 가상자산 양도소득세 계산기 무료 제공. 국세청 기준 22% 세율, 연 250만원 공제 자동 적용. 업비트·빗썸 투자자 필수."
- OG 태그: og:title, og:description, og:image, og:url
- Twitter 카드 태그
- JSON-LD 스키마 3개:
  1) WebSite (name, url, potentialAction/SearchAction)
  2) Organization (name, url, logo, sameAs)
  3) FAQPage (아래 7개 질문 포함)

FAQ 질문 7개:
Q1: 코인 세금은 언제부터 부과되나요? → 2027년 1월 1일부터
Q2: 세율은 얼마인가요? → 22% (소득세 20% + 지방세 2%)
Q3: 기본공제는 얼마인가요? → 연 250만원
Q4: 취득원가는 어떻게 계산하나요? → 이동평균법
Q5: 업비트 CSV로 세금 계산 가능한가요? → 가능 (CSV 세금계산기 링크)
Q6: 절세 방법이 있나요? → 손실 코인 매도 후 재매수 (절세 하베스팅 링크)
Q7: 세금 신고는 어디서 하나요? → 홈택스 (링크 포함)

<body> 섹션 순서:

1. 히어로 섹션
   - 뱃지 3개: "2027 과세 준비" + "국세청 기준 적용" + "이동평균법 자동"
   - H1: "2027년 코인 세금 22%, 지금 바로 계산하세요"
   - 부제목: "업비트·빗썸 투자자 필수 — 세금, 수익률, 절세까지 한 곳에서"
   - 통계 4개 (가로 행): 세율 22% / 기본공제 250만원 / 계산기 N종 / 완전 무료
   - CTA 버튼: "무료 세금 계산 시작" (주황, /tools/tax-calculator.html) + "모든 계산기 보기" (아웃라인, /tools/)

2. 공포·탐욕 지수 섹션 (실시간)
   - 섹션 제목: "🌡️ 현재 시장 분위기"
   - Alternative.me API 연동: https://api.alternative.me/fng/
   - 0~100 게이지 바 + 단계 색상 (0~25 극도공포/빨강, 26~45 공포/주황, 46~55 중립/노랑, 56~75 탐욕/연초록, 76~100 극도탐욕/초록)
   - "공포일 때 사고, 탐욕일 때 팔아라" 워렌 버핏 인용구

3. 도구 그리드 섹션
   - 섹션 제목: "🛠️ 무료 계산기 도구 모음"
   - 카드 9개 (3열 그리드):
     💰 코인 세금 계산기 (/tools/tax-calculator.html) [핵심 뱃지]
     📈 수익률(ROI) 계산기 (/tools/roi-calculator.html)
     📅 DCA 적립식 계산기 (/tools/dca-calculator.html)
     📊 물타기 평균단가 (/tools/multa-calculator.html)
     🌶️ 김치프리미엄 계산기 (/tools/kimchi-calculator.html) [LIVE 뱃지]
     🚀 업비트 급등·급락 순위 (/tools/hot-coins.html) [LIVE 뱃지]
     🏦 스테이킹 이자 계산기 (/tools/staking-calculator.html)
     🌿 절세 하베스팅 계산기 (/tools/tax-loss-harvesting.html)
     📂 CSV 세금 계산기 (/tools/csv-tax-calculator.html)

4. 최신 블로그 글 3개 미리보기
   - 섹션 제목: "📰 최신 가이드"
   - 카드 3개 (제목 + 요약 + 날짜 + "읽기 →" 링크)
   - "전체 글 보기" 버튼 → /blog/

5. FAQ 아코디언 (접기/펼치기)
   - 위에 정의한 7개 질문 사용
   - 클릭 시 답변 펼침/닫힘

6. 하단 CTA 배너
   - "지금 바로 시작하세요 — 무료, 회원가입 없음"
   - 버튼: "세금 계산하기"
```

---

---

# STEP 3 — 핵심 계산기 페이지들
> ⏱ 예상 시간: 30분 (계산기 1개당 약 5분)
> ✅ 완료 기준: 계산기에 숫자 입력 시 결과가 즉시 표시됨

## 3-1. 코인 세금 계산기 (핵심 페이지)

```
tools/tax-calculator.html 코인 세금 계산기를 만들어줘.

<head> JSON-LD 스키마 3개:
1) WebApplication: name="코인 세금 계산기", applicationCategory="FinanceApplication", price=0
2) HowTo: 3단계 (매수정보입력 → 매도정보입력 → 세금·순수익확인)
3) FAQPage: 5개 질문 (세율, 기본공제, 이동평균법, 신고방법, 절세방법)

페이지 구조:
1. 히어로: 뱃지 + H1 "2027 코인 세금 계산기 — 국세청 기준 22% 자동 적용" + 통계 4개
2. 광고 슬롯 (728×90)
3. "이렇게 사용하세요" 3단계 박스 (HowTo itemprop 마크업 포함)
4. 계산기 카드:
   입력 폼:
   - 총 매수금액 (원) — id="inp-buy"
   - 총 매도금액 (원) — id="inp-sell"
   - 거래 수수료 합계 (원, 선택) — id="inp-fee"
   - 기타 필요경비 (원, 선택) — id="inp-expense"
   계산 버튼: "💰 세금 즉시 계산하기"
   결과 박스 (id="result-box"):
   - 총 수익금 / 과세표준 / 납부 세액 / 세후 순수익 (4개 그리드)
   - 세금 계산식 설명 (수식 풀이)
   - "세금 절약 팁" 접힌 섹션

세금 계산 공식 (JavaScript):
const DEDUCTION = 2500000;  // 250만원
const RATE = 0.22;          // 22%
function calcTax() {
  const buy = parseFloat(document.getElementById('inp-buy').value) || 0;
  const sell = parseFloat(document.getElementById('inp-sell').value) || 0;
  const fee = parseFloat(document.getElementById('inp-fee').value) || 0;
  const expense = parseFloat(document.getElementById('inp-expense').value) || 0;
  const profit = sell - buy - fee - expense;
  const taxBase = Math.max(0, profit - DEDUCTION);
  const tax = taxBase * RATE;
  const netProfit = profit - tax;
  // 결과를 result-box에 표시
}

5. 관련 계산기 3개 카드: 수익률 계산기 / 절세 하베스팅 / CSV 세금계산기
6. 관련 블로그 글 3개 링크
7. 공식 출처 링크:
   - 국세청 가상자산 안내: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2412
   - 홈택스 신고: https://www.hometax.go.kr
8. FAQ 아코디언
```

---

## 3-2. 나머지 계산기들 (동일 패턴 반복)

각 계산기마다 아래 프롬프트를 사용하세요. `[ ]`만 바꾸면 됩니다.

```
tools/[파일명].html [계산기명]을 만들어줘.

공통 구조 (tax-calculator.html과 동일):
- 히어로 → 광고슬롯 → 이렇게사용하세요 → 계산기카드 → 관련계산기3개 → FAQ → footer

계산기별 입력/출력 정의:

[수익률(ROI) 계산기 — tools/roi-calculator.html]
입력: 매수금액(inp-buy) + 매도금액(inp-sell) + 수수료(inp-fee)
출력: 수익금액 / ROI(%) / 세전수익 / 세후순수익
공식: ROI = (매도-매수-수수료) ÷ 매수 × 100

[물타기 평균단가 계산기 — tools/multa-calculator.html]
입력: 매수 행 여러 개 (단가+수량), 현재가격(inp-current)
출력: 평균매수단가 / 손익분기점 / 현재평가금액 / 수익률(%)
기능: "+ 행 추가" 버튼으로 매수 내역 동적 추가
공식: 평균단가 = 총매수금액 ÷ 총수량

[DCA 적립식 계산기 — tools/dca-calculator.html]
입력: 월 투자금액(inp-monthly) + 투자기간_월(inp-period) + 코인명(inp-coin) + 시작가격(inp-start) + 현재가격(inp-current)
출력: 총 투자금액 / 평균매수단가 / 현재 평가금액 / 수익률(%) / 세후수익
공식: 각 월 동일 금액으로 매수, 이동평균 적용

[스테이킹 이자 계산기 — tools/staking-calculator.html]
입력: 원금(inp-principal) + 연 이자율_%(inp-rate) + 기간_일(inp-period) + 현재 코인가격(inp-price)
출력: 이자 코인 수량 / 이자 원화 가치 / 세금(22%) / 세후 이자
공식: 이자 = 원금코인수 × 연이율 × (기간/365)

[김치프리미엄 계산기 — tools/kimchi-calculator.html]
입력: 국내가격_원(inp-domestic) + 해외가격_달러(inp-foreign) + 달러환율(inp-rate) + 보유수량(inp-qty, 선택)
출력: 해외원화환산가 / 김치프리미엄(%) / 방향(국내↑ or 해외↑) / 차익금액
공식: 김프(%) = (국내가 ÷ (해외가 × 환율) - 1) × 100
추가: 업비트+바이낸스+환율 API 자동입력 (DOMContentLoaded 시)

[절세 하베스팅 — tools/tax-loss-harvesting.html]
입력: 수익코인들(여러 행: 코인명+수익) + 손실코인들(여러 행: 코인명+손실)
출력: 총수익 / 총손실 / 손익통산 후 수익 / 절약되는 세금 / 절세 전후 비교
공식: 과세표준 = MAX(0, 총수익 - 총손실 - 250만원), 절세액 = (절세 전 세금 - 절세 후 세금)
```

---

---

# STEP 4 — 실시간 시장 데이터 페이지
> ⏱ 예상 시간: 20분
> ✅ 완료 기준: 업비트 API에서 실시간 코인 데이터가 표시됨

## 4-1. 업비트 급등·급락 순위 (트래픽 핵심 페이지)

```
tools/hot-coins.html 업비트 실시간 급등·급락 코인 순위 페이지를 만들어줘.

사용할 API (인증 불필요, 무료):
1. 전체 마켓 조회: GET https://api.upbit.com/v1/market/all?isDetails=false
2. 시세 조회: GET https://api.upbit.com/v1/ticker?markets=[KRW마켓콤마구분]

구현할 기능:
1. 페이지 로드 시 전체 KRW 마켓 조회 (약 230~260개)
2. 100개씩 나눠서 시세 조회 (API 제한 대응)
3. 탭 3개:
   🚀 급등 TOP20 — 24시간 등락률 높은 순
   📉 급락 TOP20 — 24시간 등락률 낮은 순
   🔥 거래량 TOP20 — 24시간 거래량(원화) 높은 순
4. 각 코인 행: 순위 / 코인 로고 / 코인명(한글) / 심볼 / 현재가(원) / 등락률(%) / 거래량(억원)
5. 코인 로고 URL: https://static.upbit.com/logos/[심볼].png
6. 등락률 색상: 양수=초록(--green), 음수=빨강(--red)
7. 코인 클릭 시 업비트 해당 종목 페이지로 이동: https://upbit.com/exchange?code=CRIX.UPBIT.KRW-[심볼]
8. 60초 자동 새로고침 + 카운트다운 프로그레스 바
9. "지금 새로고침" 수동 버튼
10. 마지막 업데이트 시간 표시

통계 바:
- 전체 코인 수 / 상승 코인 수(초록) / 하락 코인 수(빨강) / 보합 코인 수

SEO:
- title: "업비트 급등 급락 코인 순위 실시간 | [사이트명]"
- JSON-LD: WebPage + FAQPage + BreadcrumbList
- FAQ: 급등 코인 기준, 데이터 출처, 새로고침 주기, 업비트 연동 방법
```

---

## 4-2. 김치프리미엄 자동 입력 추가

3-2에서 kimchi-calculator.html을 만든 뒤, 아래 프롬프트로 자동 입력 기능을 추가하세요.

```
tools/kimchi-calculator.html에 실시간 가격 자동 입력 기능을 추가해줘.

계산기 버튼 바로 위에 상태 표시 div를 추가:
<div id="auto-fill-status">⏳ 업비트·바이낸스 실시간 가격 자동 입력 중...</div>

JavaScript 함수 (스크립트 하단에 추가):
async function autoFillPrices() {
  try {
    // 1) 업비트 BTC 원화가
    const upRes = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
    const upData = await upRes.json();
    const upPrice = upData[0].trade_price;

    // 2) 바이낸스 BTC 달러가
    const bnRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    const bnData = await bnRes.json();
    const bnPrice = parseFloat(bnData.price);

    // 3) 달러 환율 (Frankfurter 무료 API)
    let rate = 1380;
    try {
      const fxRes = await fetch('https://api.frankfurter.app/latest?from=USD&to=KRW');
      const fxData = await fxRes.json();
      rate = Math.round(fxData.rates.KRW);
    } catch(_) {}

    // 4) 필드가 비어 있을 때만 자동 입력
    if (!document.getElementById('inp-domestic').value)
      document.getElementById('inp-domestic').value = upPrice;
    if (!document.getElementById('inp-foreign').value)
      document.getElementById('inp-foreign').value = bnPrice.toFixed(0);
    if (!document.getElementById('inp-rate').value)
      document.getElementById('inp-rate').value = rate;

    // 5) 자동 계산 실행
    calcKimchi();

    // 6) 상태 업데이트
    const now = new Date().toLocaleTimeString('ko-KR');
    document.getElementById('auto-fill-status').innerHTML =
      '✅ 업비트 ' + upPrice.toLocaleString() + '원 · 바이낸스 $' +
      Math.round(bnPrice).toLocaleString() + ' · 환율 ' + rate.toLocaleString() +
      '원 자동 입력 (' + now + ')';

  } catch(err) {
    document.getElementById('auto-fill-status').textContent =
      '⚠️ 자동 입력 실패 — 직접 입력하거나 새로고침하세요';
  }
}

// 페이지 로드 시 실행 + 60초마다 갱신
document.addEventListener('DOMContentLoaded', () => {
  autoFillPrices();
  setInterval(autoFillPrices, 60000);
});
```

---

---

# STEP 5 — 블로그 인덱스
> ⏱ 예상 시간: 15분
> ✅ 완료 기준: 블로그 카드들이 그리드로 표시되고 카테고리 필터가 작동함

```
blog/index.html 블로그 인덱스 페이지를 만들어줘.

반드시 포함:
- <body> (data-no-ticker 없음 — 티커 허용)

페이지 구조:
1. 히어로: H1 "코인 세금 · 투자 가이드 블로그" + 통계 (전체 N편)
2. 카테고리 필터 탭:
   전체 | 💰 세금·절세 | 📈 투자전략 | 🔰 입문가이드
   클릭 시 JS로 해당 data-category 카드만 표시 (나머지 display:none)

3. 블로그 카드 그리드 (3열, 모바일 1열):
   각 카드 구조:
   <article class="blog-card" data-category="[coin-tax|investment|guide]">
     <a href="/blog/[카테고리]/[슬러그].html">
       <div class="blog-thumb"><img src="[이미지]" alt="[제목]" loading="lazy"></div>
       <div class="blog-body">
         <span class="badge badge-[카테고리]">[카테고리 한글명]</span>
         <h3 class="blog-title">[제목]</h3>
         <p class="blog-summary">[2줄 요약]</p>
         <div class="blog-meta">[날짜] · [N]분 읽기</div>
       </div>
     </a>
   </article>

4. 카드 목록 — 세금·절세 10개, 투자전략 10개, 입문가이드 5개 (총 25개):
   세금·절세 카테고리 (data-category="coin-tax"):
   - 2027년 코인 세금 완벽 가이드
   - 업비트 CSV로 세금 자동 계산하는 법
   - 절세 하베스팅 — 손실 코인 활용법
   - 코인 세금 신고 방법 홈택스 이용법
   - 이동평균법이란? 취득원가 계산
   - 250만원 기본공제 최대 활용법
   - 코인 세금 계산 실수 TOP5
   - 해외 거래소 코인 세금 신고 방법
   - 에어드롭·스테이킹 보상 세금 처리
   - 코인 증여·상속세 가이드

   투자전략 카테고리 (data-category="investment"):
   - 비트코인 DCA 투자 전략 완벽 가이드
   - 김치프리미엄 이해와 활용 전략
   - 코인 물타기 전략 — 장점·단점·주의사항
   - 업비트 급등 코인 투자 전략
   - 공포 탐욕 지수 활용 매매 타이밍
   - 비트코인 반감기와 투자 전략
   - 알트코인 vs 비트코인 투자 비교
   - 스테이킹 수익률 비교 분석
   - 코인 포트폴리오 구성 가이드
   - 손실 최소화 리밸런싱 전략

   입문가이드 카테고리 (data-category="guide"):
   - 코인 투자 처음 시작하는 법
   - 업비트 가입부터 첫 매수까지
   - 가상자산 지갑 종류와 사용법
   - 코인 용어 완전 정리 (100개)
   - 한국 코인 세금 법률 Q&A

5. CSS:
   .badge-coin-tax { background: rgba(255,140,0,.15); color: #FF8C00; }
   .badge-investment { background: rgba(63,185,80,.15); color: #3fb950; }
   .badge-guide { background: rgba(88,166,255,.15); color: #58a6ff; }
```

---

---

# STEP 6 — 블로그 아티클 1편 생성 (반복 사용 템플릿)
> ⏱ 예상 시간: 10분/편
> ✅ 완료 기준: 본문 읽기 → FAQ → 관련 계산기 링크까지 모두 있음

아래 프롬프트에서 `[ ]`만 바꿔서 각 글마다 사용하세요.

```
블로그 글을 만들어줘.

파일 경로: blog/[coin-tax|investment|guide]/[영문-슬러그].html
제목: [글 제목]
카테고리: [세금·절세 | 투자전략 | 입문가이드]

반드시 지킬 규칙:
- <body data-no-ticker> (티커 없음)
- 스크롤 애니메이션 없음 (fade-up 클래스 사용 금지)
- stat-box 없음

페이지 구조 (반드시 이 순서):
1. 공통 nav (common.js 자동)
2. 브레드크럼: 홈 > 블로그 > [카테고리] > [제목]
3. 아티클 헤더: 카테고리뱃지 + H1 + 날짜 + 읽기시간
4. summary-box (이 글의 핵심 요약 5개 bullet)
5. 관련 글 3개 링크 (→ 같은 카테고리 글)
6. 목차 (H2 소제목 기준, 5~7개)
7. 본문 (H2/H3 소제목, 표, 예시, 계산 예제 포함)
   - 총 1500~2500자 (한국어)
   - 핵심 용어에 외부링크 1~3개 자연스럽게 삽입:
     국세청: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2412
     홈택스: https://www.hometax.go.kr
     위키백과: https://ko.wikipedia.org/wiki/[관련항목]
8. 관련 계산기 3개 카드
   (이 글 주제에 맞는 계산기 3개 — 세금글이면 세금계산기 먼저)
9. 함께 읽으면 좋은 글 3개 링크
10. 공식 출처 3개 (국세청·홈택스·금융위원회 등)
11. FAQ 아코디언 5개 (이 글 주제 관련)
12. 공통 footer (common.js 자동)

JSON-LD 스키마 3개 (<head>에):
1) Article: headline, author, datePublished, dateModified, image
2) BreadcrumbList
3) FAQPage (FAQ 5개와 동일 내용)

<head> 메타:
- title: "[핵심 키워드] [년도] [가이드|방법|뜻|총정리] | [사이트명]"
- description: [핵심키워드] 포함, 숫자/수치 포함, 150자 이내
- canonical: https://[도메인]/blog/[카테고리]/[슬러그].html
```

---

---

# STEP 7 — SEO 마무리
> ⏱ 예상 시간: 15분
> ✅ 완료 기준: sitemap.xml에 모든 URL이 있고 robots.txt가 올바름

## 7-1. sitemap.xml 생성

```
sitemap.xml을 만들어줘. 아래 URL들을 모두 포함해줘.

형식:
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>[URL]</loc>
    <lastmod>[YYYY-MM-DD]</lastmod>
    <changefreq>[daily|weekly|monthly]</changefreq>
    <priority>[0.4~1.0]</priority>
  </url>
  ...
</urlset>

URL 목록:
메인: / (priority: 1.0, weekly)
도구 허브: /tools/ (0.9, weekly)
계산기들: /tools/tax-calculator.html (0.95), /tools/roi-calculator.html (0.85),
  /tools/multa-calculator.html (0.85), /tools/dca-calculator.html (0.85),
  /tools/kimchi-calculator.html (0.85), /tools/staking-calculator.html (0.8),
  /tools/tax-loss-harvesting.html (0.8), /tools/csv-tax-calculator.html (0.8)
시장데이터: /tools/hot-coins.html (0.92, daily)
블로그 인덱스: /blog/ (0.85, weekly)
블로그 글들: 각 (0.75, monthly)
사이트정보: /about.html (0.6), /contact.html (0.6), /privacy-policy.html (0.5, yearly)
```

## 7-2. robots.txt 생성

```
robots.txt를 만들어줘.

내용:
User-agent: *
Allow: /

Sitemap: https://[도메인]/sitemap.xml

Disallow: /assets/
```

## 7-3. HowTo 스키마 일괄 추가

```
아래 계산기 페이지들에 HowTo JSON-LD 스키마를 추가해줘.

각 페이지 <head>에 추가할 스키마:
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[계산기명] 사용 방법",
  "description": "[계산기 설명]",
  "totalTime": "PT1M",
  "tool": [{"@type": "HowToTool", "name": "[계산기명] (무료)"}],
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "[1단계]", "text": "[설명]"},
    {"@type": "HowToStep", "position": 2, "name": "[2단계]", "text": "[설명]"},
    {"@type": "HowToStep", "position": 3, "name": "[3단계]", "text": "[설명]"}
  ]
}

파일: tools/roi-calculator.html, tools/multa-calculator.html, tools/tax-loss-harvesting.html
각 계산기 사용 3단계는 실제 계산기 흐름에 맞게 작성해줘.
```

---

---

# STEP 8 — 최종 점검 프롬프트
> ⏱ 예상 시간: 10분
> ✅ 완료 기준: 모든 페이지 링크 작동, 모바일 반응형 확인

```
전체 사이트를 점검해줘.

확인 항목:
1. 모든 nav 링크가 실제 파일과 연결되는지 확인
2. 모바일(390px) 반응형 — nav, 그리드, 계산기 레이아웃
3. 다크/라이트 테마 토글이 모든 페이지에서 작동하는지
4. 계산기 숫자 입력 시 결과가 즉시 표시되는지
5. 업비트 API 연동 페이지 (hot-coins.html, kimchi-calculator.html) 데이터 로딩 확인
6. sitemap.xml — 모든 페이지 URL 포함 여부
7. 각 페이지 <title>과 <meta description> 있는지
8. <h1> 태그가 각 페이지에 1개인지

발견한 문제를 모두 수정해줘.
```

---

---

# 선택 추가 기능 (완성 후 업그레이드)

## A. 공포·탐욕 지수 위젯 (index.html에 추가)

```
index.html 히어로 섹션 아래에 공포·탐욕 지수 실시간 위젯을 추가해줘.

API: https://api.alternative.me/fng/
응답: {"data": [{"value": "72", "value_classification": "Greed", ...}]}

UI:
- 원형 게이지 또는 슬라이더 바 (0~100)
- 단계별 색상: 0~24 극도공포(#f85149) / 25~49 공포(#d29922) / 50 중립(#8957e5) / 51~75 탐욕(#3fb950) / 76~100 극도탐욕(#2ea043)
- 한글 분류명 매핑: Extreme Fear=극도 공포, Fear=공포, Neutral=중립, Greed=탐욕, Extreme Greed=극도 탐욕
- 업데이트 시간 표시
```

## B. 페이지별 내부 링크 강화

```
SEO 내부 링크를 강화해줘.

각 계산기 페이지의 본문에 관련 계산기 링크를 자연스럽게 추가해줘:
- 세금 계산기 → 절세 하베스팅, CSV 세금계산기
- 물타기 계산기 → DCA 계산기, 수익률 계산기
- 김치프리미엄 → 업비트 급등순위
- 블로그 글 → 해당 주제 계산기 (인라인 텍스트 링크)

각 페이지에 최소 내부 링크 3개 이상 포함되도록 해줘.
```

## C. 업비트 코인 검색 모달

```
assets/js/coin-data.js를 만들어줘.

업비트 주요 코인 200개의 한글명·심볼·카테고리를 담은 데이터베이스:
const COIN_DB = [
  { symbol: "BTC", name: "비트코인", nameEn: "Bitcoin", upbit: true, bithumb: true },
  { symbol: "ETH", name: "이더리움", ... },
  ... (200개)
];

searchCoins(query) 함수:
- 한글명, 영문명, 심볼 모두 검색
- 부분 일치 지원
- 결과 상위 10개 반환

common.js에서 이 파일을 사용해 계산기 코인 입력 필드에
자동완성 드롭다운이 표시되도록 해줘.
```

---

---

# 빠른 참조 — 자주 쓰는 단일 프롬프트

## 새 계산기 페이지 추가
```
tools/[파일명].html [계산기명]을 만들어줘.
입력: [입력 필드 목록]
출력: [계산 결과 목록]
공식: [계산 공식]
기존 계산기들(tax-calculator.html)과 동일한 디자인·구조로 만들어줘.
```

## 새 블로그 글 추가
```
blog/[카테고리]/[슬러그].html 글을 만들어줘.
제목: [제목]
주제: [내용 설명]
기존 블로그 글들과 동일한 구조(summary-box→관련글→목차→본문→계산기CTA→FAQ)로 만들어줘.
```

## 기존 페이지에 기능 추가
```
[파일명].html에 [기능명]을 추가해줘.
위치: [어느 요소 아래/위에]
기능: [구체적 설명]
기존 스타일(CSS 변수, 클래스명)과 통일해줘.
```

## 전체 사이트 특정 요소 일괄 변경
```
모든 계산기 페이지 (tools/*.html)의 [변경할 부분]을 [새로운 내용]으로 바꿔줘.
단, index.html과 blog/ 폴더는 건드리지 마줘.
```

---

---

# 트러블슈팅 (자주 발생하는 문제)

## 문제 1: 사이트가 브라우저에서 안 열림
```
Start application 워크플로우를 재시작해줘.
명령어: fuser -k 5000/tcp 2>/dev/null; sleep 1; python3 -m http.server 5000 --bind 0.0.0.0
```

## 문제 2: nav/footer가 안 보임
```
common.js의 nav/footer 자동 주입 코드를 확인해줘.
DOMContentLoaded 이벤트 안에서 실행되는지, 선택자가 올바른지 확인해줘.
```

## 문제 3: API 데이터가 안 불러와짐 (CORS 오류)
```
업비트/바이낸스 API fetch 코드에서 CORS 오류가 나면,
업비트 API는 브라우저에서 직접 호출 가능한 공개 API이므로 URL이 올바른지 확인해줘.
에러 내용: [콘솔 에러 복붙]
```

## 문제 4: 모바일에서 레이아웃이 깨짐
```
[파일명].html 모바일 반응형을 수정해줘.
화면 너비 390px(아이폰 기준)에서 [깨지는 부분 설명] 이 문제가 있어.
미디어쿼리 @media(max-width:768px)에 수정사항을 추가해줘.
```

## 문제 5: 다크/라이트 토글이 일부 페이지에서 작동 안 함
```
[파일명].html에서 테마 토글이 작동하지 않아.
common.js의 테마 토글 코드가 해당 페이지에 적용되는지 확인하고,
인라인 <style>에서 하드코딩된 색상값을 CSS 변수로 교체해줘.
```

---

*이 가이드의 모든 프롬프트는 Replit Agent에서 테스트 완료된 버전입니다.*
*각 단계 완료 후 브라우저 미리보기에서 확인하고 다음 단계로 진행하세요.*
