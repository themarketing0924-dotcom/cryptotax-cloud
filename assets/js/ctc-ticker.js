/**
 * CryptoTax.cloud — 공통 코인 티커
 * 모든 tools/ 페이지에서 동작. .ticker-wrap 이미 있으면 교체, 없으면 주입.
 * 의존성 없음. CSS 변수는 각 도구 페이지 --bg2, --border, --text, --text2, --point 사용.
 */
(function(){
  'use strict';

  var COINS=[
    {sym:'BTCUSDT',  name:'비트코인',  short:'BTC'},
    {sym:'ETHUSDT',  name:'이더리움',  short:'ETH'},
    {sym:'XRPUSDT',  name:'리플',      short:'XRP'},
    {sym:'SOLUSDT',  name:'솔라나',    short:'SOL'},
    {sym:'ADAUSDT',  name:'에이다',    short:'ADA'},
    {sym:'DOGEUSDT', name:'도지코인',  short:'DOGE'},
    {sym:'AVAXUSDT', name:'아발란체',  short:'AVAX'},
    {sym:'LINKUSDT', name:'체인링크',  short:'LINK'},
    {sym:'DOTUSDT',  name:'폴카닷',    short:'DOT'},
    {sym:'MATICUSDT',name:'폴리곤',    short:'MATIC'}
  ];

  var CSS_ID = 'ctc-ticker-style';
  var WRAP_CLASS = 'ctc-tool-ticker-wrap';

  function injectCSS(){
    if(document.getElementById(CSS_ID)) return;
    var s = document.createElement('style');
    s.id = CSS_ID;
    s.textContent = [
      '.'+WRAP_CLASS+'{',
      '  background:var(--bg2,#161b22);',
      '  border-bottom:1px solid var(--border,#30363d);',
      '  overflow:hidden;',
      '  height:46px;',
      '  width:100%;',
      '  position:relative;',
      '}',
      '.ctc-tool-ticker-track{',
      '  display:flex;',
      '  align-items:center;',
      '  gap:0;',
      '  height:46px;',
      '  white-space:nowrap;',
      '  animation:ctcTickerScroll 35s linear infinite;',
      '  will-change:transform;',
      '}',
      '.'+WRAP_CLASS+':hover .ctc-tool-ticker-track{animation-play-state:paused;}',
      '@keyframes ctcTickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}',
      '.ctc-tool-ticker-item{',
      '  display:inline-flex;',
      '  align-items:center;',
      '  gap:5px;',
      '  padding:0 18px;',
      '  height:46px;',
      '  border-right:1px solid var(--border,#30363d);',
      '  font-size:13px;',
      '  font-weight:500;',
      '  flex-shrink:0;',
      '  cursor:default;',
      '}',
      '.ctc-tool-ticker-item .t-short{color:var(--text2,#8b949e);font-weight:700;font-size:12px;}',
      '.ctc-tool-ticker-item .t-price{color:var(--text,#e6edf3);font-weight:700;font-variant-numeric:tabular-nums;}',
      '.ctc-tool-ticker-item .t-chg{font-size:12px;}',
      '.ctc-tool-ticker-item .t-up{color:#16c784;}',
      '.ctc-tool-ticker-item .t-down{color:#ea3943;}',
      '.ctc-tool-ticker-item .t-neu{color:var(--text2,#8b949e);}',
      '[data-theme="light"] .'+WRAP_CLASS+'{background:#f0f3f6;}',
      '[data-theme="light"] .ctc-tool-ticker-item{border-right-color:#d0d7de;}',
      '[data-theme="light"] .ctc-tool-ticker-item .t-price{color:#1a1f2e;}',
      '[data-theme="light"] .ctc-tool-ticker-item .t-short{color:#57606a;}',
      /* 구형 TradingView 티커 및 ticker-wrap 강제 숨김 */
      '.ticker-wrap{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;}',
      '#tv-ticker{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;}',
      '[id*="tv-ticker"]{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function buildItems(data){
    var map={};
    data.forEach(function(d){map[d.symbol]=d;});
    return COINS.map(function(c){
      var d=map[c.sym];
      if(!d) return '';
      var chg=parseFloat(d.priceChangePercent);
      var cls=chg>0?'t-up':chg<0?'t-down':'t-neu';
      var sign=chg>0?'+':'';
      var price=parseFloat(d.lastPrice);
      var priceStr = price>=1000
        ? price.toLocaleString('ko-KR',{maximumFractionDigits:0})
        : price>=1
          ? price.toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:4})
          : price.toFixed(5);
      return '<span class="ctc-tool-ticker-item">'
        +'<span class="t-short">'+c.short+'</span>'
        +'<span class="t-price">$'+priceStr+'</span>'
        +'<span class="t-chg '+cls+'">'+sign+chg.toFixed(2)+'%</span>'
        +'</span>';
    }).join('');
  }

  function render(data){
    var track=document.querySelector('.ctc-tool-ticker-track');
    if(!track) return;
    var items=buildItems(data);
    track.innerHTML=items+items;
  }

  function fetchPrices(){
    var url='https://api.binance.com/api/v3/ticker/24hr?symbols=['
      +COINS.map(function(c){return '%22'+c.sym+'%22';}).join(',')
      +']';
    fetch(url)
      .then(function(r){return r.json();})
      .then(function(data){render(data);})
      .catch(function(){});
  }

  function buildWrap(){
    var loading=COINS.map(function(c){
      return '<span class="ctc-tool-ticker-item">'
        +'<span class="t-short">'+c.short+'</span>'
        +'<span class="t-price">$—</span>'
        +'<span class="t-chg t-neu">—</span>'
        +'</span>';
    }).join('');
    var div=document.createElement('div');
    div.className=WRAP_CLASS;
    div.innerHTML='<div class="ctc-tool-ticker-track">'+loading+loading+'</div>';
    return div;
  }

  function removeLegacyTickers(){
    // 구형 common.js 티커 제거
    var old=document.getElementById('ctc-ticker');
    if(old && old.parentNode) old.parentNode.removeChild(old);

    // 1) <script src="...ticker-tape.js"> 를 찾아 가장 가까운 ticker/tradingview 래퍼 제거
    document.querySelectorAll('script[src*="ticker-tape"],script[src*="ticker_tape"]').forEach(function(s){
      try{
        // 부모 체인 중 ticker 또는 tradingview 래퍼 찾아 제거
        var p=s.parentNode;
        while(p && p!==document.body){
          var id=p.id||'';
          var cls=(typeof p.className==='string')?p.className:'';
          if(id.indexOf('ticker')!==-1
            ||cls.indexOf('ticker-wrap')!==-1
            ||cls.indexOf('ticker-tape')!==-1
            ||cls.indexOf('tradingview-widget-container')!==-1){
            if(p.parentNode) p.parentNode.removeChild(p);
            return;
          }
          p=p.parentNode;
        }
        // 래퍼 못 찾으면 스크립트의 부모 div를 조부모에서 제거 (부모에서 자기자신 제거 X)
        var par=s.parentNode;
        if(par && par!==document.body && par.parentNode){
          par.parentNode.removeChild(par);
        }
      }catch(e){}
    });

    // 2) 남은 .ticker-wrap 제거
    document.querySelectorAll('.ticker-wrap').forEach(function(el){
      if(el.parentNode) el.parentNode.removeChild(el);
    });

    // 3) id에 ticker가 포함된 div 중 TradingView 내용 포함 제거
    document.querySelectorAll('[id*="ticker"]').forEach(function(el){
      if(el.innerHTML.indexOf('tradingview')!==-1 || el.innerHTML.indexOf('ticker-tape')!==-1){
        if(el.parentNode) el.parentNode.removeChild(el);
      }
    });
  }

  function watchAndRemoveTradingView(){
    if(!window.MutationObserver) return;
    var obs=new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes.forEach(function(n){
          if(!n.tagName || n.nodeType!==1) return;
          var id=n.id||'';
          var cls=(typeof n.className==='string')?n.className:'';
          // 우리 자신의 티커 클래스는 제거하지 않음
          if(cls.indexOf('ctc-')!==-1) return;
          // TradingView ticker 래퍼 또는 .ticker-wrap 제거 (exact match 또는 id)
          var isLegacy=(id.indexOf('ticker')!==-1&&id.indexOf('ctc-')===-1)
            ||(cls==='ticker-wrap'||(/(?:^| )ticker-wrap(?: |$)/).test(cls));
          if(isLegacy){
            if(n.parentNode) n.parentNode.removeChild(n);
            return;
          }
          // TradingView iframe (ticker-tape) 제거
          if(n.tagName==='IFRAME'){
            var src=n.src||n.getAttribute('src')||'';
            if(src.indexOf('tradingview')!==-1&&(src.indexOf('ticker')!==-1||src.indexOf('tape')!==-1)){
              if(n.parentNode) n.parentNode.removeChild(n);
            }
          }
          // tradingview-widget-container 내 iframe 확인
          if(cls.indexOf('tradingview-widget-container')!==-1){
            var iframes=n.querySelectorAll('iframe');
            iframes.forEach(function(f){
              var fsrc=f.src||f.getAttribute('src')||'';
              if(fsrc.indexOf('tradingview')!==-1) { if(f.parentNode) f.parentNode.removeChild(f); }
            });
            if(n.parentNode) n.parentNode.removeChild(n);
          }
        });
      });
    });
    obs.observe(document.body,{childList:true,subtree:true});
    setTimeout(function(){ obs.disconnect(); },6000);
  }

  function init(){
    injectCSS();
    removeLegacyTickers();

    var existingWrap=document.querySelector('.'+WRAP_CLASS);
    if(!existingWrap){
      var newWrap=buildWrap();
      // nav 다음에 삽입 (가장 안정적)
      var navEl=document.querySelector('nav.main-nav')
        || document.querySelector('nav')
        || document.querySelector('.top-bar')
        || document.querySelector('header');
      if(navEl && navEl.parentNode){
        navEl.parentNode.insertBefore(newWrap, navEl.nextSibling);
      } else {
        // nav 없으면 첫 번째 섹션/컨테이너 앞에 삽입
        var insertBefore=document.querySelector('.urgent-banner')
          || document.querySelector('section')
          || document.querySelector('main')
          || document.querySelector('.container');
        if(insertBefore && insertBefore.parentNode){
          insertBefore.parentNode.insertBefore(newWrap, insertBefore);
        } else {
          document.body.insertBefore(newWrap, document.body.firstChild);
        }
      }
    } else {
      // HTML에 이미 있을 경우 로딩 플레이스홀더 주입
      var existingTrack=existingWrap.querySelector('.ctc-tool-ticker-track');
      if(existingTrack && !existingTrack.innerHTML.trim()){
        var loading2=COINS.map(function(c){
          return '<span class="ctc-tool-ticker-item">'
            +'<span class="t-short">'+c.short+'</span>'
            +'<span class="t-price">$—</span>'
            +'<span class="t-chg t-neu">—</span>'
            +'</span>';
        }).join('');
        existingTrack.innerHTML=loading2+loading2;
      }
    }

    // TradingView async 스크립트가 나중에 로드될 경우 감시·제거
    watchAndRemoveTradingView();

    fetchPrices();
    setInterval(fetchPrices,30000);
  }

  // body 끝에 위치할 경우 즉시 실행, 그 외는 DOMContentLoaded 후 실행
  if(document.body){
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
