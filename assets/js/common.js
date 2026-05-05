// ============================================================
// CryptoTax.cloud — 공통 JavaScript
// ============================================================

// ⓪-1 네이버 애널리틱스 자동 주입
(function(){
  var s=document.createElement('script');
  s.type='text/javascript';
  s.src='//wcs.pstatic.net/wcslog.js';
  s.onload=function(){
    if(!window.wcs_add) window.wcs_add={};
    window.wcs_add['wa']='9e2830d2453b30';
    if(window.wcs) wcs_do();
  };
  document.head.appendChild(s);
})();

// ⓪-2 GA4 서브 페이지 자동 주입 (메인 외 페이지용)
(function(){
  if(document.querySelector('script[src*="googletagmanager"]')) return;
  var s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id=G-59PKBNRPBZ';
  document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  window.gtag=gtag;
  gtag('js',new Date());
  gtag('config','G-59PKBNRPBZ');
})();

// ① 테마 초기화 (FOUC 방지)
(function(){
  var t=localStorage.getItem('ctc-theme')||'dark';
  document.documentElement.setAttribute('data-theme',t);
  window.addEventListener('DOMContentLoaded',function(){ _applyThemeUI(t); });
})();

function _applyThemeUI(theme){
  var isLight=theme==='light';
  var btn=document.getElementById('themeBtn');
  if(btn)btn.textContent=isLight?'🌙 다크':'☀️ 라이트';
  var sunSvg=document.getElementById('sunSvg');
  var moonSvg=document.getElementById('moonSvg');
  if(sunSvg)sunSvg.style.display=isLight?'none':'';
  if(moonSvg)moonSvg.style.display=isLight?'':'none';
  document.querySelectorAll('.toggle-track').forEach(function(track){
    track.classList.toggle('active',isLight);
  });
  var drawerIcon=document.getElementById('ctcDrawerThemeIcon');
  if(drawerIcon)drawerIcon.textContent=isLight?'🌙':'☀️';
}

// ② 테마 토글 — localStorage 기반 전 페이지 동기화
window.toggleTheme = function(){
  var next = document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme', next);
  document.documentElement.style.colorScheme = next;
  localStorage.setItem('ctc-theme', next);
  _applyThemeUI(next);
  try{ document.dispatchEvent(new CustomEvent('themeChange',{detail:next})); }catch(e){}
};

