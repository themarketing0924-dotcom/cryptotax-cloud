// ============================================================
// CryptoTax.cloud — 공통 JavaScript
// ============================================================

// ① 테마 초기화 (FOUC 방지 — <head>에서 인라인 실행 권장)
(function(){
  var t=localStorage.getItem('ctc-theme')||'dark';
  document.documentElement.setAttribute('data-theme',t);
  window.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('themeBtn');
    if(btn)btn.textContent=t==='light'?'🌙 다크':'☀️ 라이트';
  });
})();

// ② 테마 토글
function toggleTheme(){
  var next=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('ctc-theme',next);
  var btn=document.getElementById('themeBtn');
  if(btn)btn.textContent=next==='light'?'🌙 다크':'☀️ 라이트';
}

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
