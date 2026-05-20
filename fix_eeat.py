#!/usr/bin/env python3
"""
블로그 46개 전체에 E-E-A-T 저자 정보 블록 추가
삽입 위치: <article ...> 태그 바로 다음 줄
날짜: JSON-LD dateModified 값 추출, 없으면 2026-05-20 사용
"""
import re, os, glob

AUTHOR_BLOCK_TPL = '''<div class="author-meta" style="display:flex;align-items:center;gap:12px;padding:12px 16px;margin-bottom:20px;background:var(--card,#1a1a1a);border:1px solid var(--border-subtle,#2a2a2a);border-radius:10px;font-size:.85rem;color:var(--text-sub,#aaa);">
  <span style="font-size:1.4rem;flex-shrink:0;">✍️</span>
  <div style="line-height:1.6;">
    <strong style="color:var(--text,#f0f0f0);">CryptoTax.cloud 세금 정보팀</strong>
    <span style="margin:0 6px;opacity:.4;">|</span>최종 업데이트:
    <time datetime="{iso}">{display}</time>
    <span style="margin:0 6px;opacity:.4;">|</span>
    <span style="color:var(--orange,#f7971e);">⚠️ 본 내용은 참고용이며 세무사 상담을 권장합니다</span>
  </div>
</div>'''

MONTHS_KO = ['','1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

def iso_to_display(iso):
    try:
        y, m, d = iso.split('-')
        return f"{y}년 {MONTHS_KO[int(m)]} {int(d)}일"
    except:
        return "2026년 5월 20일"

def process(filepath):
    content = open(filepath, encoding='utf-8').read()

    # 이미 처리된 파일 건너뜀
    if 'author-meta' in content:
        return False, 'SKIP (already has author-meta)'

    # JSON-LD에서 dateModified 추출
    m = re.search(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"', content)
    iso_date = m.group(1) if m else '2026-05-20'
    display_date = iso_to_display(iso_date)

    block = AUTHOR_BLOCK_TPL.format(iso=iso_date, display=display_date)

    # <article ...> 태그 닫는 > 바로 다음에 삽입
    new_content, n = re.subn(
        r'(<article[^>]*>)',
        r'\1\n' + block,
        content,
        count=1
    )
    if n == 0:
        return False, 'NO <article> TAG'

    open(filepath, 'w', encoding='utf-8').write(new_content)
    return True, f'OK ({iso_date})'

files = (
    glob.glob('blog/coin-tax/*.html') +
    glob.glob('blog/investment/*.html') +
    glob.glob('blog/guide/*.html')
)

ok = skip = err = 0
for f in sorted(files):
    success, msg = process(f)
    slug = os.path.basename(f)
    if success:
        ok += 1
        print(f'  ✓ {slug} — {msg}')
    elif 'SKIP' in msg:
        skip += 1
        print(f'  - {slug} — {msg}')
    else:
        err += 1
        print(f'  ✗ {slug} — {msg}')

print(f'\n완료: {ok}개 추가 / {skip}개 스킵 / {err}개 실패')
