#!/usr/bin/env python3
"""
CryptoTax.cloud — 블로그 아티클 실사 이미지 일괄 주입 스크립트
Unsplash 무료 이미지 사용 / SEO alt 최적화 적용
"""

import os
import re

# ── 파일명 → (Unsplash photo ID, SEO alt 텍스트, 캡션) ─────────────────────
IMAGE_MAP = {
    # ── coin-tax 카테고리 ────────────────────────────────────────────────
    "coin-tax/2027-guide": (
        "1621761191319-c6fb2aa46f4c",
        "2027년 코인 세금 22% 완전 가이드 — 가상자산 양도소득세 비트코인 황금 동전",
        "2027년 1월 1일 시행 가상자산 양도소득세 22% 완전 정복 가이드"
    ),
    "coin-tax/22-percent-tax": (
        "1554224155-8d04cb21cd6c",
        "코인 세금 22% 세율 계산 — 계산기와 세금 서류 가상자산 양도소득세",
        "소득세 20% + 지방소득세 2% = 22% 세율 계산 방법"
    ),
    "coin-tax/250man-exemption": (
        "1580519542036-c47de6196ba5",
        "코인 세금 250만원 기본공제 — 한국 원화 지폐 가상자산 비과세 한도",
        "연 250만원 기본공제 활용으로 코인 세금 절감하는 방법"
    ),
    "coin-tax/bithumb-tax-guide": (
        "1611974789855-9c2a0a7236a3",
        "빗썸 코인 세금 신고 가이드 — 거래소 화면 가상자산 매도 수익 신고",
        "빗썸 거래 내역 다운로드 후 세금 신고하는 완전 가이드"
    ),
    "coin-tax/corporation-tax": (
        "1568598035424-7be0e6a37b95",
        "법인 가상자산 세금 — 기업 사무실 코인 법인세 신고 방법",
        "법인이 코인 투자 시 납부해야 하는 법인세 완전 정리"
    ),
    "coin-tax/family-account-tax": (
        "1450101499163-c8848c66ca85",
        "가족 계좌 코인 세금 — 가족 금융 서류 가상자산 명의 증여세",
        "가족 계좌 이용 코인 거래 시 세금 이슈 완전 정리"
    ),
    "coin-tax/gift-tax": (
        "1549465323-f2b49aa1d11e",
        "코인 증여세 계산 — 선물 상자 가상자산 증여 세금 신고",
        "비트코인 코인 증여 시 부과되는 증여세 계산 방법"
    ),
    "coin-tax/hometax-guide": (
        "1543286386-2e659306cd6c",
        "홈택스 코인 세금 신고 방법 — 컴퓨터 홈택스 가상자산 종합소득세",
        "홈택스에서 가상자산 양도소득세 신고하는 단계별 가이드"
    ),
    "coin-tax/loss-tax-refund": (
        "1611532736597-de2d4265fba3",
        "코인 손실 세금 환급 — 투자 손실 차트 가상자산 손익통산 공제",
        "코인 투자 손실 발생 시 세금 환급 및 손익통산 방법"
    ),
    "coin-tax/moving-average-cost": (
        "1559526324-4b87b5e36e44",
        "코인 이동평균 취득원가 계산 — 투자 차트 가상자산 평균단가",
        "이동평균법으로 코인 취득원가 계산하는 완전 가이드"
    ),
    "coin-tax/nft-tax": (
        "1639762681485-074b7f938ba0",
        "NFT 세금 신고 방법 2027 — 디지털 아트 NFT 가상자산 양도세",
        "NFT 거래 수익에 부과되는 가상자산 세금 신고 방법"
    ),
    "coin-tax/no-report-penalty": (
        "1607944024060-0450380ddd33",
        "코인 세금 무신고 가산세 — 세금 신고서 가상자산 미신고 벌금",
        "가상자산 세금 미신고 시 부과되는 가산세 및 처벌 기준"
    ),
    "coin-tax/overseas-exchange-tax": (
        "1634704784915-aacf363b021f",
        "해외 거래소 코인 세금 — 글로벌 비트코인 바이낸스 OKX 세금 신고",
        "바이낸스 등 해외 거래소 코인 수익 국내 세금 신고 방법"
    ),
    "coin-tax/staking-tax": (
        "1620321023374-d1a68fbc720d",
        "이더리움 스테이킹 세금 2027 — ETH 스테이킹 이자 수익 과세",
        "코인 스테이킹 이자 수익에 부과되는 2027년 세금 완전 정리"
    ),
    "coin-tax/upbit-tax-guide": (
        "1518458028785-8fbcd101ebb9",
        "업비트 코인 세금 신고 가이드 — 암호화폐 거래소 가상자산 세금",
        "업비트 거래 내역 기반 2027 가상자산 세금 신고 완전 가이드"
    ),
    # ── investment 카테고리 ───────────────────────────────────────────────
    "investment/bitcoin-halving": (
        "1636953056323-9c09fdd74fa6",
        "비트코인 반감기 투자 전략 2024 — 채굴 비트코인 공급량 감소",
        "비트코인 반감기가 가격에 미치는 영향과 투자 전략"
    ),
    "investment/compound-simulation": (
        "1587854680352-936b22b91030",
        "코인 복리 시뮬레이션 — 투자 복리 이자 가상자산 수익 계산",
        "코인 투자 복리 효과 시뮬레이션 — 10년 수익률 계산"
    ),
    "investment/cut-loss-timing": (
        "1606107557195-0e29a4b5b4aa",
        "코인 손절 타이밍 — 투자 손실 차트 가상자산 손절매 전략",
        "코린이도 이해하는 코인 손절 타이밍 판단 기준 완전 정리"
    ),
    "investment/dca-strategy": (
        "1559526324-4b87b5e36e44",
        "코인 DCA 정기매수 전략 — 투자 분할매수 비트코인 평균단가 낮추기",
        "달러비용평균법(DCA)으로 코인 리스크 줄이는 투자 전략"
    ),
    "investment/diversification": (
        "1642543492481-44e81e3914a7",
        "코인 포트폴리오 분산투자 — 다양한 암호화폐 자산 배분 전략",
        "비트코인·이더리움·알트코인 분산투자 포트폴리오 구성법"
    ),
    "investment/eth-staking": (
        "1620321023374-d1a68fbc720d",
        "이더리움 ETH 스테이킹 수익률 — 이더리움 코인 APY 이자 계산",
        "이더리움(ETH) 스테이킹 APY 수익률과 세금 처리 완전 가이드"
    ),
    "investment/kimchi-strategy": (
        "1668158499671-4bb5ca3a1f2b",
        "김치프리미엄 투자 전략 — 한국 코인 거래소 프리미엄 차익거래",
        "김치프리미엄 발생 원인과 활용 투자 전략 완전 정리"
    ),
    "investment/multa-timing": (
        "1612151855475-877969f4a6cc",
        "코인 물타기 타이밍 — 분할매수 평균단가 하락 투자 전략",
        "코인 물타기 최적 타이밍 판단 기준과 리스크 관리 방법"
    ),
    "investment/portfolio": (
        "1589987961580-da15e12f21ba",
        "코인 투자 포트폴리오 구성 — 자산 배분 비트코인 이더리움 알트코인",
        "2027 코인 투자자를 위한 최적 포트폴리오 구성 전략"
    ),
    "investment/reverse-kimchi": (
        "1618044733963-e6408fbf4ae1",
        "역프리미엄 코인 투자 기회 — 해외 거래소 코인 가격 차이 활용",
        "역프리미엄(마이너스 김프) 발생 시 코인 투자 활용 전략"
    ),
    "investment/sol-vs-eth-staking": (
        "1573855619003-97b4799dcd8b",
        "솔라나 SOL vs 이더리움 ETH 스테이킹 비교 — APY 수익률 세금",
        "솔라나 vs 이더리움 스테이킹 수익률·세금·리스크 완전 비교"
    ),
    "investment/target-price": (
        "1622790498823-cf87cc9adb0a",
        "코인 목표가 설정 방법 — 비트코인 이더리움 목표 수익률 계산",
        "수익률 역산으로 코인 목표 매도가 설정하는 완전 가이드"
    ),
    "investment/tax-loss-harvesting": (
        "1554224155-8d04cb21cd6c",
        "절세 하베스팅 Tax Loss Harvesting — 코인 손실 세금 절감 전략",
        "코인 평가손실 활용 절세 하베스팅 완전 가이드"
    ),
    "investment/upbit-coin-gather": (
        "1651340981821-b2f8a6bf1cb5",
        "업비트 코인 모으기 전략 — 소액 분할매수 자동투자 방법",
        "업비트에서 코인 꾸준히 모으는 소액 분할매수 전략"
    ),
    "investment/upbit-fee-save": (
        "1556742049-0cfed4f6a45d",
        "업비트 거래 수수료 절약 방법 — 코인 거래소 수수료 최소화 전략",
        "업비트 수수료 구조 이해와 절약 방법 완전 가이드"
    ),
    # ── guide 카테고리 ────────────────────────────────────────────────────
    "guide/beginner-guide": (
        "1488190211105-8b0e65b80b4e",
        "코린이 코인 투자 입문 가이드 — 초보자 비트코인 업비트 시작하기",
        "코인 처음 시작하는 코린이를 위한 완전 입문 가이드"
    ),
    "guide/coin-terms": (
        "1522202176988-66273c2fd55f",
        "코인 용어 사전 완전 정리 — 가상자산 기초 용어 블록체인 DeFi NFT",
        "코린이가 꼭 알아야 할 코인 기초 용어 완전 정리"
    ),
    "guide/dca-intro": (
        "1434626881859-194d67b2b86f",
        "코인 DCA 달러비용평균법 입문 — 정기매수 투자 초보자 가이드",
        "코린이도 바로 실천하는 DCA 정기매수 투자법 완전 입문"
    ),
    "guide/exchange-fee-compare": (
        "1640340434855-6084b1f4901c",
        "업비트 빗썸 코인원 거래소 수수료 비교 — 한국 암호화폐 거래소",
        "업비트·빗썸·코인원·고팍스 거래소 수수료 및 기능 완전 비교"
    ),
    "guide/kimchi-premium-intro": (
        "1604594849809-dfedbc827105",
        "김치프리미엄이란 무엇인가 — 한국 코인 거래소 프리미엄 현상",
        "김치프리미엄 의미·원인·계산 방법 코린이 완전 이해 가이드"
    ),
    "guide/satoshi-unit": (
        "1621761191319-c6fb2aa46f4c",
        "비트코인 사토시 단위 완전 이해 — 1 BTC = 1억 사토시 소수점 단위",
        "사토시·비트·밀리비트코인 단위 완전 이해와 원화 환산 방법"
    ),
    "guide/tax-timeline": (
        "1606107557195-0e29a4b5b4aa",
        "2027 코인 세금 신고 일정 타임라인 — 가상자산 세금 준비 캘린더",
        "2027년 코인 세금 신고 핵심 일정과 준비 체크리스트"
    ),
    "guide/upbit-csv-download": (
        "1543286386-2e659306cd6c",
        "업비트 거래 내역 CSV 다운로드 방법 — 세금 신고용 엑셀 내보내기",
        "업비트 앱·PC에서 거래 내역 CSV 다운로드 단계별 가이드"
    ),
    "guide/upbit-signup": (
        "1507003211169-0a1dd7228f2d",
        "업비트 가입 방법 완전 가이드 — 코린이 업비트 회원가입 KYC 인증",
        "업비트 회원가입부터 KYC 인증·입금까지 단계별 완전 가이드"
    ),
    "guide/wallet-guide": (
        "1575715812963-ea6b3e5c5a72",
        "코인 지갑 종류와 선택 방법 — 하드웨어 소프트웨어 메타마스크 지갑",
        "코인 지갑 종류별 특징과 안전한 사용법 완전 가이드"
    ),
    # ── blog 루트 파일들 ──────────────────────────────────────────────────
    "coin-tax-2027-guide": (
        "1590283603385-17ffb3a7f29f",
        "코인 세금 2027 완전 가이드 — 비트코인 동전 가상자산 양도소득세",
        "2027 코인 세금 총정리 — 업비트·빗썸 투자자 필독 가이드"
    ),
    "coin-tax-calculation-5-steps": (
        "1609726494499-27d3e942456c",
        "코인 세금 계산 5단계 — 가상자산 양도소득세 계산법 완전 정리",
        "코인 세금 직접 계산하는 5단계 방법 완전 가이드"
    ),
    "김치프리미엄-1000만원-차익-세금-신고": (
        "1668158499671-4bb5ca3a1f2b",
        "김치프리미엄 1000만원 차익 세금 신고 방법 — 거래소 프리미엄 과세",
        "김치프리미엄 차익 1000만원 발생 시 세금 계산 및 신고 가이드"
    ),
    "beginner-guide": (
        "1488190211105-8b0e65b80b4e",
        "코인 초보 투자자 완전 입문 가이드 — 비트코인 업비트 처음 시작",
        "코인 투자 처음 시작하는 분을 위한 완전 입문 가이드"
    ),
    "binance-trade-history": (
        "1634704784915-aacf363b021f",
        "바이낸스 거래 내역 다운로드 세금 신고 방법 — 해외 거래소 CSV",
        "바이낸스 거래 내역 다운로드 후 한국 세금 신고하는 방법"
    ),
    "bitcoin-dca-10years": (
        "1636953056323-9c09fdd74fa6",
        "비트코인 10년 DCA 정기매수 수익률 시뮬레이션 — 장기투자 전략",
        "비트코인을 10년간 매달 정기매수했다면 수익률은?"
    ),
    "coin-multa-average-price": (
        "1612151855475-877969f4a6cc",
        "코인 물타기 평균단가 계산 방법 — 비트코인 분할매수 평균가격",
        "코인 물타기로 평균단가를 낮추는 계산 방법 완전 가이드"
    ),
    "coinone-tax-guide": (
        "1518458028785-8fbcd101ebb9",
        "코인원 거래 내역 세금 신고 방법 — 코인원 CSV 다운로드 과세",
        "코인원 거래 내역 다운로드 후 세금 신고하는 완전 가이드"
    ),
    "kimchi-premium-1000-tax-guide": (
        "1604594849809-dfedbc827105",
        "김치프리미엄 차익거래 세금 신고 완전 가이드 — 거래소 프리미엄 과세",
        "김치프리미엄 차익거래 수익에 부과되는 세금 신고 방법"
    ),
    "metamask-tax-guide": (
        "1639762681485-074b7f938ba0",
        "메타마스크 DeFi 세금 신고 방법 — 이더리움 지갑 가상자산 과세",
        "메타마스크 DeFi 거래·스왑·스테이킹 세금 신고 완전 가이드"
    ),
    "ripple-lawsuit-tax": (
        "1573855619003-97b4799dcd8b",
        "리플 XRP 소송 결과 세금 — XRP 투자자 가상자산 법적 지위 과세",
        "리플(XRP) SEC 소송 결과가 한국 투자자 세금에 미치는 영향"
    ),
    "solana-staking-tax": (
        "1573855619003-97b4799dcd8b",
        "솔라나 SOL 스테이킹 세금 신고 — SOL 이자 수익 가상자산 과세",
        "솔라나(SOL) 스테이킹 이자 수익 2027 세금 신고 완전 가이드"
    ),
    "una-loss-deduction": (
        "1611532736597-de2d4265fba3",
        "코인 손실 공제 방법 — 투자 손실 세금 감면 가상자산 손익통산",
        "코인 투자 손실 발생 시 세금 공제 받는 방법 완전 정리"
    ),
    "upbit-csv-download-guide-2027": (
        "1543286386-2e659306cd6c",
        "업비트 CSV 다운로드 2027 세금 신고용 — 거래 내역 엑셀 내보내기",
        "2027 세금 신고를 위한 업비트 CSV 거래 내역 다운로드 가이드"
    ),
    "upbit-csv-download-guide": (
        "1556742049-0cfed4f6a45d",
        "업비트 거래 내역 다운로드 방법 — 업비트 앱 CSV 엑셀 내보내기",
        "업비트 앱과 PC에서 거래 내역 CSV 다운로드하는 방법"
    ),
    "virtual-asset-tax-2027-guide": (
        "1621761191319-c6fb2aa46f4c",
        "가상자산 세금 2027 완전 가이드 — 비트코인 이더리움 과세 시행",
        "2027년 1월 시행 가상자산 과세 핵심 내용 완전 정리"
    ),
}

