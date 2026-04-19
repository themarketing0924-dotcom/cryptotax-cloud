# CryptoTax.cloud

A static website providing cryptocurrency tax calculators and tools for South Korean investors, focused on the 2027 virtual asset tax laws.

## Project Structure

- `index.html` - Main landing page with primary tax calculator
- `style.css`, `theme.css` - Stylesheets with dark/light mode support
- `tools/` - Individual calculator pages (ROI, DCA, Staking, Kimchi Premium, etc.)
- `blog/` - Educational articles and guides in Korean
- `images/` - Graphic assets
- `robots.txt`, `sitemap.xml` - SEO files

## Tech Stack

- Pure static site: HTML5, CSS3, Vanilla JavaScript
- No build system or package manager
- External integrations via CDN: TradingView widgets, Google Analytics
- External API: Alternative.me (Fear & Greed Index)

## Running

The site is served using Python's built-in HTTP server on port 5000:

```
python3 -m http.server 5000 --bind 0.0.0.0
```

## Deployment

Configured as a static site deployment with the root directory as the public directory.