// ③ 스크롤 자동 리빌 — modujuso 스타일 (전체 페이지 자동 감지)
(function(){
  'use strict';

  // ── 그리드 자식에 스태거 딜레이 적용할 부모 셀렉터 ──
  var GRIDS = [
    '.tools-grid','.market-grid','.blog-grid',
    '.channels-grid','.exchange-grid','.hero-stats',
    '.social-proof-inner','.tools-cards','.card-grid'
  ].join(',');

  // ── 개별 단독 리빌 셀렉터 ────────────────────────────
  var SINGLES = [
    '.section-title','.urgency','.fg-widget','.calc-section',
    '.email-section','.faq-item','.partner-banner',
    '.article-featured-img','.summary-box','.toc',
    '.tool-hero','article>h2','article>h3',
    'article>p','article>ul','article>ol',
    'article>figure','.info-box','.warning-box',
    '.adunit','.adsense-wrap'
  ].join(',');

  // ── 딜레이 단계 (초) ─────────────────────────────────
  var STEP = 0.07, MAX_D = 0.35;

  function addReveal(el, delay){
    if(el.classList.contains('ctc-r')) return;
    el.classList.add('ctc-r');
    if(delay) el.style.transitionDelay = Math.min(delay, MAX_D) + 's';
  }

  function init(){
    // 1) 그리드 자식 스태거
    document.querySelectorAll(GRIDS).forEach(function(grid){
      Array.from(grid.children).forEach(function(child, i){
        addReveal(child, i * STEP);
      });
    });

    // 2) 단독 요소
    document.querySelectorAll(SINGLES).forEach(function(el){
      addReveal(el, 0);
    });

    // 3) IntersectionObserver 등록
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('ctc-v','visible');
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.08, rootMargin:'0px 0px -36px 0px'});

    // ctc-r 포함 기존 클래스 모두 관찰
    document.querySelectorAll(
      '.ctc-r,.fade-up,.fade-left,.fade-right,.fade-in,.zoom-in'
    ).forEach(function(el){ obs.observe(el); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ④ TradingView 티커테이프 자동 주입 — 전 페이지 통일 (nav 바로 아래)
(function(){
  var WRAP_ID = 'ctc-tv-ticker';
  var SYMBOLS = [
    {proName:'BINANCE:BTCUSDT',  title:'비트코인'},
    {proName:'BINANCE:ETHUSDT',  title:'이더리움'},
    {proName:'BINANCE:XRPUSDT',  title:'리플'},
    {proName:'BINANCE:SOLUSDT',  title:'솔라나'},
    {proName:'BINANCE:ADAUSDT',  title:'에이다'},
    {proName:'BINANCE:DOGEUSDT', title:'도지코인'},
    {proName:'BINANCE:AVAXUSDT', title:'아발란체'},
    {proName:'BINANCE:LINKUSDT', title:'체인링크'},
    {proName:'BINANCE:DOTUSDT',  title:'폴카닷'},
    {proName:'BINANCE:BNBUSDT',  title:'BNB'}
  ];

  function getTheme(){
    var t = document.documentElement.getAttribute('data-theme') || localStorage.getItem('ctc-theme');
    return t === 'light' ? 'light' : 'dark';
  }

  function removeOldTickers(){
    ['ctc-ticker','ctc-ticker-track'].forEach(function(id){
      var el = document.getElementById(id);
      if(el && el.parentNode) el.parentNode.removeChild(el);
    });
    document.querySelectorAll('.ctc-tool-ticker-wrap,.ticker-wrap').forEach(function(el){
      if(el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function buildTicker(theme){
    if(document.querySelector('[data-no-ticker]')) return;
    var old = document.getElementById(WRAP_ID);
    if(old && old.parentNode) old.parentNode.removeChild(old);

    removeOldTickers();

    var wrap = document.createElement('div');
    wrap.id = WRAP_ID;
    wrap.className = 'tradingview-widget-container';
    wrap.style.cssText = 'width:100%;height:56px;max-height:56px;overflow:hidden;';

    var inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    inner.style.cssText = 'height:56px;max-height:56px;overflow:hidden;';
    wrap.appendChild(inner);

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: SYMBOLS,
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: 'adaptive',
      locale: 'kr',
      colorTheme: theme || getTheme()
    });
    wrap.appendChild(script);

    var nav = document.querySelector('nav.main-nav') || document.querySelector('nav') || document.querySelector('header');
    if(nav && nav.parentNode){
      nav.parentNode.insertBefore(wrap, nav.nextSibling);
    } else {
      document.body.insertBefore(wrap, document.body.firstChild);
    }
  }

  document.addEventListener('themeChange', function(e){
    buildTicker(e.detail || getTheme());
  });

  function init(){
    if(document.getElementById(WRAP_ID)) return;
    buildTicker(getTheme());
  }

  if(document.body){ init(); }
  else { document.addEventListener('DOMContentLoaded', init); }
})();

// ⑤ 숫자 포맷터
var fmt=function(n){return Math.round(n).toLocaleString('ko-KR');};
var fmtD=function(n,d){return Number(n).toFixed(d===undefined?2:d);};

// ⑥ 코인 검색 모달 초기화
// 사용법: CoinSearch.init({ triggerId, onSelect, selectedSymbol })
window.CoinSearch = (function(){
  var _modal = null;
  var _onSelect = null;
  var _activeCategory = '전체';
  var _query = '';

  function _exBadges(ex){
    return (ex||[]).map(function(e){
      return '<span class="ex-badge ex-'+(e==='U'?'upbit':'bithumb')+'">'+(e==='U'?'U':'B')+'</span>';
    }).join('');
  }

  function _renderList(){
    if(!_modal) return;
    var list = _modal.querySelector('.coin-modal-list');
    var coins = (typeof searchCoins === 'function') ? searchCoins(_query, 200) : [];
    if(_activeCategory !== '전체'){
      coins = coins.filter(function(c){ return c.cat === _activeCategory; });
    }
    if(!coins.length){
      list.innerHTML = '<div class="coin-modal-empty">🔍 검색 결과가 없습니다</div>';
      return;
    }
    list.innerHTML = coins.map(function(c){
      var apyHtml = c.apy > 0
        ? '<span class="cmi-apy">APY '+c.apy+'%</span>' : '';
      return '<div class="coin-modal-item" data-symbol="'+c.s+'" onclick="CoinSearch._pick(\''+c.s+'\')">'
        +'<div class="cmi-icon">'+c.icon+'</div>'
        +'<div class="cmi-info">'
          +'<div class="cmi-name">'+c.n+' <span style="color:var(--muted);font-size:11px;font-weight:400">'+c.s+'</span></div>'
          +'<div class="cmi-sub">'+c.en+' &nbsp; '+_exBadges(c.ex)+'</div>'
        +'</div>'
        +'<div class="cmi-right">'+apyHtml+'</div>'
        +'</div>';
    }).join('');
  }

  function _buildModal(){
    if(document.getElementById('ctc-coin-modal')) return document.getElementById('ctc-coin-modal');

    var CATS = ['전체','메이저','L1','L2','DeFi','AI','게임','메타버스','NFT','DePIN','밈','스테이블'];
    var catBtns = CATS.map(function(cat){
      return '<button class="cat-btn'+(cat==='전체'?' active':'')+'" onclick="CoinSearch._setCategory(\''+cat+'\')" data-cat="'+cat+'">'+cat+'</button>';
    }).join('');

    var overlay = document.createElement('div');
    overlay.id = 'ctc-coin-modal';
    overlay.className = 'coin-modal-overlay';
    overlay.innerHTML =
      '<div class="coin-modal">'
        +'<div class="coin-modal-head">'
          +'<input class="coin-modal-search" id="coinModalSearch" placeholder="🔍  코인 이름·심볼 검색..." autocomplete="off" oninput="CoinSearch._search(this.value)">'
          +'<button class="coin-modal-close" onclick="CoinSearch.close()">✕</button>'
        +'</div>'
        +'<div class="coin-modal-cats">'+catBtns+'</div>'
        +'<div class="coin-modal-list"></div>'
      +'</div>';

    overlay.addEventListener('click', function(e){
      if(e.target === overlay) CoinSearch.close();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function init(opts){
    // opts: { triggerId, onSelect, selectedSymbol }
    _onSelect = opts.onSelect || function(){};
    _modal = _buildModal();
    _renderList();

    var trigger = document.getElementById(opts.triggerId);
    if(trigger){
      trigger.addEventListener('click', function(){ CoinSearch.open(); });
    }
  }

  function open(){
    if(!_modal) return;
    _modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var inp = document.getElementById('coinModalSearch');
    if(inp){ setTimeout(function(){ inp.focus(); }, 80); }
  }

  function close(){
    if(!_modal) return;
    _modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function _search(q){
    _query = q;
    _renderList();
  }

  function _setCategory(cat){
    _activeCategory = cat;
    _modal.querySelectorAll('.cat-btn').forEach(function(b){
      b.classList.toggle('active', b.dataset.cat === cat);
    });
    _renderList();
  }

  function _pick(symbol){
    var coin = (typeof COIN_DB !== 'undefined') && COIN_DB.find(function(c){ return c.s === symbol; });
    if(coin && typeof _onSelect === 'function') _onSelect(coin);
    close();
  }

  return { init:init, open:open, close:close, _search:_search, _setCategory:_setCategory, _pick:_pick };
})();


// ⑧ 법적 면책 문구 자동 주입 — 모든 푸터 상단에 삽입
(function(){
  var DISCLAIMER_TEXT = '본 서비스는 세무사법을 준수하며, 제공되는 데이터는 시뮬레이션 결과입니다. 최종 신고는 <strong>파트너 세무사</strong>와 상담하세요.';
  var DISCLAIMER_ID   = 'ctc-legal-disclaimer';

  function inject(){
    if(document.getElementById(DISCLAIMER_ID)) return;
    var div = document.createElement('div');
    div.id = DISCLAIMER_ID;
    div.className = 'ctc-legal-disclaimer';
    div.innerHTML = '⚖️ ' + DISCLAIMER_TEXT;

    // 1순위: footer 또는 .main-footer 맨 앞에 삽입
    var footer = document.querySelector('footer') || document.querySelector('.main-footer');
    if(footer){
      footer.insertBefore(div, footer.firstChild);
      return;
    }
    // 2순위: body 맨 마지막 자식 앞에 삽입
    document.body.appendChild(div);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

// ⑨ 리드 수집 폼 자동 주입 — .lead-form-wrap 없는 계산기 페이지 전용
(function(){
  var CSS_ID='ctc-lead-css';
  var FORM_ID='ctc-auto-lead';

  function injectCSS(){
    if(document.getElementById(CSS_ID)) return;
    var s=document.createElement('style');
    s.id=CSS_ID;
    s.textContent=[
      '.ctc-lead-section{max-width:860px;margin:0 auto;padding:0 var(--section-px,20px) 32px;}',
      '.ctc-lead-box{background:var(--bg2,#161b22);border:2px solid var(--orange,#FF8C00);border-radius:14px;padding:28px 24px;text-align:center;}',
      '.ctc-lead-box h3{font-size:19px;font-weight:900;color:var(--text,#e6edf3);margin-bottom:6px;letter-spacing:-0.3px;word-break:keep-all;line-height:1.35;}',
      '.ctc-lead-box>p{font-size:13px;color:var(--text2,#8b949e);margin-bottom:18px;line-height:1.7;word-break:keep-all;}',
      '.ctc-lead-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:560px;margin:0 auto 8px;}',
      '@media(max-width:540px){.ctc-lead-row{grid-template-columns:1fr;}}',
      '.ctc-lead-row input{padding:12px 14px;border:1.5px solid var(--border,#30363d);border-radius:8px;font-size:14px;background:var(--bg,#0d1117);color:var(--text,#e6edf3);min-height:48px;font-family:inherit;width:100%;transition:border-color .2s;}',
      '.ctc-lead-row input:focus{outline:none;border-color:var(--orange,#FF8C00);}',
      '.ctc-lead-btn{display:block;width:100%;max-width:360px;margin:0 auto;padding:14px;background:var(--orange,#FF8C00);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;min-height:50px;font-family:inherit;transition:opacity .2s,transform .15s;}',
      '.ctc-lead-btn:hover{opacity:.88;transform:translateY(-2px);}',
      '.ctc-lead-check{display:flex;align-items:flex-start;gap:8px;max-width:560px;margin:8px auto;font-size:12px;color:var(--text2,#8b949e);cursor:pointer;line-height:1.6;text-align:left;}',
      '.ctc-lead-ok{display:none;margin-top:14px;padding:12px;background:rgba(63,185,80,.12);border-radius:8px;color:#3fb950;font-weight:700;font-size:14px;}',
      '[data-theme="light"] .ctc-lead-box{background:#fff;border-color:rgba(255,140,0,.6);}',
      '[data-theme="light"] .ctc-lead-row input{background:#f6f8fa;color:#1a1f2e;border-color:#d0d7de;}',
    ].join('\n');
    document.head.appendChild(s);
  }

  function buildForm(){
    if(document.getElementById(FORM_ID)) return;
    var wrap=document.createElement('div');
    wrap.className='ctc-lead-section';
    wrap.id=FORM_ID;
    wrap.innerHTML=[
      '<div class="ctc-lead-box">',
        '<h3>📧 무료 세금 가이드 PDF + 엑셀 2종 받기</h3>',
        '<p>2027 가상자산 세금 완벽 가이드 PDF와 국세청 신고서 엑셀 2종을<br>이메일로 즉시 무료 발송합니다.</p>',
        '<div class="ctc-lead-row">',
          '<input type="text" id="ctc-lf-name" placeholder="이름 (예: 홍길동)" autocomplete="given-name">',
          '<input type="email" id="ctc-lf-email" placeholder="이메일 (예: hong@gmail.com)" autocomplete="email">',
        '</div>',
        '<label class="ctc-lead-check">',
          '<input type="checkbox" id="ctc-lf-agree" style="width:16px;height:16px;min-width:16px;cursor:pointer;accent-color:var(--orange,#FF8C00)">',
          '<span>[필수] 개인정보 수집·이용에 동의합니다 (목적: 자료 발송 / 보유: 3년)</span>',
        '</label>',
        '<button class="ctc-lead-btn" onclick="window.ctcLeadSubmit()">📥 무료 가이드 즉시 받기</button>',
        '<div class="ctc-lead-ok" id="ctc-lf-ok">✅ 발송 완료! 이메일을 확인해주세요 (스팸함도 확인 부탁드립니다)</div>',
      '</div>'
    ].join('');
    return wrap;
  }

  window.ctcLeadSubmit=function(){
    var name=document.getElementById('ctc-lf-name');
    var email=document.getElementById('ctc-lf-email');
    var agree=document.getElementById('ctc-lf-agree');
    var ok=document.getElementById('ctc-lf-ok');
    if(!name||!email||!agree||!ok) return;
    if(!name.value.trim()){name.style.borderColor='#e53935';name.focus();return;}
    var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email.value.trim())){email.style.borderColor='#e53935';email.focus();return;}
    if(!agree.checked){alert('[필수] 개인정보 수집·이용에 동의해주세요.');return;}
    // 실제 폼 전송 — Google Form 엔드포인트 또는 서버 교체 가능
    var data={name:name.value.trim(),email:email.value.trim(),page:window.location.pathname,ts:new Date().toISOString()};
    // console.log('Lead:', data);
    var btn=document.querySelector('.ctc-lead-btn');
    if(btn){btn.disabled=true;btn.textContent='처리 중...';}
    // 시뮬레이션 성공 (실제 서버 연동 시 fetch 교체)
    setTimeout(function(){
      if(btn){btn.style.display='none';}
      ok.style.display='block';
    },600);
  };

  function inject(){
    // 이미 리드폼 있으면 스킵
    if(document.querySelector('.lead-form-wrap,.ctc-lead-section,[id*="pdfForm"],[id*="leadForm"]')) return;
    // 도구 페이지(.top-bar 또는 .calc-card)가 있는 경우만
    if(!document.querySelector('.top-bar,.calc-card,.form-group')) return;

    injectCSS();
    var form=buildForm();
    if(!form) return;

    // 삽입 위치: footer 직전 OR body 맨 끝
    var footer=document.querySelector('footer,.main-footer,.top-bar-footer');
    if(footer && footer.parentNode){
      footer.parentNode.insertBefore(form, footer);
    } else {
      document.body.appendChild(form);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

// ⑩ 표준 Nav + Footer 자동 주입 (data-no-ctc-nav 속성 있으면 스킵)
(function(){
  'use strict';
  if(document.body.hasAttribute('data-no-ctc-nav')) return;

  var NAV_LINKS=[
    {href:'/',label:'← 홈'},
    {href:'/tools/',label:'💰 계산기'},
    {href:'/tools/market-index.html',label:'🌡️ 시장지수'},
    {href:'/blog/',label:'📰 블로그'},
    {href:'/tools/tax-calculator.html',label:'무료 계산 →',cta:true},
  ];
  var FOOTER_COLS=[
    {title:'₿ CryptoTax.cloud',brand:true,content:'한국 가상자산 투자자를 위한<br>무료 계산기·세금 가이드 허브.<br>국세청 기준 적용 · 무료 사용.'},
    {title:'계산기 도구',links:[
      {href:'/tools/tax-calculator.html',label:'코인 세금 계산기'},
      {href:'/tools/roi-calculator.html',label:'수익률 계산기'},
      {href:'/tools/staking-calculator.html',label:'스테이킹 이자 계산기'},
      {href:'/tools/multa-calculator.html',label:'물타기 계산기'},
      {href:'/tools/dca-calculator.html',label:'DCA 적립식 계산기'},
      {href:'/tools/satoshi-calculator.html',label:'사토시 환산기'},
    ]},
    {title:'시장 데이터',links:[
      {href:'/market/crypto-charts.html',label:'코인 히트맵·버블차트'},
      {href:'/market/bitcoin-rainbow-chart.html',label:'비트코인 레인보우 차트'},
      {href:'/tools/market-index.html',label:'시장지수 대시보드'},
    ]},
    {title:'블로그 · 문의',links:[
      {href:'/blog/',label:'블로그 홈'},
      {href:'/blog/coin-tax/2027-guide.html',label:'2027 세금 가이드'},
      {href:'/contact.html',label:'문의하기'},
      {href:'/about.html',label:'서비스 소개'},
    ]},
  ];
  var LEGAL=[
    {href:'/about.html',label:'사이트 소개'},
    {href:'/privacy-policy.html',label:'개인정보처리방침'},
    {href:'/terms.html',label:'이용약관'},
    {href:'/disclaimer.html',label:'면책조항'},
    {href:'/sitemap.html',label:'사이트맵'},
  ];

  function navHTML(){
    var links=NAV_LINKS.map(function(l){
      var cls=l.cta?' class="ctc-nav-cta"':'';
      return'<a href="'+l.href+'"'+cls+'>'+l.label+'</a>';
    }).join('');
    return'<div class="ctc-nav-inner">'+
      '<a class="ctc-nav-logo" href="/"><span class="ctc-nav-logo-icon"><img src="/assets/img/logo-icon.png" alt="CryptoTax 로고"></span>₿ CryptoTax<span>.cloud</span></a>'+
      '<div class="ctc-nav-right">'+
        '<div class="ctc-nav-links">'+links+'</div>'+
        '<button class="theme-toggle ctc-theme-icon-only theme-icon-only" id="themeToggle" onclick="toggleTheme()" aria-label="테마 전환">'+
          '<span id="themeIcon" class="theme-svg-wrap">'+
            '<svg id="sunSvg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="2.5" r="1.5"/><circle cx="12" cy="21.5" r="1.5"/><circle cx="2.5" cy="12" r="1.5"/><circle cx="21.5" cy="12" r="1.5"/><circle cx="5.39" cy="5.39" r="1.2"/><circle cx="18.61" cy="18.61" r="1.2"/><circle cx="5.39" cy="18.61" r="1.2"/><circle cx="18.61" cy="5.39" r="1.2"/></svg>'+
            '<svg id="moonSvg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'+
          '</span>'+
        '</button>'+
        '<button class="hamburger-btn" id="ctcHamburger" onclick="ctcToggleDrawer()" aria-label="메뉴 열기">'+
          '<span></span><span></span><span></span>'+
        '</button>'+
      '</div>'+
    '</div>';
  }

  function drawerHTML(){
    return '<div class="drawer-overlay" id="ctcDrawerOverlay" onclick="ctcCloseDrawer()"></div>'+
    '<div class="mobile-drawer" id="ctcMobileDrawer">'+
      '<div class="drawer-header">'+
        '<span class="drawer-logo">₿ CryptoTax<span>.cloud</span></span>'+
        '<button class="drawer-close" onclick="ctcCloseDrawer()">✕</button>'+
      '</div>'+
      '<div class="drawer-body">'+
        '<div class="drawer-section-title">🧮 세금 계산기</div>'+
        '<a class="drawer-item" href="/tools/tax-calculator.html" onclick="ctcCloseDrawer()"><span class="di-icon">💰</span><span class="di-label">코인 세금 계산기</span><span class="di-badge">무료</span></a>'+
        '<a class="drawer-item" href="/tools/roi-calculator.html" onclick="ctcCloseDrawer()"><span class="di-icon">📈</span><span class="di-label">수익률 계산기</span></a>'+
        '<a class="drawer-item" href="/tools/fee-calculator.html" onclick="ctcCloseDrawer()"><span class="di-icon">💸</span><span class="di-label">수수료 비교 계산기</span></a>'+
        '<a class="drawer-item" href="/tools/csv-tax-calculator.html" onclick="ctcCloseDrawer()"><span class="di-icon">📋</span><span class="di-label">거래내역 CSV 계산기</span></a>'+
        '<div class="drawer-divider"></div>'+
        '<div class="drawer-section-title">🧰 투자 도구</div>'+
        '<a class="drawer-item" href="/tools/" onclick="ctcCloseDrawer()"><span class="di-icon">🛠️</span><span class="di-label">전체 도구 보기</span><span class="di-badge">26종</span></a>'+
        '<a class="drawer-item" href="/tools/dca-calculator.html" onclick="ctcCloseDrawer()"><span class="di-icon">📅</span><span class="di-label">DCA 적립식 계산기</span></a>'+
        '<a class="drawer-item" href="/tools/multa-calculator.html" onclick="ctcCloseDrawer()"><span class="di-icon">📊</span><span class="di-label">물타기 계산기</span></a>'+
        '<a class="drawer-item" href="/tools/staking-calculator.html" onclick="ctcCloseDrawer()"><span class="di-icon">🏦</span><span class="di-label">스테이킹 이자 계산기</span></a>'+
        '<a class="drawer-item" href="/tools/김치프리미엄.html" onclick="ctcCloseDrawer()"><span class="di-icon">🌶️</span><span class="di-label">김치프리미엄 계산기</span></a>'+
        '<div class="drawer-divider"></div>'+
        '<div class="drawer-section-title">📊 시장 데이터</div>'+
        '<a class="drawer-item" href="/tools/market-index.html" onclick="ctcCloseDrawer()"><span class="di-icon">🌡️</span><span class="di-label">시장지수 대시보드</span><span class="di-badge">LIVE</span></a>'+
        '<a class="drawer-item" href="/market/crypto-charts.html" onclick="ctcCloseDrawer()"><span class="di-icon">💹</span><span class="di-label">실시간 코인 차트</span><span class="di-badge">LIVE</span></a>'+
        '<a class="drawer-item" href="/market/bitcoin-rainbow-chart.html" onclick="ctcCloseDrawer()"><span class="di-icon">🌈</span><span class="di-label">비트코인 레인보우 차트</span></a>'+
        '<div class="drawer-divider"></div>'+
        '<div class="drawer-section-title">📰 블로그</div>'+
        '<a class="drawer-item" href="/blog/" onclick="ctcCloseDrawer()"><span class="di-icon">📰</span><span class="di-label">전체 글 보기</span></a>'+
        '<a class="drawer-item" href="/blog/beginner-guide.html" onclick="ctcCloseDrawer()"><span class="di-icon">🔰</span><span class="di-label">코인 세금 입문 가이드</span></a>'+
        '<a class="drawer-item" href="/blog/coin-tax/2027-guide.html" onclick="ctcCloseDrawer()"><span class="di-icon">📅</span><span class="di-label">2027 세금 완벽 가이드</span><span class="di-badge">NEW</span></a>'+
        '<div class="drawer-divider"></div>'+
        '<div class="drawer-section-title">ℹ️ 사이트 정보</div>'+
        '<a class="drawer-item" href="/about.html" onclick="ctcCloseDrawer()"><span class="di-icon">👋</span><span class="di-label">서비스 소개</span></a>'+
        '<a class="drawer-item" href="/contact.html" onclick="ctcCloseDrawer()"><span class="di-icon">📬</span><span class="di-label">문의하기</span></a>'+
        '<div class="drawer-divider"></div>'+
        '<div class="drawer-theme-row">'+
          '<span class="drawer-theme-label"><span id="ctcDrawerThemeIcon">☀️</span> 테마 설정</span>'+
          '<button class="theme-toggle" onclick="toggleTheme()" aria-label="테마 전환" style="border:none;background:none;padding:0">'+
            '<div class="toggle-track"><div class="toggle-thumb"></div></div>'+
          '</button>'+
        '</div>'+
      '</div>'+
      '<div class="drawer-footer">'+
        '<a class="drawer-cta" href="/tools/tax-calculator.html" onclick="ctcCloseDrawer()">💰 무료 세금 계산하기</a>'+
      '</div>'+
    '</div>';
  }

  window.ctcOpenDrawer=function(){
    var d=document.getElementById('ctcMobileDrawer');
    var o=document.getElementById('ctcDrawerOverlay');
    var h=document.getElementById('ctcHamburger');
    if(d)d.classList.add('open');
    if(o)o.classList.add('open');
    if(h)h.classList.add('open');
    document.body.style.overflow='hidden';
  };
  window.ctcCloseDrawer=function(){
    var d=document.getElementById('ctcMobileDrawer');
    var o=document.getElementById('ctcDrawerOverlay');
    var h=document.getElementById('ctcHamburger');
    if(d)d.classList.remove('open');
    if(o)o.classList.remove('open');
    if(h)h.classList.remove('open');
    document.body.style.overflow='';
  };
  window.ctcToggleDrawer=function(){
    var d=document.getElementById('ctcMobileDrawer');
    d&&d.classList.contains('open')?ctcCloseDrawer():ctcOpenDrawer();
  };

  function footerHTML(){
    var cols=FOOTER_COLS.map(function(col){
      var inner=col.brand?'<p>'+col.content+'</p>':col.links.map(function(l){return'<a href="'+l.href+'">'+l.label+'</a>';}).join('');
      return'<div class="ctc-footer-col"><h4>'+col.title+'</h4>'+inner+'</div>';
    }).join('');
    var legal=LEGAL.map(function(l){return'<a href="'+l.href+'">'+l.label+'</a>';}).join('');
    return'<div class="ctc-footer-inner">'+
      '<div class="ctc-footer-grid">'+cols+'</div>'+
      '<div class="ctc-footer-bottom">'+
        '<div class="ctc-footer-legal">'+legal+'</div>'+
        '<div class="ctc-footer-copy">© 2026 CryptoTax.cloud — 계산 결과는 참고용이며 정확한 세금은 세무사 상담을 권장합니다.</div>'+
      '</div>'+
    '</div>';
  }

  function run(){
    var nav=document.querySelector('nav.main-nav')||document.querySelector('nav:not(.toc):not(.ctc-nav)');
    if(nav&&!nav.classList.contains('ctc-nav')){
      nav.className='ctc-nav';
      nav.innerHTML=navHTML();
      _applyThemeUI(localStorage.getItem('ctc-theme')||'dark');
    }
    var footer=document.querySelector('footer.main-footer')||document.querySelector('footer:not(.ctc-footer)');
    if(footer&&!footer.classList.contains('ctc-footer')){
      footer.className='ctc-footer';
      footer.innerHTML=footerHTML();
    }
    /* 드로어 주입 — 중복 방지 */
    if(!document.getElementById('ctcMobileDrawer')){
      var tmp=document.createElement('div');
      tmp.innerHTML=drawerHTML();
      while(tmp.firstChild){document.body.appendChild(tmp.firstChild);}
      _applyThemeUI(localStorage.getItem('ctc-theme')||'dark');
    }
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}else{run();}
})();
