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
  css/common.css            # 공통 CSS (CSS 변수, 컴포넌트 스타일)
  js/common.js              # 공통 JS (테마 토글, 스크롤 애니메이션)
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

## 완료된 작업

1. Replit 서빙 설정 (Python3 HTTP 5000)
2. TradingView 다크/라이트 테마 토글 수정 (index.html)
3. Phase 1: 공통 assets (common.css, common.js, nav.html, footer.html)
4. Phase 2: 6개 도구 페이지 공통 nav/footer/블로그카드/외부링크 업데이트
5. Phase 3: blog/index.html (40개 카드 + 카테고리 필터)
6. Phase 4: 블로그 포스트 40편 생성 (세금15 + 투자전략15 + 입문가이드10)
7. Phase 5: sitemap.xml (55개 URL) + robots.txt 업데이트
