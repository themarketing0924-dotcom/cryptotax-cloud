// ============================================================
// CryptoTax.cloud — Google Apps Script 리드 수집기
// ============================================================
// 이 파일을 Google Apps Script에 붙여넣고 배포하세요.
// 배포 URL을 lead-modal.js의 APPS_SCRIPT_URL에 입력하면 완료.
//
// [설치 방법 — 3단계]
// 1. https://sheets.new 접속 → 새 스프레드시트 생성
//    - 시트 이름을 "리드" 로 변경 (선택사항)
//    - A1~H1에 헤더 입력:
//      타임스탬프 | 이름 | 이메일 | 전화번호 | 선택자료 | 페이지 | 출처 | 메모
//
// 2. 상단 메뉴 → 확장 프로그램 → Apps Script
//    - 기존 코드 전체 삭제
//    - 아래 코드 전체 붙여넣기 → 저장(Ctrl+S)
//
// 3. 배포 → 새 배포 → 유형: 웹 앱
//    - 실행 계정: 나(본인)
//    - 액세스 권한: 모든 사용자 (익명 포함)
//    - 배포 → 승인 → URL 복사
//    → lead-modal.js의 APPS_SCRIPT_URL에 붙여넣기
//
// ============================================================

// ★★★ 여기서부터 Apps Script에 붙여넣을 코드 ★★★

/*

// ── 스프레드시트 ID (URL에서 복사) ──────────────────────────
// https://docs.google.com/spreadsheets/d/[여기가 ID]/edit
var SHEET_ID = 'YOUR_SPREADSHEET_ID'; // ← 교체
var SHEET_NAME = '시트1'; // 시트 탭 이름 (기본값: 시트1)

// ── 허용된 도메인 (보안용 — 선택사항) ──────────────────────
var ALLOWED_ORIGIN = 'cryptotax.cloud';

function doPost(e) {
  try {
    // 파라미터 파싱
    var p = e.parameter || {};
    var name      = p.name      || '';
    var email     = p.email     || '';
    var phone     = p.phone     || '';
    var resources = p.resources || '';
    var page      = p.page      || '';
    var source    = p.source    || '';
    var ts        = p.ts        || '';

    // 이메일 또는 전화번호 필수 확인
    if (!email && !phone) {
      return _res({status:'error', message:'email 또는 phone 필수'});
    }

    // 스프레드시트에 저장
    var sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName(SHEET_NAME);

    var kst = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    sheet.appendRow([
      kst,        // 타임스탬프 (KST)
      name,       // 이름
      email,      // 이메일
      phone,      // 전화번호
      resources,  // 선택한 자료 ID (checklist,tips,formula)
      page,       // 유입 페이지 (/tools/tax-calculator.html 등)
      source,     // 출처 (cryptotax.cloud)
      ''          // 메모 (수동 입력용)
    ]);

    return _res({status:'ok', ts: kst});

  } catch(err) {
    // 오류 발생해도 사용자에게는 성공 반환 (UX 보호)
    Logger.log('CTC Lead Error: ' + err.toString());
    return _res({status:'error', message: err.toString()});
  }
}

// GET 요청 → 동작 확인용 (배포 후 브라우저에서 URL 열면 OK 표시)
function doGet(e) {
  return ContentService
    .createTextOutput('CryptoTax.cloud Lead Collector — 정상 작동 중')
    .setMimeType(ContentService.MimeType.TEXT);
}

// JSON 응답 헬퍼
function _res(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

*/

// ★★★ 여기까지 붙여넣을 코드 ★★★

// ============================================================
// [배포 후 확인 방법]
// 1. 배포 URL을 브라우저에서 직접 열면 "정상 작동 중" 텍스트 표시
// 2. 계산기 페이지에서 "무료 자료 받기" 버튼 클릭 → 정보 입력 → 제출
// 3. Google 스프레드시트 새로고침 → 새 행이 추가됐으면 성공
//
// [데이터 열 구조]
// A: 타임스탬프 (2027-01-15 14:30:22)
// B: 이름
// C: 이메일 ← 핵심 수집 필드
// D: 전화번호
// E: 선택자료 (checklist,tips,formula)
// F: 유입페이지 (/tools/tax-calculator.html)
// G: 출처 (cryptotax.cloud)
// H: 메모 (운영자가 직접 입력)
//
// [보안 관련]
// - APPS_SCRIPT_URL이 공개되더라도 스팸 방지:
//   Apps Script에 rate limit 로직 추가 가능
// - 민감 데이터(비밀번호 등)는 절대 수집하지 않음
// - 개인정보처리방침 페이지(/privacy-policy.html) 연결됨
// ============================================================
