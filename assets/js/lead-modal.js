// ============================================================
// CryptoTax.cloud — 리드 캡처 모달
// 수집처: Google Apps Script → Google 스프레드시트 (직접 저장)
// 설정: APPS_SCRIPT_URL 에 배포된 스크립트 URL 1개만 입력
// ============================================================

(function(){
  'use strict';

  // ── 설정 (여기만 수정) ────────────────────────────────────
  var CONFIG = {
    // ★ Google Apps Script 배포 URL로 교체 (아래 setup-guide.txt 참고)
    APPS_SCRIPT_URL: 'REPLACE_WITH_APPS_SCRIPT_URL',

    STORAGE_KEY:   'ctc_lead_shown',
    COOLDOWN_DAYS: 7,
    AUTO_DELAY:    45000,   // ms (0이면 자동 팝업 비활성)

    RESOURCES: [
      { id:'checklist', label:'📋 2027 코인 세금 신고 체크리스트', file:'/downloads/2027-tax-checklist.html' },
      { id:'tips',      label:'💡 절세 전략 10가지 핵심 요약',    file:'/downloads/tax-saving-10-tips.html'  },
      { id:'formula',   label:'🧮 이동평균법 취득원가 계산 공식',  file:'/downloads/moving-avg-formula.html'  }
    ]
  };

  // ── 쿨다운 ────────────────────────────────────────────────
  function _isCooldown(){
    try{
      var v=localStorage.getItem(CONFIG.STORAGE_KEY);
      if(!v) return false;
      return (Date.now()-parseInt(v))<CONFIG.COOLDOWN_DAYS*86400000;
    }catch(e){return false;}
  }
  function _setCooldown(){
    try{localStorage.setItem(CONFIG.STORAGE_KEY,Date.now());}catch(e){}
  }

  // ── CSS ───────────────────────────────────────────────────
  function _injectCSS(){
    if(document.getElementById('ctc-lead-css')) return;
    var s=document.createElement('style');
    s.id='ctc-lead-css';
    s.textContent=`
#ctcLeadOverlay{
  position:fixed;inset:0;z-index:9999;
  background:rgba(0,0,0,.78);backdrop-filter:blur(4px);
  display:flex;align-items:center;justify-content:center;
  padding:16px;opacity:0;transition:opacity .3s;pointer-events:none;
}
#ctcLeadOverlay.ctc-lead-open{opacity:1;pointer-events:auto;}
#ctcLeadBox{
  background:var(--card,#1a1a1a);
  border:1px solid rgba(247,151,30,.3);
  border-radius:16px;max-width:480px;width:100%;
  box-shadow:0 24px 64px rgba(0,0,0,.6);
  transform:translateY(24px);transition:transform .3s;
  overflow:hidden;position:relative;max-height:92vh;overflow-y:auto;
}
#ctcLeadOverlay.ctc-lead-open #ctcLeadBox{transform:translateY(0);}
.ctc-lead-header{
  background:linear-gradient(135deg,#f7971e,#e05e00);
  padding:20px 24px 16px;text-align:center;
}
.ctc-lead-header .ctc-lead-icon{font-size:36px;margin-bottom:8px;}
.ctc-lead-header h2{font-size:18px;font-weight:700;color:#fff;margin:0 0 4px;line-height:1.3;}
.ctc-lead-header p{font-size:13px;color:rgba(255,255,255,.85);margin:0;}
.ctc-lead-body{padding:20px 24px 24px;}
.ctc-lead-resources{margin-bottom:16px;}
.ctc-lead-resources label{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;border-radius:8px;cursor:pointer;
  border:1px solid transparent;transition:border-color .2s,background .2s;
  font-size:14px;color:var(--text,#f0f0f0);margin-bottom:6px;
}
.ctc-lead-resources label:hover{background:rgba(247,151,30,.08);border-color:rgba(247,151,30,.3);}
.ctc-lead-resources input[type=checkbox]{accent-color:var(--orange,#f7971e);width:16px;height:16px;flex-shrink:0;}
.ctc-lead-resources label.ctc-res-selected{background:rgba(247,151,30,.1);border-color:var(--orange,#f7971e);}
.ctc-lead-field{margin-bottom:12px;}
.ctc-lead-field label{display:block;font-size:12px;color:var(--text-sub,#aaa);margin-bottom:4px;}
.ctc-lead-field input{
  width:100%;box-sizing:border-box;
  background:var(--bg,#0a0a0a);border:1px solid rgba(255,255,255,.12);
  border-radius:8px;padding:10px 12px;font-size:14px;
  color:var(--text,#f0f0f0);outline:none;transition:border-color .2s;
}
.ctc-lead-field input:focus{border-color:var(--orange,#f7971e);}
.ctc-lead-field input::placeholder{color:var(--text-sub,#aaa);}
.ctc-lead-agree{
  display:flex;align-items:flex-start;gap:8px;
  font-size:12px;color:var(--text-sub,#aaa);margin-bottom:16px;cursor:pointer;
}
.ctc-lead-agree input{accent-color:var(--orange,#f7971e);margin-top:2px;flex-shrink:0;}
.ctc-lead-agree a{color:var(--orange,#f7971e);text-decoration:none;}
#ctcLeadSubmit{
  width:100%;padding:13px;border:none;border-radius:10px;cursor:pointer;
  background:linear-gradient(135deg,#f7971e,#e05e00);
  color:#fff;font-size:15px;font-weight:700;
  transition:opacity .2s,transform .1s;
}
#ctcLeadSubmit:hover{opacity:.92;transform:translateY(-1px);}
#ctcLeadSubmit:active{transform:translateY(0);}
#ctcLeadSubmit:disabled{opacity:.5;cursor:not-allowed;transform:none;}
#ctcLeadClose{
  position:absolute;top:12px;right:14px;
  background:none;border:none;color:rgba(255,255,255,.7);
  font-size:20px;cursor:pointer;line-height:1;padding:4px;z-index:1;
}
#ctcLeadClose:hover{color:#fff;}
.ctc-lead-skip{text-align:center;margin-top:10px;font-size:12px;color:var(--text-sub,#aaa);cursor:pointer;}
.ctc-lead-skip:hover{color:var(--text,#f0f0f0);}
.ctc-lead-error{font-size:12px;color:#ff6b6b;margin-top:-8px;margin-bottom:8px;display:none;}
/* 완료 화면 */
.ctc-lead-done{text-align:center;padding:28px 24px 24px;}
.ctc-lead-done-icon{font-size:48px;margin-bottom:10px;}
.ctc-lead-done h3{font-size:18px;font-weight:700;color:var(--text,#f0f0f0);margin:0 0 6px;}
.ctc-lead-done>p{font-size:14px;color:var(--text-sub,#aaa);margin:0 0 18px;}
.ctc-lead-dl-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
.ctc-lead-dl-btn{
  display:flex;align-items:center;gap:8px;justify-content:center;
  padding:12px 16px;border-radius:9px;
  background:linear-gradient(135deg,rgba(247,151,30,.18),rgba(247,151,30,.08));
  border:1px solid rgba(247,151,30,.45);
  color:var(--orange,#f7971e);font-size:14px;font-weight:700;
  text-decoration:none;transition:background .2s;
}
.ctc-lead-dl-btn:hover{background:rgba(247,151,30,.28);}
.ctc-lead-dl-btn .dl-icon{font-size:18px;}
.ctc-lead-kakao{
  display:flex;align-items:center;gap:8px;justify-content:center;
  width:100%;padding:12px;border:none;border-radius:9px;cursor:pointer;
  background:#FEE500;color:#191919;font-size:14px;font-weight:700;
  transition:opacity .2s;margin-top:8px;
}
.ctc-lead-kakao:hover{opacity:.88;}
/* 인라인 배너 */
.ctc-lead-banner{
  display:flex;align-items:center;gap:14px;
  background:linear-gradient(135deg,rgba(247,151,30,.12),rgba(224,94,0,.08));
  border:1px solid rgba(247,151,30,.35);border-radius:12px;
  padding:14px 18px;margin:20px 0;cursor:pointer;
  transition:border-color .2s,background .2s;
}
.ctc-lead-banner:hover{border-color:var(--orange,#f7971e);background:rgba(247,151,30,.18);}
.ctc-lead-banner-icon{font-size:32px;flex-shrink:0;}
.ctc-lead-banner-text strong{display:block;font-size:14px;font-weight:700;color:var(--text,#f0f0f0);margin-bottom:2px;}
.ctc-lead-banner-text span{font-size:12px;color:var(--text-sub,#aaa);}
.ctc-lead-banner-cta{
  margin-left:auto;flex-shrink:0;
  background:linear-gradient(135deg,#f7971e,#e05e00);
  color:#fff;font-size:12px;font-weight:700;
  border:none;border-radius:7px;padding:7px 13px;cursor:pointer;white-space:nowrap;
}
/* 라이트모드 */
[data-theme=light] .ctc-lead-field input,
body.light-mode .ctc-lead-field input{background:#f6f8fa;border-color:rgba(0,0,0,.15);color:#191919;}
[data-theme=light] .ctc-lead-field input::placeholder,
body.light-mode .ctc-lead-field input::placeholder{color:#888;}
`;
    document.head.appendChild(s);
  }

  // ── HTML 생성 ──────────────────────────────────────────────
  function _buildHTML(){
    var resHTML=CONFIG.RESOURCES.map(function(r){
      return '<label><input type="checkbox" name="resource" value="'+r.id+'"> '+r.label+'</label>';
    }).join('');

    return `
<div id="ctcLeadOverlay" role="dialog" aria-modal="true" aria-labelledby="ctcLeadTitle">
  <div id="ctcLeadBox">
    <button id="ctcLeadClose" aria-label="닫기">✕</button>

    <!-- 폼 화면 -->
    <div id="ctcLeadForm">
      <div class="ctc-lead-header">
        <div class="ctc-lead-icon">📥</div>
        <h2 id="ctcLeadTitle">세금 자료 무료 다운로드</h2>
        <p>정보 입력 후 즉시 PDF 다운로드 링크를 받으세요</p>
      </div>
      <div class="ctc-lead-body">
        <div class="ctc-lead-resources">${resHTML}</div>
        <div class="ctc-lead-field">
          <label for="ctcLeadName">이름 <span style="color:var(--text-sub,#aaa)">(선택)</span></label>
          <input type="text" id="ctcLeadName" placeholder="홍길동" autocomplete="name">
        </div>
        <div class="ctc-lead-field">
          <label for="ctcLeadEmail">이메일 <span style="color:#ff6b6b">*</span></label>
          <input type="email" id="ctcLeadEmail" placeholder="example@email.com" autocomplete="email">
        </div>
        <div class="ctc-lead-field">
          <label for="ctcLeadPhone">전화번호 <span style="color:#ff6b6b">*</span></label>
          <input type="tel" id="ctcLeadPhone" placeholder="010-0000-0000" autocomplete="tel">
        </div>
        <div class="ctc-lead-error" id="ctcLeadError">이메일 또는 전화번호를 입력해 주세요.</div>
        <label class="ctc-lead-agree">
          <input type="checkbox" id="ctcLeadAgree">
          <span><a href="/privacy-policy.html" target="_blank">개인정보 수집</a>에 동의합니다. 마케팅 정보 수신에 활용될 수 있습니다.</span>
        </label>
        <button id="ctcLeadSubmit">무료 자료 받기 →</button>
        <div class="ctc-lead-skip" id="ctcLeadSkip">지금은 괜찮아요</div>
      </div>
    </div>

    <!-- 완료 화면 -->
    <div id="ctcLeadDone" class="ctc-lead-done" style="display:none">
      <div class="ctc-lead-done-icon">🎉</div>
      <h3>감사합니다! 자료가 준비됐습니다</h3>
      <p>아래 버튼을 눌러 PDF를 바로 다운로드 하세요</p>
      <div class="ctc-lead-dl-list" id="ctcLeadDlList"></div>
      <button class="ctc-lead-kakao" onclick="window.open('https://pf.kakao.com/_REPLACE_KAKAO_ID','_blank')">
        💬 카카오채널 추가하고 세금 소식 받기
      </button>
    </div>
  </div>
</div>`;
  }

  // ── Google Apps Script 전송 ────────────────────────────────
  // 보안: API 키 없음. URL만 알면 접근 가능하므로
  //       Apps Script 쪽에서 referer 검증을 추가하는 것 권장.
  function _submitLead(data){
    if(CONFIG.APPS_SCRIPT_URL === 'REPLACE_WITH_APPS_SCRIPT_URL'){
      // 개발 모드: 콘솔에만 출력
      console.log('[CTC Lead] 개발 모드 — Apps Script URL 미설정:', data);
      return Promise.resolve();
    }

    // URLSearchParams + no-cors fetch
    // → Apps Script가 form POST로 수신, 스프레드시트에 기록
    var body = new URLSearchParams({
      name:      data.name      || '',
      email:     data.email     || '',
      phone:     data.phone     || '',
      resources: data.resources || '',
      page:      data.page      || '',
      source:    'cryptotax.cloud',
      ts:        new Date().toISOString()
    });

    return fetch(CONFIG.APPS_SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',       // Apps Script CORS 우회 (응답 body 없음, 정상)
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString()
    }).catch(function(){ /* 네트워크 오류 시 무시 — UX 영향 없음 */ });
  }

  function _esc(s){ return String(s||'').replace(/"/g,'&quot;'); }

  // ── 완료 화면 ─────────────────────────────────────────────
  function _showDone(selectedIds){
    document.getElementById('ctcLeadForm').style.display='none';
    var done=document.getElementById('ctcLeadDone');
    done.style.display='block';

    var items=CONFIG.RESOURCES.filter(function(r){ return selectedIds.indexOf(r.id)!==-1; });
    if(!items.length) items=CONFIG.RESOURCES;

    document.getElementById('ctcLeadDlList').innerHTML=items.map(function(r){
      return '<a class="ctc-lead-dl-btn" href="'+r.file+'" target="_blank">'+
        '<span class="dl-icon">⬇️</span> '+r.label+' 다운로드</a>';
    }).join('');
  }

  // ── 열기/닫기 ─────────────────────────────────────────────
  function _open(){
    var el=document.getElementById('ctcLeadOverlay');
    if(!el) return;
    el.classList.add('ctc-lead-open');
    document.body.style.overflow='hidden';
  }
  function _close(){
    var el=document.getElementById('ctcLeadOverlay');
    if(!el) return;
    el.classList.remove('ctc-lead-open');
    document.body.style.overflow='';
    _setCooldown();
  }

  // ── 인라인 배너 주입 ──────────────────────────────────────
  function _injectBanners(){
    document.querySelectorAll('[data-lead-banner]').forEach(function(slot){
      var b=document.createElement('div');
      b.className='ctc-lead-banner';
      b.setAttribute('role','button');
      b.setAttribute('tabindex','0');
      b.innerHTML=
        '<span class="ctc-lead-banner-icon">📥</span>'+
        '<div class="ctc-lead-banner-text">'+
          '<strong>세금 자료 무료 PDF 다운로드</strong>'+
          '<span>체크리스트·절세 전략·취득원가 공식 3종 무료 제공</span>'+
        '</div>'+
        '<button class="ctc-lead-banner-cta">무료 받기</button>';
      b.addEventListener('click',_open);
      b.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' ') _open(); });
      slot.appendChild(b);
    });
  }

  // ── 초기화 ────────────────────────────────────────────────
  function _init(){
    if(_isCooldown()) return;
    if(!location.pathname.includes('/tools/')) return;

    _injectCSS();

    var wrap=document.createElement('div');
    wrap.innerHTML=_buildHTML();
    document.body.appendChild(wrap.firstElementChild);

    // 체크박스 강조
    document.querySelectorAll('.ctc-lead-resources input[type=checkbox]').forEach(function(cb){
      cb.addEventListener('change',function(){
        this.closest('label').classList.toggle('ctc-res-selected',this.checked);
      });
    });

    // 닫기
    document.getElementById('ctcLeadClose').addEventListener('click',_close);
    document.getElementById('ctcLeadSkip').addEventListener('click',_close);
    document.getElementById('ctcLeadOverlay').addEventListener('click',function(e){
      if(e.target===this) _close();
    });

    // 제출
    document.getElementById('ctcLeadSubmit').addEventListener('click',function(){
      var name    = document.getElementById('ctcLeadName').value.trim();
      var email   = document.getElementById('ctcLeadEmail').value.trim();
      var phone   = document.getElementById('ctcLeadPhone').value.trim();
      var agree   = document.getElementById('ctcLeadAgree').checked;
      var errEl   = document.getElementById('ctcLeadError');

      if(!email && !phone){
        errEl.textContent='이메일 또는 전화번호 중 하나를 입력해 주세요.';
        errEl.style.display='block'; return;
      }
      if(!agree){
        errEl.textContent='개인정보 수집 동의가 필요합니다.';
        errEl.style.display='block'; return;
      }
      errEl.style.display='none';

      var selectedIds=Array.from(
        document.querySelectorAll('.ctc-lead-resources input[type=checkbox]:checked')
      ).map(function(cb){ return cb.value; });

      var btn=document.getElementById('ctcLeadSubmit');
      btn.disabled=true;
      btn.textContent='저장 중...';

      var payload={
        name:      name,
        email:     email,
        phone:     phone,
        resources: selectedIds.length ? selectedIds.join(',') : CONFIG.RESOURCES.map(function(r){return r.id;}).join(','),
        page:      location.pathname
      };

      // 전송 후 즉시 완료 화면 (no-cors라 응답 대기 불필요)
      _submitLead(payload);
      _showDone(selectedIds);
      _setCooldown();
    });

    // 배너 주입
    _injectBanners();

    // 자동 트리거 (45초)
    if(CONFIG.AUTO_DELAY>0){
      setTimeout(function(){
        var ov=document.getElementById('ctcLeadOverlay');
        if(ov && !ov.classList.contains('ctc-lead-open')) _open();
      },CONFIG.AUTO_DELAY);
    }

    // 계산 완료 이벤트 트리거
    document.addEventListener('ctcCalculated',function(){
      setTimeout(_open,800);
    },{once:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',_init);
  }else{
    _init();
  }

  window.CTC_LeadModal={ open:_open, close:_close };

})();
