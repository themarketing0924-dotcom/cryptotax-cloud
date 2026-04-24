from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 630

img = Image.new("RGB", (W, H), "#0d1117")
draw = ImageDraw.Draw(img)

def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

# ── 배경 그라디언트 (왼쪽 상단 → 오른쪽 하단) ──────────────────────
bg1 = hex2rgb("#0d1117")
bg2 = hex2rgb("#161b22")
for y in range(H):
    t = y / H
    r = int(bg1[0] + (bg2[0] - bg1[0]) * t)
    g = int(bg1[1] + (bg2[1] - bg1[1]) * t)
    b = int(bg1[2] + (bg2[2] - bg1[2]) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# ── 왼쪽 오렌지 accent 세로 바 ─────────────────────────────────────
for x in range(8):
    alpha = 1.0 - x / 8
    c = int(247 * alpha)
    draw.line([(x, 0), (x, H)], fill=(c, int(120 * alpha), int(30 * alpha)))

# ── 배경 원형 glow ──────────────────────────────────────────────────
def draw_glow(cx, cy, r_max, color_rgb, steps=60):
    for i in range(steps, 0, -1):
        r = int(r_max * i / steps)
        alpha = int(18 * (i / steps) ** 2)
        overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ov_draw = ImageDraw.Draw(overlay)
        ov_draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                        fill=(*color_rgb, alpha))
        img.paste(overlay, mask=overlay)

draw_glow(120,  80, 260, hex2rgb("#f7971e"), 40)
draw_glow(1100, 560, 200, hex2rgb("#58a6ff"), 30)

# ── 상단 배지 (LIVE + 코인 세금 FREE) ───────────────────────────────
FONT_PATH = "/tmp/NotoSansKR-Bold.otf"
try:
    f_badge  = ImageFont.truetype(FONT_PATH, 22)
    f_title1 = ImageFont.truetype(FONT_PATH, 74)
    f_title2 = ImageFont.truetype(FONT_PATH, 52)
    f_sub    = ImageFont.truetype(FONT_PATH, 28)
    f_url    = ImageFont.truetype(FONT_PATH, 30)
    f_tag    = ImageFont.truetype(FONT_PATH, 22)
except:
    f_badge = f_title1 = f_title2 = f_sub = f_url = f_tag = ImageFont.load_default()

# LIVE badge
bx, by = 68, 55
draw.rounded_rectangle([bx, by, bx+68, by+34], radius=8,
                        fill="#f7971e20", outline="#f7971e", width=1)
draw.text((bx + 10, by + 6), "FREE", font=f_badge, fill="#f7971e")

# 2027 badge
b2x = bx + 85
draw.rounded_rectangle([b2x, by, b2x+80, by+34], radius=8,
                        fill="#58a6ff20", outline="#58a6ff", width=1)
draw.text((b2x + 10, by + 6), "2027", font=f_badge, fill="#58a6ff")

# 국세청 badge
b3x = b2x + 97
draw.rounded_rectangle([b3x, by, b3x+120, by+34], radius=8,
                        fill="#3fb95020", outline="#3fb950", width=1)
draw.text((b3x + 10, by + 6), "국세청 기준", font=f_badge, fill="#3fb950")

# ── 메인 타이틀 ─────────────────────────────────────────────────────
line1 = "코인 세금"
line2 = "무료 계산기"

# 오렌지 그라디언트 텍스트를 흉내내기 위해 레이어 사용
def draw_gradient_text(text, x, y, font, c1, c2):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    txt_img = Image.new("RGBA", (tw + 4, th + 4), (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((2, 2), text, font=font, fill=c1)
    img.paste(txt_img, (x, y), mask=txt_img)

draw_gradient_text(line1, 68, 108, f_title1, "#f7971e", "#fdb44b")
draw_gradient_text(line2, 68, 188, f_title1, "#ffffff", "#e6edf3")

# ── 부제목 ─────────────────────────────────────────────────────────
sub = "업비트·빗썸 투자자를 위한 양도소득세 계산기"
draw.text((68, 285), sub, font=f_sub, fill="#8b949e")

# ── 기능 태그들 ────────────────────────────────────────────────────
tags = ["💰 세금", "📈 수익률", "🏊 물타기", "📊 DCA", "🥩 스테이킹", "🌶️ 김치프리미엄"]
tx = 68
ty = 350
for tag in tags:
    bbox = draw.textbbox((0, 0), tag, font=f_tag)
    tw = bbox[2] - bbox[0]
    pad_x, pad_y = 14, 8
    draw.rounded_rectangle(
        [tx, ty, tx + tw + pad_x * 2, ty + 38],
        radius=10,
        fill="#21262d",
        outline="#30363d",
        width=1
    )
    draw.text((tx + pad_x, ty + pad_y), tag, font=f_tag, fill="#c9d1d9")
    tx += tw + pad_x * 2 + 10
    if tx > 1080:
        tx = 68
        ty += 52

# ── 하단 구분선 ────────────────────────────────────────────────────
draw.line([(68, 470), (W - 68, 470)], fill="#30363d", width=1)

# ── 하단: 도메인 + 통계 ────────────────────────────────────────────
# 비트코인 아이콘 (원형)
cx, cy, r = 92, 525, 28
draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill="#f7971e")
draw.text((cx - 10, cy - 16), "₿", font=ImageFont.truetype(FONT_PATH, 30) if FONT_PATH else f_url, fill="#fff")

draw.text((132, 507), "CryptoTax.cloud", font=f_url, fill="#f7971e")
draw.text((132, 537), "한국 최대 코인 세금 계산기", font=f_tag, fill="#8b949e")

# 오른쪽 통계
stats = [("12종", "무료 계산기"), ("0원", "완전 무료"), ("1,326만", "투자자")]
sx = 780
for val, label in stats:
    draw.text((sx, 495), val, font=ImageFont.truetype(FONT_PATH, 38) if FONT_PATH else f_url, fill="#f7971e")
    draw.text((sx, 538), label, font=f_tag, fill="#8b949e")
    sx += 145

# ── 저장 ──────────────────────────────────────────────────────────
img.save("og-image.png", "PNG", optimize=True)
print("✅ og-image.png saved (1200×630)")