# ── 이미지 HTML 생성 ──────────────────────────────────────────────────────
def make_image_html(photo_id, alt, caption):
    url = f"https://images.unsplash.com/photo-{photo_id}?w=820&h=430&fit=crop&auto=format&q=80"
    url_2x = f"https://images.unsplash.com/photo-{photo_id}?w=1640&h=860&fit=crop&auto=format&q=70"
    return f'''<figure class="article-featured-img fade-up">
  <img src="{url}"
       srcset="{url} 820w, {url_2x} 1640w"
       sizes="(max-width:860px) 100vw, 820px"
       alt="{alt}"
       title="{alt}"
       width="820" height="430"
       loading="eager"
       decoding="async"
       fetchpriority="high">
  <figcaption>{caption}</figcaption>
</figure>
'''

# ── 파일 처리 ─────────────────────────────────────────────────────────────
def get_key(filepath):
    """blog/ 접두어를 제거하고 .html 제거"""
    key = filepath.replace("blog/", "", 1).replace(".html", "")
    return key

def process_file(filepath):
    key = get_key(filepath)
    if key not in IMAGE_MAP:
        print(f"  ⚠️  매핑 없음: {key}")
        return False

    photo_id, alt, caption = IMAGE_MAP[key]

    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # 이미 주입된 경우 건너뜀
    if "article-featured-img" in html:
        print(f"  ✅ 이미 있음: {filepath}")
        return False

    img_html = make_image_html(photo_id, alt, caption)

    # <article ...> 태그 바로 뒤에 삽입
    pattern = r'(<article[^>]*>)'
    replacement = r'\1\n' + img_html
    new_html = re.sub(pattern, replacement, html, count=1)

    if new_html == html:
        print(f"  ❌ <article> 태그 없음: {filepath}")
        return False

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_html)

    print(f"  ✅ 삽입 완료: {filepath} [{photo_id[:8]}...]")
    return True

# ── 실행 ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import glob

    blog_files = glob.glob("blog/**/*.html", recursive=True) + glob.glob("blog/*.html")
    blog_files = [f for f in blog_files if not f.endswith("index.html") and not f.endswith("article-template.html")]
    blog_files.sort()

    print(f"\n🚀 처리 대상: {len(blog_files)}개 파일\n")
    success = 0
    for fp in blog_files:
        if process_file(fp):
            success += 1

    print(f"\n✅ 완료: {success}/{len(blog_files)}개 파일 이미지 주입")
