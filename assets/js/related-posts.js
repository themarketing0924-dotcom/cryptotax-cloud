/**
 * CryptoTax.cloud — 연관 블로그 추천 (하단 3개 카드)
 * 각 블로그 페이지 </article> 뒤에 <div id="ctc-related"></div> 삽입 후
 * 이 스크립트를 로드하면 자동으로 같은 카테고리 우선 3개 카드 렌더링.
 */
(function(){
'use strict';

var POSTS = [
  /* ── 코인세금 ── */
  {url:'/blog/coin-tax/2027-guide.html',      cat:'coin-tax', icon:'📋',
   title:'2027 코인 세금 완전정복',
   desc:'22% 세율·250만원 공제부터 홈택스 신고까지 한 번에 정리'},
  {url:'/blog/coin-tax/22-percent-tax.html',  cat:'coin-tax', icon:'🔢',
   title:'코인 세금 22% 계산법',
   desc:'소득세 20% + 지방소득세 2%, 실제 납부액 계산 완전 해설'},
  {url:'/blog/coin-tax/250man-exemption.html',cat:'coin-tax', icon:'🎯',
   title:'250만원 기본공제 완전 이해',
   desc:'연간 250만원 이하는 비과세, 조건·활용법·주의사항 총정리'},
  {url:'/blog/coin-tax/altcoin-tax-guide.html',cat:'coin-tax',icon:'🪙',
   title:'알트코인 세금 2027 가이드',
   desc:'솔라나·도지·에이다·아발란체 세금 계산법 완전 정리'},
  {url:'/blog/coin-tax/bitcoin-sell-tax.html',cat:'coin-tax', icon:'₿',
   title:'비트코인 매도 세금 2027',
   desc:'얼마 팔면 세금 내야 하나? 손익 계산부터 납부까지'},
  {url:'/blog/coin-tax/bithumb-tax-guide.html',cat:'coin-tax',icon:'🏦',
   title:'빗썸 코인 세금 신고 가이드',
   desc:'빗썸 거래내역 조회·다운로드·세금 신고 단계별 완전 가이드'},
  {url:'/blog/coin-tax/ethereum-tax.html',    cat:'coin-tax', icon:'Ξ',
   title:'이더리움 세금 2027 가이드',
   desc:'매도·스왑·스테이킹 과세 기준과 절세 전략 완전 정리'},
  {url:'/blog/coin-tax/family-account-tax.html',cat:'coin-tax',icon:'👨‍👩‍👧',
   title:'가족 계좌 코인 세금 문제',
   desc:'배우자·자녀 명의 코인 과세와 증여세 위험 완전 정리'},
  {url:'/blog/coin-tax/gift-tax.html',        cat:'coin-tax', icon:'🎁',
   title:'코인 증여세 완전 이해',
   desc:'가족에게 코인 이전 시 증여세 계산·신고 방법'},
  {url:'/blog/coin-tax/hometax-guide.html',   cat:'coin-tax', icon:'🖥️',
   title:'홈택스 코인 세금 신고 방법',
   desc:'2027년 홈택스 가상자산 세금 신고 단계별 스크린샷 가이드'},
  {url:'/blog/coin-tax/loss-tax-refund.html', cat:'coin-tax', icon:'✂️',
   title:'손실 코인 절세 전략',
   desc:'Tax-Loss Harvesting으로 세금 합법적으로 줄이는 방법'},
  {url:'/blog/coin-tax/moving-average-cost.html',cat:'coin-tax',icon:'📐',
   title:'이동평균법 취득원가 계산',
   desc:'국세청 인정 방법으로 정확한 취득원가 산출하는 법'},
  {url:'/blog/coin-tax/nft-tax.html',         cat:'coin-tax', icon:'🖼️',
   title:'NFT 세금 완전 이해',
   desc:'NFT 판매·구매·에어드랍 세금 처리 방법과 신고 기준'},
  {url:'/blog/coin-tax/no-report-penalty.html',cat:'coin-tax',icon:'⚠️',
   title:'코인 세금 미신고 불이익',
   desc:'가산세·세무조사·과태료까지 미신고 시 발생하는 모든 불이익'},
  {url:'/blog/coin-tax/overseas-exchange-tax.html',cat:'coin-tax',icon:'🌐',
   title:'해외 거래소 코인 세금 신고',
   desc:'바이낸스·OKX 해외 거래소 신고 의무와 절차 완전 가이드'},
  {url:'/blog/coin-tax/staking-tax.html',     cat:'coin-tax', icon:'🏆',
   title:'스테이킹 수익 세금 완전 이해',
   desc:'스테이킹 보상 과세 시점·계산법·신고 방법 총정리'},
  {url:'/blog/coin-tax/upbit-tax-guide.html', cat:'coin-tax', icon:'🔴',
   title:'업비트 코인 세금 신고 가이드',
   desc:'거래 내역 다운로드부터 납부까지 2027년 완전 정리'},
  {url:'/blog/coin-tax/xrp-tax.html',         cat:'coin-tax', icon:'💧',
   title:'리플(XRP) 세금 신고 2027',
   desc:'XRP 매도·에어드랍·스테이킹 세금 계산법·절세 전략'},
  {url:'/blog/coin-tax/year-end-tax-checklist.html',cat:'coin-tax',icon:'📅',
   title:'코인 세금 연말 절세 체크리스트',
   desc:'12월 전 반드시 해야 할 절세 5가지 완전 정리'},
  {url:'/blog/coin-tax/corporation-tax.html', cat:'coin-tax', icon:'🏢',
   title:'법인 코인 투자 세금',
   desc:'법인명의 코인 투자 시 세금 처리·회계 처리 방법'},

  /* ── 가이드 ── */
  {url:'/blog/guide/beginner-guide.html',     cat:'guide', icon:'🌱',
   title:'코린이 코인 투자 입문',
   desc:'처음 코인 시작하는 분을 위한 업비트 가입부터 첫 매수까지'},
  {url:'/blog/guide/coin-terms.html',         cat:'guide', icon:'📖',
   title:'코린이 필수 용어 50선',
   desc:'마켓캡·펌프·도미넌스 등 꼭 알아야 할 코인 용어 총정리'},
  {url:'/blog/guide/dca-intro.html',          cat:'guide', icon:'📈',
   title:'DCA란 무엇인가?',
   desc:'적립식 매수(DCA) 전략의 원리와 비트코인 수익 시뮬레이션'},
  {url:'/blog/guide/exchange-fee-compare.html',cat:'guide',icon:'💱',
   title:'거래소 수수료 비교',
   desc:'업비트·빗썸·바이낸스·코인원 수수료 한눈에 비교'},
  {url:'/blog/guide/kimchi-premium-intro.html',cat:'guide',icon:'🌶️',
   title:'김치 프리미엄이란?',
   desc:'한국 코인 가격이 해외보다 비싼 이유와 활용 방법'},
  {url:'/blog/guide/satoshi-unit.html',       cat:'guide', icon:'₿',
   title:'사토시 단위 완전 이해',
   desc:'비트코인 최소단위 사토시 계산법과 원화 환산 방법'},
  {url:'/blog/guide/tax-timeline.html',       cat:'guide', icon:'🗓️',
   title:'2027 코인 세금 일정표',
   desc:'신고 기간·납부 기한·준비 체크리스트 월별 완전 정리'},
  {url:'/blog/guide/upbit-csv-download.html', cat:'guide', icon:'📥',
   title:'업비트 CSV 다운로드 방법',
   desc:'세금 신고용 거래내역 파일 PC·모바일 단계별 완전 가이드'},
  {url:'/blog/guide/upbit-signup.html',       cat:'guide', icon:'🔐',
   title:'업비트 회원가입 방법',
   desc:'본인인증·은행 연동·첫 입금까지 10분 완성 가이드'},
  {url:'/blog/guide/wallet-guide.html',       cat:'guide', icon:'👛',
   title:'코인 지갑 완전 가이드',
   desc:'하드·소프트·메타마스크 지갑 종류별 사용법과 보안 팁'},

  /* ── 루트 블로그 ── */
  {url:'/blog/bitcoin-dca-10years.html',      cat:'root', icon:'📊',
   title:'비트코인 10년 DCA 수익',
   desc:'매달 10만원씩 사면 10년 뒤 얼마? 적립식 시뮬레이션'},
  {url:'/blog/coin-multa-average-price.html', cat:'root', icon:'💧',
   title:'코인 물타기 평균단가 계산',
   desc:'손실 구간에서 물타기 시 평균단가 변화 완벽 정리'},
  {url:'/blog/binance-trade-history.html',    cat:'root', icon:'🌐',
   title:'바이낸스 거래내역 다운로드',
   desc:'세금 신고용 Trade History 3년치 한 번에 받는 방법'},
  {url:'/blog/coinone-tax-guide.html',        cat:'root', icon:'🏦',
   title:'코인원 세금 신고 가이드',
   desc:'거래내역 조회·CSV 다운로드·홈택스 신고 단계별 정리'},
  {url:'/blog/coin-tax-2027-guide.html',      cat:'root', icon:'💰',
   title:'코인 세금 2027년 완벽 가이드',
   desc:'얼마부터 내야 하나? 22% 계산법과 절세 전략 총정리'},
  {url:'/blog/upbit-csv-download-guide-2027.html',cat:'root',icon:'📥',
   title:'업비트 CSV 다운로드 2027',
   desc:'2027 세금신고 전 필수 거래내역 파일 준비 방법'},
  {url:'/blog/solana-staking-tax.html',        cat:'root', icon:'🌟',
   title:'솔라나 스테이킹 세금 신고',
   desc:'SOL 연 6% 보상 과세 계산법과 신고 방법 완벽 가이드'},
  {url:'/blog/una-loss-deduction.html',        cat:'root', icon:'🌙',
   title:'루나(LUNA) 손실 세금 공제',
   desc:'2027년 이월공제 불가·손익통산만 가능한 루나 손실 처리법'},
  {url:'/blog/metamask-tax-guide.html',        cat:'root', icon:'🦊',
   title:'메타마스크 세금 신고 방법',
   desc:'DeFi 지갑 거래 추적과 세금 신고 단계별 가이드'},
  {url:'/blog/coin-tax-calculation-5-steps.html',cat:'root',icon:'5️⃣',
   title:'코인 세금 계산 방법 5단계',
   desc:'매수·매도·수수료 기준으로 정확한 세금 계산하는 법'},
  {url:'/blog/upbit-csv-download-guide.html',  cat:'root', icon:'📥',
   title:'업비트 거래내역 CSV 다운로드',
   desc:'PC·모바일 단계별 스크린샷으로 쉽게 따라하는 방법'},
  {url:'/blog/ripple-lawsuit-tax.html',       cat:'root', icon:'⚖️',
   title:'리플 SEC 소송 후 세금 신고',
   desc:'XRP 급등 수익 22% 과세 계산법과 절세 전략'},
  {url:'/blog/김치프리미엄-1000만원-차익-세금-신고.html',cat:'root',icon:'🌶️',
   title:'김치프리미엄 1000만원 세금 신고',
   desc:'김프 차익 1000만원 발생 시 세금 신고 완벽 가이드'},
  {url:'/blog/virtual-asset-tax-2027-guide.html',cat:'root',icon:'🏛️',
   title:'가상자산 세금 2027 완벽 가이드',
   desc:'22% 계산·250만원 공제·홈택스 신고 한 번에 해결'}
];

/* ── CSS 주입 ── */
function injectCSS(){
  if(document.getElementById('ctc-related-style')) return;
  var s = document.createElement('style');
  s.id = 'ctc-related-style';
  s.textContent = [
    '.ctc-related{max-width:860px;margin:56px auto 16px;padding:0 20px;}',
    '.ctc-related-title{font-size:1.15rem;font-weight:800;color:var(--text-primary,#e6edf3);',
    '  margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid var(--orange,#f97316);',
    '  display:inline-block;}',
    '.ctc-related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}',
    '@media(max-width:700px){.ctc-related-grid{grid-template-columns:1fr;}}',
    '.ctc-related-card{background:var(--bg-surface,#161b22);border:1px solid var(--border-default,#30363d);',
    '  border-radius:12px;overflow:hidden;display:flex;flex-direction:column;',
    '  transition:transform .18s,box-shadow .18s;text-decoration:none;}',
    '.ctc-related-card:hover{transform:translateY(-4px);box-shadow:0 8px 28px rgba(0,0,0,.35);}',
    '.ctc-related-card-top{background:linear-gradient(135deg,#1e2a1e,#0d1117);',
    '  padding:22px 20px 14px;border-bottom:1px solid var(--border-default,#30363d);}',
    '.ctc-related-card-icon{font-size:2rem;line-height:1;margin-bottom:8px;display:block;}',
    '.ctc-related-card-cat{font-size:0.68rem;font-weight:700;color:var(--orange,#f97316);',
    '  text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}',
    '.ctc-related-card-title{font-size:0.92rem;font-weight:800;',
    '  color:var(--text-primary,#e6edf3);line-height:1.4;margin:0;}',
    '.ctc-related-card-body{padding:14px 20px 18px;display:flex;flex-direction:column;flex:1;}',
    '.ctc-related-card-desc{font-size:0.8rem;color:var(--text-secondary,#8b949e);',
    '  line-height:1.6;flex:1;margin-bottom:14px;}',
    '.ctc-related-card-cta{display:inline-block;font-size:0.78rem;font-weight:700;',
    '  color:var(--orange,#f97316);border:1px solid var(--orange,#f97316);',
    '  border-radius:6px;padding:5px 12px;transition:background .15s,color .15s;',
    '  align-self:flex-start;text-decoration:none;}',
    '.ctc-related-card:hover .ctc-related-card-cta{background:var(--orange,#f97316);color:#fff;}',
    /* 라이트모드 */
    '[data-theme="light"] .ctc-related-card{background:#fff;border-color:#e0e4ea;}',
    '[data-theme="light"] .ctc-related-card-top{background:linear-gradient(135deg,#f4f6f8,#eaedf1);}',
    '[data-theme="light"] .ctc-related-card-title{color:#1a1f2e;}',
    '[data-theme="light"] .ctc-related-card-desc{color:#57606a;}'
  ].join('');
  document.head.appendChild(s);
}

/* ── 카테고리 레이블 ── */
var CAT_LABEL = {'coin-tax':'코인 세금','guide':'투자 가이드','root':'블로그'};

/* ── 현재 URL 기준 관련 포스트 3개 선택 ── */
function getRelated(){
  var path = window.location.pathname.replace(/\/$/, '');

  /* 현재 글 제외 */
  var others = POSTS.filter(function(p){
    return p.url.replace(/\/$/, '') !== path;
  });

  /* 같은 카테고리 판별 */
  var cat = 'root';
  if(path.indexOf('/coin-tax/') !== -1) cat = 'coin-tax';
  else if(path.indexOf('/guide/')    !== -1) cat = 'guide';

  var same  = others.filter(function(p){ return p.cat === cat; });
  var diff  = others.filter(function(p){ return p.cat !== cat; });

  /* 결정론적 셔플 (현재 경로 해시 기반) */
  function hashSeed(str){
    var h = 0;
    for(var i=0;i<str.length;i++) h = (Math.imul(31,h)+str.charCodeAt(i))|0;
    return Math.abs(h);
  }
  function shuffle(arr, seed){
    var a = arr.slice(), n = a.length;
    for(var i=n-1;i>0;i--){
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      var j = Math.abs(seed) % (i+1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  var seed = hashSeed(path);
  same = shuffle(same, seed);
  diff = shuffle(diff, seed + 1);

  var picked = same.slice(0,2).concat(diff).slice(0,3);
  /* 2개 미만이면 다른 카테고리로 보충 */
  if(picked.length < 3) picked = same.concat(diff).slice(0,3);
  return picked;
}

/* ── 렌더링 ── */
function render(){
  var wrap = document.getElementById('ctc-related');
  if(!wrap) return;

  var posts = getRelated();
  if(!posts.length) return;

  var html = '<div class="ctc-related">'
    + '<div class="ctc-related-title">📚 함께 읽으면 좋은 글</div>'
    + '<div class="ctc-related-grid">';

  posts.forEach(function(p){
    html += '<a class="ctc-related-card" href="'+p.url+'">'
      + '<div class="ctc-related-card-top">'
      +   '<span class="ctc-related-card-icon">'+p.icon+'</span>'
      +   '<div class="ctc-related-card-cat">'+CAT_LABEL[p.cat]+'</div>'
      +   '<div class="ctc-related-card-title">'+p.title+'</div>'
      + '</div>'
      + '<div class="ctc-related-card-body">'
      +   '<p class="ctc-related-card-desc">'+p.desc+'</p>'
      +   '<span class="ctc-related-card-cta">읽어보기 →</span>'
      + '</div>'
      + '</a>';
  });

  html += '</div></div>';
  wrap.innerHTML = html;
}

injectCSS();
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
})();
