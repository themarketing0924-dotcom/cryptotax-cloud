# CryptoTax.cloud

한국 코인 투자자를 위한 2027 가상자산 세금 계산기 정적 웹사이트.

## 기술 스택

- 순수 정적 HTML/CSS/JS (빌드 시스템 없음)
- Python3 HTTP 서버 (포트 5000)
- 외부 CDN 의존성만 허용 (TradingView 등)
- 테마: localStorage `ctc-theme` 키로 다크/라이트 전환

## 프로젝트 구조

```
index.html                  # 메인 랜딩 페이지 (★ 절대 건드리지 말 것)
assets/
  css/common.css            # 공통 CSS (CSS 변수, 컴포넌트 스타일, 티커, 애니메이션, 코인모달)
  js/common.js              # 공통 JS (테마, 스크롤 애니메이션, 코인 티커 자동주입, CoinSearch 모달)
  js/coin-data.js           # 업비트·빗썸 코인 데이터베이스 200개+ (COIN_DB, searchCoins)
  components/
    nav.html                # 공통 nav 참고용
    footer.html             # 공통 footer 참고용
tools/
  tax-calculator.html       # 코인 세금 계산기
  dca-calculator.html       # DCA 계산기
  multa-calculator.html     # 물타기 계산기
  kimchi-calculator.html    # 김프 계산기
  csv-tax-calculator.html   # CSV 세금 계산기
  tax-loss-harvesting.html  # 절세 하베스팅 계산기
  roi-calculator.html       # 수익률 계산기
  staking-calculator.html   # 스테이킹 계산기
  ... (기타 도구들)
blog/
  index.html                # 블로그 인덱스 (40개 글, 카테고리 필터)
  coin-tax/                 # 세금 카테고리 (15편)
  investment/               # 투자전략 카테고리 (15편)
  guide/                    # 입문가이드 카테고리 (10편)
sitemap.xml                 # 전체 URL 사이트맵
robots.txt                  # 크롤러 설정
```

## 주요 CSS 변수

- `--orange: #f7971e` — 주요 액센트 색상
- `--bg: #0a0a0a` — 다크 배경
- `--card: #1a1a1a` — 카드 배경
- `--text: #f0f0f0` — 기본 텍스트
- `--text-sub: #aaa` — 보조 텍스트

## 세금 계산 공식 (2027 기준)

- 세율: 22% (소득세 20% + 지방소득세 2%)
- 기본공제: 연 250만원
- 과세표준 = MAX(0, 총 양도차익 - 250만원)
- 세액 = 과세표준 × 22%
- 취득원가: 이동평균법

## 블로그 아티클 표준 (현재 적용)

### 아티클 페이지 구조 (닐파텔 스타일)
1. `<body data-no-ticker>` — 아티클 페이지에는 TradingView 티커 없음 (blog/index.html만 허용)
2. 스크롤 애니메이션 없음 — `fade-up` 클래스 사용 안 함
3. 통계 박스(stat-box) 없음 — 목차 다음 바로 본문 진행
4. summary-box → 관련 글 3줄 → 목차 → 본문 순서
5. 하단: 관련 계산기 3개 + 함께 읽으면 좋은 글 3개 + 공식 출처 3개
6. 외부링크: 본문 내 핵심 용어에 위키백과·나무위키·국세청·coinlabs.kr 1-3개 삽입

### 썸네일 기준 (신규 아티클)
- 한국 투자자 선호 유형: 차트+텍스트 오버레이, 밝은 그래픽, 직관적 키워드 표시
- Unsplash 대신 코인 관련 직접 이미지 또는 그래프 사용 권장

### 주요 외부링크 (SEO 신뢰 신호)
- 국세청 가상자산: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2412
- 금융위원회: https://www.fsc.go.kr/no010101
- 코인랩스 용어집: https://coinlabs.kr/terms
- 위키백과 한국어: https://ko.wikipedia.org
- 나무위키: https://namu.wiki
- 홈택스: https://www.hometax.go.kr

## 완료된 작업

1. Replit 서빙 설정 (Python3 HTTP 5000)
2. TradingView 다크/라이트 테마 토글 수정 (index.html)
3. Phase 1: 공통 assets (common.css, common.js, nav.html, footer.html)
4. Phase 2: 6개 도구 페이지 공통 nav/footer/블로그카드/외부링크 업데이트
5. Phase 3: blog/index.html (40개 카드 + 카테고리 필터)
6. Phase 4: 블로그 포스트 40편 생성 (세금15 + 투자전략15 + 입문가이드10)
7. Phase 5: sitemap.xml (55개 URL) + robots.txt 업데이트
8. Phase 6: 전체 아티클 페이지 표준화 — 티커 제거, 애니메이션 제거, stat-box 제거, 관련글 블록 삽입, 외부링크 추가
