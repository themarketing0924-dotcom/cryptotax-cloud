// ============================================================
// CryptoTax.cloud — 공통 JavaScript
// ============================================================

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
  var icon=document.getElementById('themeIcon');
  var label=document.getElementById('themeLabel');
  if(icon)icon.textContent=isLight?'🌙':'☀️';
  if(label)label.textContent=isLight?'다크':'라이트';
  var track=document.querySelector('.toggle-track');
  if(track){track.classList.toggle('active',isLight);}
}

// ② 테마 토글
(function(){
  var _orig = window.toggleTheme;
  window.toggleTheme = function(){
    var next = document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ctc-theme', next);
    _applyThemeUI(next);
    // 히트맵 등 테마 감지 위젯에 알림
    try{ document.dispatchEvent(new CustomEvent('themeChange',{detail:next})); }catch(e){}
    if(typeof _orig === 'function' && _orig !== window.toggleTheme){
      try{ _orig(); }catch(e){}
    }
  };
})();

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

// ④ 코인 티커 자동 주입 (nav 바로 아래)
(function(){
  var TICKER_COINS = [
    {s:'BTC', n:'비트코인',  icon:'₿',  ex:['U','B']},
    {s:'ETH', n:'이더리움',  icon:'Ξ',  ex:['U','B']},
    {s:'XRP', n:'리플',      icon:'✕',  ex:['U','B']},
    {s:'SOL', n:'솔라나',    icon:'◎',  ex:['U','B']},
    {s:'ADA', n:'에이다',    icon:'₳',  ex:['U','B']},
    {s:'AVAX',n:'아발란체',  icon:'△',  ex:['U','B']},
    {s:'DOT', n:'폴카닷',    icon:'●',  ex:['U','B']},
    {s:'MATIC',n:'폴리곤',   icon:'⬟',  ex:['U','B']},
    {s:'LINK',n:'체인링크',  icon:'⬡',  ex:['U','B']},
    {s:'DOGE',n:'도지코인',  icon:'Ð',  ex:['U','B']},
    {s:'ATOM',n:'코스모스',  icon:'⚛',  ex:['U','B']},
    {s:'NEAR',n:'니어',      icon:'N',  ex:['U','B']},
    {s:'UNI', n:'유니스왑',  icon:'🦄', ex:['U','B']},
    {s:'LTC', n:'라이트코인',icon:'Ł',  ex:['U','B']},
    {s:'SHIB',n:'시바이누',  icon:'🐶', ex:['U','B']},
    {s:'APT', n:'앱토스',    icon:'A',  ex:['U','B']},
    {s:'SUI', n:'수이',      icon:'S',  ex:['U','B']},
    {s:'ARB', n:'아비트럼',  icon:'Ⓐ',  ex:['U','B']},
    {s:'OP',  n:'옵티미즘',  icon:'Ⓞ',  ex:['U','B']},
    {s:'INJ', n:'인젝티브',  icon:'I',  ex:['U','B']},
    {s:'TIA', n:'셀레스티아',icon:'T',  ex:['U','B']},
    {s:'TON', n:'톤코인',    icon:'◈',  ex:['U','B']},
    {s:'PEPE',n:'페페',      icon:'🐸', ex:['U','B']},
    {s:'WEMIX',n:'위믹스',   icon:'W',  ex:['U','B']},
    {s:'BORA',n:'보라',      icon:'B',  ex:['U','B']},
  ];

  function makeBadges(ex){
    return ex.map(function(e){
      return '<span class="ex-badge ex-'+(e==='U'?'upbit':'bithumb')+'">'+(e==='U'?'U':'B')+'</span>';
    }).join('');
  }

  function buildTicker(){
    if(document.getElementById('ctc-ticker')) return;
    // 이미 자체 가격 티커바가 있는 페이지는 건너뜀
    if(document.querySelector('.ticker-wrap, .ctc-tool-ticker-wrap, [data-no-ticker]')) return;
    var items = TICKER_COINS.concat(TICKER_COINS).map(function(c){
      return '<div class="ticker-item">'
        +'<span class="ticker-icon">'+c.icon+'</span>'
        +'<span class="ticker-sym">'+c.s+'</span>'
        +'<span class="ticker-name">'+c.n+'</span>'
        +'<span class="ticker-ex">'+makeBadges(c.ex)+'</span>'
        +'</div>';
    }).join('');

    var bar = document.createElement('div');
    bar.id = 'ctc-ticker';
    bar.innerHTML = '<div class="ticker-track">'+items+'</div>';

    // nav 뒤에 삽입 (nav, header, .main-nav 모두 지원)
    var nav = document.querySelector('nav') ||
              document.querySelector('header') ||
              document.querySelector('.main-nav');
    if(nav && nav.parentNode){
      nav.parentNode.insertBefore(bar, nav.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  document.addEventListener('DOMContentLoaded', buildTicker);
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

// ⑦ 하단 관련 계산기 네비게이션 (5초 후 표시)
var RELATED={
  'tax-calculator':     [{e:'💧',t:'물타기',u:'/tools/multa-calculator.html'},{e:'✂️',t:'절세 하베스팅',u:'/tools/tax-loss-harvesting.html'},{e:'📁',t:'CSV 세금',u:'/tools/csv-tax-calculator.html'},{e:'📈',t:'DCA',u:'/tools/dca-calculator.html'}],
  'dca-calculator':     [{e:'💰',t:'세금 계산',u:'/tools/tax-calculator.html'},{e:'💧',t:'물타기',u:'/tools/multa-calculator.html'},{e:'📊',t:'수익률',u:'/tools/roi-calculator.html'},{e:'⚡',t:'스테이킹',u:'/tools/staking-calculator.html'}],
  'multa-calculator':   [{e:'💰',t:'세금 계산',u:'/tools/tax-calculator.html'},{e:'📈',t:'DCA',u:'/tools/dca-calculator.html'},{e:'📊',t:'수익률',u:'/tools/roi-calculator.html'},{e:'✂️',t:'절세',u:'/tools/tax-loss-harvesting.html'}],
  'kimchi-calculator':  [{e:'💰',t:'세금 계산',u:'/tools/tax-calculator.html'},{e:'📊',t:'수익률',u:'/tools/roi-calculator.html'},{e:'📈',t:'DCA',u:'/tools/dca-calculator.html'},{e:'🏦',t:'거래소비교',u:'/tools/exchange-compare.html'}],
  'csv-tax-calculator': [{e:'💰',t:'세금 계산',u:'/tools/tax-calculator.html'},{e:'✂️',t:'절세',u:'/tools/tax-loss-harvesting.html'},{e:'📈',t:'DCA',u:'/tools/dca-calculator.html'},{e:'💧',t:'물타기',u:'/tools/multa-calculator.html'}],
  'tax-loss-harvesting':[{e:'💰',t:'세금 계산',u:'/tools/tax-calculator.html'},{e:'📁',t:'CSV 세금',u:'/tools/csv-tax-calculator.html'},{e:'📈',t:'DCA',u:'/tools/dca-calculator.html'},{e:'📊',t:'수익률',u:'/tools/roi-calculator.html'}],
  'roi-calculator':     [{e:'💰',t:'세금 계산',u:'/tools/tax-calculator.html'},{e:'📈',t:'DCA',u:'/tools/dca-calculator.html'},{e:'🔧',t:'수수료',u:'/tools/fee-calculator.html'},{e:'🎯',t:'목표가',u:'/tools/target-price-calculator.html'}],
  'staking-calculator': [{e:'💰',t:'세금 계산',u:'/tools/tax-calculator.html'},{e:'📊',t:'수익률',u:'/tools/roi-calculator.html'},{e:'📈',t:'DCA',u:'/tools/dca-calculator.html'},{e:'💧',t:'물타기',u:'/tools/multa-calculator.html'}],
};
function initStickyNav(){
  var path=window.location.pathname;
  var key=Object.keys(RELATED).find(function(k){return path.includes(k);});
  var links=RELATED[key]||RELATED['tax-calculator'];
  var nav=document.createElement('div');
  nav.id='sticky-calc-nav';
  nav.innerHTML='<span style="font-size:11px;color:var(--muted);white-space:nowrap">🧰 관련:</span>'
    +links.map(function(l){return '<a href="'+l.u+'" class="sticky-link">'+l.e+' '+l.t+'</a>';}).join('')
    +'<button onclick="this.parentElement.style.bottom=\'-80px\'" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:0 4px">×</button>';
  document.body.appendChild(nav);
  setTimeout(function(){nav.style.bottom='0';},5000);
}
document.addEventListener('DOMContentLoaded',initStickyNav);

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
