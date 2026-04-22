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
    if(typeof _orig === 'function' && _orig !== window.toggleTheme){
      try{ _orig(); }catch(e){}
    }
  };
})();

// ③ 스크롤 애니메이션 — Toss 스타일 (fade-up / fade-left / fade-right / fade-in / zoom-in)
(function(){
  var ANIM_CLASSES = ['.fade-up','.fade-left','.fade-right','.fade-in','.zoom-in'];
  function initScrollAnim(){
    var selector = ANIM_CLASSES.join(',');
    var elements = document.querySelectorAll(selector);
    if(!elements.length) return;
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -32px 0px'});
    elements.forEach(function(el){ obs.observe(el); });
  }
  document.addEventListener('DOMContentLoaded', initScrollAnim);
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
    if(document.querySelector('.ticker-wrap, [data-no-ticker]')) return;
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
