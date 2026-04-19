// ============================================================
// CryptoTax.cloud — 공통 JavaScript
// ============================================================

// ① 테마 초기화 (FOUC 방지)
(function(){
  var t=localStorage.getItem('ctc-theme')||'dark';
  document.documentElement.setAttribute('data-theme',t);
  window.addEventListener('DOMContentLoaded',function(){ _applyThemeUI(t); });
})();

// 테마 UI 요소 업데이트 (모든 페이지 버튼 패턴 통합)
function _applyThemeUI(theme){
  var isLight=theme==='light';
  // 공통 버튼 (themeBtn)
  var btn=document.getElementById('themeBtn');
  if(btn)btn.textContent=isLight?'🌙 다크':'☀️ 라이트';
  // tax-calculator 스타일 (themeIcon + themeLabel)
  var icon=document.getElementById('themeIcon');
  var label=document.getElementById('themeLabel');
  if(icon)icon.textContent=isLight?'🌙':'☀️';
  if(label)label.textContent=isLight?'다크':'라이트';
  // 토글 트랙 클래스
  var track=document.querySelector('.toggle-track');
  if(track){track.classList.toggle('active',isLight);}
}

// ② 테마 토글 (전역 — 이미 페이지에 정의된 경우 UI 보완 래퍼로 덮어씀)
(function(){
  var _orig = window.toggleTheme; // 페이지별 기존 함수 백업
  window.toggleTheme = function(){
    var next = document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ctc-theme', next);
    _applyThemeUI(next);
    // 페이지별 고유 로직 실행 (차트 리드로우 등)
    if(typeof _orig === 'function' && _orig !== window.toggleTheme){
      try{ _orig(); }catch(e){}
    }
  };
})();

// ③ 스크롤 애니메이션
var _obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.1});
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.fade-up').forEach(function(el){_obs.observe(el);});
});

// ④ 숫자 포맷터
var fmt=function(n){return Math.round(n).toLocaleString('ko-KR');};
var fmtD=function(n,d){return Number(n).toFixed(d===undefined?2:d);};

// ⑤ 하단 관련 계산기 네비게이션 (5초 후 표시)
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
