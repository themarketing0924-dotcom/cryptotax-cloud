/**
 * CryptoTax.cloud — TradingView 티커테이프
 * 모든 pages에서 nav 바로 아래 TradingView 실시간 티커를 주입.
 * 테마 변경(themeChange 이벤트) 시 자동 재빌드.
 */
(function(){
  'use strict';

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
    var t = document.documentElement.getAttribute('data-theme');
    if(!t) t = localStorage.getItem('ctc-theme');
    return t === 'light' ? 'light' : 'dark';
  }

  function removeOldTickers(){
    /* 구형 Binance 커스텀 티커 제거 */
    ['ctc-ticker','ctc-ticker-track'].forEach(function(id){
      var el = document.getElementById(id);
      if(el && el.parentNode) el.parentNode.removeChild(el);
    });
    document.querySelectorAll('.ctc-tool-ticker-wrap,.ticker-wrap').forEach(function(el){
      if(el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function buildWidget(theme){
    /* 기존 TV 티커가 있으면 제거 후 재생성 */
    var old = document.getElementById(WRAP_ID);
    if(old && old.parentNode) old.parentNode.removeChild(old);

    var wrap = document.createElement('div');
    wrap.id = WRAP_ID;
    wrap.className = 'tradingview-widget-container';
    wrap.style.cssText = 'width:100%;height:56px;max-height:56px;line-height:0;overflow:hidden;';

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
      colorTheme: theme
    });
    wrap.appendChild(script);

    /* nav 바로 다음에 삽입 */
    var nav = document.querySelector('nav.main-nav')
           || document.querySelector('nav')
           || document.querySelector('header');
    if(nav && nav.parentNode){
      nav.parentNode.insertBefore(wrap, nav.nextSibling);
    } else {
      document.body.insertBefore(wrap, document.body.firstChild);
    }
  }

  function init(){
    removeOldTickers();
    buildWidget(getTheme());

    /* 테마 토글 시 재빌드 */
    document.addEventListener('themeChange', function(e){
      buildWidget(e.detail || getTheme());
    });
  }

  if(document.body){ init(); }
  else { document.addEventListener('DOMContentLoaded', init); }
})();
