// apply-portal5-edits.js
// Applies Task 16 edits to portal4.html → portal5.html
// Changes:
//   1.  Replace NAMA_PLAN_DATE_MAP + lookupPlanDate with PLAN_CATALOG (76 entries P01-P76) + lookupPlanCatalog + new lookupPlanDate (OSB fallback)
//   2.  pivotPlanOrObRows: attach catOrder/display/date from catalog
//   3.  renderPlanCard sort → catOrder (no date sort)
//   4.  buildPlanRowsForPDF sort → catOrder
//   5.  buildGanjaranRowsForPDF sort → catOrder
//   6.  renderGanjaranCard sort → catOrder
//   7.  CSS: tarikh-col sky blue + bold; jumlah-col light green + black bold (data rows); total-row red+white override
//   8.  PDF ahliFields: IC first, REMARK removed
//   9.  PDF JUMLAH KESELURUHAN table: full width, only last row red+white
//   10. PDF JUMLAH KESELURUHAN IMBUHAN box: gold bg, BLACK bold text, bigger box
//   11. PDF SULIT box: bigger title (16pt) + body (9pt) + taller box
//   12. PDF TARIKH color: sky blue (was dark blue)
//   13. (covered by change 9 — full width)
//   14. PDF PLAN/OSB JUMLAH column: gold bg + black bold (data rows); foot row stays red
//   15. Clock: 3-line stacked (TARIKH bold / HARI / MASA white AM-PM) + CSS + updateClock
//   16. Supabase save: add .select() to update calls + merge returned data
//   17. page.tsx redirect to portal5.html
//   18. eslint.config.mjs: ignore apply-portal5-edits.js
const fs = require('fs');

const SRC = '/home/z/my-project/public/portal4.html';
const DST = '/home/z/my-project/public/portal5.html';

let html = fs.readFileSync(SRC, 'utf8');
const origLen = html.length;
let editCount = 0;

function edit(name, oldStr, newStr, opts) {
  opts = opts || {};
  if (!html.includes(oldStr)) {
    if (opts.optional) { console.log('  SKIP (optional, not found): ' + name); return; }
    throw new Error('EDIT FAILED (not found): ' + name + '\n--- anchor (first 200 chars) ---\n' + oldStr.slice(0, 200));
  }
  const count = opts.all ? html.split(oldStr).length - 1 : 1;
  html = opts.all ? html.split(oldStr).join(newStr) : html.replace(oldStr, newStr);
  editCount++;
  console.log('  OK ' + name + ' (' + count + ' occurrence' + (count > 1 ? 's' : '') + ')');
}

console.log('=== Applying Task 16 edits to portal4.html -> portal5.html ===\n');

// ============================================================
// CHANGE 1: Replace NAMA_PLAN_DATE_MAP + lookupPlanDate with PLAN_CATALOG + lookupPlanCatalog + new lookupPlanDate
// ============================================================
console.log('[1] Replace NAMA_PLAN_DATE_MAP + lookupPlanDate with PLAN_CATALOG');
edit('Replace NAMA_PLAN_DATE_MAP and lookupPlanDate',
`// NAMA_PLAN → TARIKH map (based on historical plan dates from old portal records)
// Keys are NAMA PLAN in uppercase (spaces, no suffix). Lookup is case/space-insensitive.
const NAMA_PLAN_DATE_MAP = {
  'PLAN SMMG TAWAKAL':'6/3/2018',
  'PLAN PORTION ROYAL MASTER 4':'8/3/2018',
  'PORTION JIMMY ROYAL TSRMT 12':'2018',
  'PLAN SAGUHATI PJR TSRMT 12':'2018',
  'PLAN PORTION TN SHAM PPTS TSRMT 12':'2018',
  'PLAN MANAGEMENT TUAN JIMMY PMTJ':'13/3/2018',
  'PLAN SETIA BERSAMAMU PSB':'26/3/2018',
  'BONUS STAMPING':'30/3/2018',
  'PLAN HINGGA HUJUNG NYAWA PHHN':'6/4/2018',
  'PORTION TOKEN TUAN JIMMY TTJ':'6/4/2018',
  'PORTION TOKEN TAMBAHAN TUAN JIMMY OFFLINE TTTJOFF':'14/4/2018',
  'PLAN SUMBANGAN PORTION JIKA TEGAR SPJT':'17/4/2018',
  'PLAN FINAL DESTINATION PFD':'30/4/2018',
  'PORTION SUMBANGAN OFFLINE TJM':'31/5/2018',
  'SUMBANGAN PENGURUSAN TERTINGGI SPT':'22/6/2018',
  'SUMBANGAN BANTUAN KEWANGAN SMMG SBK 1':'3/7/2018',
  'SUMBANGAN BANTUAN KEWANGAN SMMG SBK 2':'5/7/2018',
  'COLLECTION BANTUAN KHAS TSR CBK':'29/7/2018',
  'SUMBANGAN SPECIAL BONUS SSB':'16/8/2018',
  'SUMBANGAN FINAL SMMG SFS':'26/9/2018',
  'SUMBANGAN TAMBAHAN TSRMT STT':'30/10/2018',
  'PLAN SQUARING ACCOUNT PROCESSING SAP':'21/12/2018',
  'SAMPAI PAY OUT 16 SPO16':'14/1/2019',
  'SUMBANGAN LAST CALL SLC':'8/3/2019',
  'PLAN BTMA TSRMT 12':'2019',
  'NEXT STAGE LEVEL NSL':'5/5/2019',
  'BANTUAN KELANCARAN PENGURUSAN GROUP BKPG':'15/7/2019',
  'FINAL PLAN FOR ALL FPFA':'1/8/2019',
  'TEST RUNNING PO TSRMT TRPT':'6/10/2019',
  'PLAN BUKA SAT AJA PBSA':'28/10/2019',
  'OTHERS':'2019',
  'PLAN EXTRA COI PEC':'18/1/2020',
  'LAST PLAN MANAGEMENT LPM':'6/3/2020',
  'PLAN KOMUNITI BERSAMA PKB':'19/10/2020',
  'PLAN SPECIAL JUMBO SJPO':'28/12/2020',
  'PLAN UKHWAH FROM TSRMT 13':'2020',
  'MISTERI PLAN TSRMT MPT':'26/2/2021',
  'MERDEKA PLAN TSRMT 7':'25/8/2021',
  'PLAN TOKEN TERAWAL TSR TSRMT 12':'2021',
  'PLAN PORTION VIP KAK JUE PKJ TSRMT 12':'2021',
  'PLAN BANTUAN KHAS TSR PBKTSR TSRMT 12':'2021',
  'PLAN BANTUAN KHAS KAK JUE PBKKJ TSRMT 12':'2021',
  'PLAN BANTUAN KHAS ARIF TSR PBKA TSRMT 12':'2021',
  'PLAN MELETOP TSR TSRMT 12':'2021',
  'PLAN SMOOTHIE STRAWBERRY PSS':'18/1/2022',
  'PLAN SMOOTHIE HARUM MANIS SHM':'30/1/2022',
  'PLAN FAST LANE RBO PFLRBO':'18/7/2022',
  'EXTRA SAGUHATI TSRMT 12':'2022',
  'PLAN TASK FOR ENDING RBO TFE':'2/10/2022',
  'PLAN MAMU UP':'26/11/2022',
  'PLAN PAKAT BANTU RBO PBR':'3/3/2023',
  'SUPER BONUS TSR SBT':'4/7/2023',
  'SUMBANGAN BANTUAN RBO TSRMT SBR':'5/10/2023',
  'FINAL AUTHORISATION RBO FAR':'2/7/2023',
  'SUMBANGAN CLEARING PROCESSING CPR':'23/7/2023',
  'SUMBANGAN CLEARING PROCESSING CPR BONUS AWALAN':'23/7/2023',
  'SUMBANGAN SINAR KEGEMILANGAN SSK':'11/9/2023',
  'SEPTEMBER SUPER FAST SSF':'15/9/2023',
  'SUMBANGAN CLEARING ACC SCA':'20/10/2023',
  'PLAN LAST DRAW RBO PLDRBO':'8/11/2023',
  'YURAN PERINTIS RM10':'25/11/2023',
  'SUMBANGAN 2T RBO TSRMT':'23/12/2023',
  'PLAN 3C':'18/1/2024',
  'PLAN BANTUAN KHAS RBO TSRMT MEI 1':'22/4/2024',
  'PLAN BANTUAN KHAS RBO TSRMT MEI 2':'7/5/2024',
  'PORTION RAHMAH RBO V1 TSRMT':'28/5/2024',
  'PORTION RAHMAH RBO V2 TSRMT':'10/6/2024',
  'PLAN SINAR PELANGI':'1/9/2024',
  'PLAN SINAR PELANGI SPECIAL HADIAH SEMASA EVENT LOT':'1/9/2024',
  'BANTUAN KHAS RBO KLCC UPFRONT OCT 2024 1':'1/10/2024',
  'BANTUAN KHAS RBO KLCC UPFRONT OCT 2024 2':'22/10/2024',
  'PLAN FLY HIGH RBO TSRMT':'17/1/2025',
  'PLAN ADVANCE SYAWAL VS1':'25/2/2025',
  'PLAN ADVANCE SYAWAL VS2':'15/3/2025',
  'PLAN CRUCIAL RBO TSRMT':'10/4/2025',
  'PLAN RBO INVOICES TSRMT':'11/7/2025',
  'PLAN FINAL TSRTM RBO 2026':'24/5/2026',
  // OSB
  'OSB VS1':'26/1/2023',
  'OSB VS2':'14/7/2024',
  'OSB VS3':'24/5/2025',
  'OSB VS4':'27/6/2025',
  'YURAN WEBSITE':'14/7/2024'
};
function lookupPlanDate(namaPlan){
  if(!namaPlan) return '';
  const norm = String(namaPlan).toUpperCase().replace(/\\s+/g,' ').trim();
  if(NAMA_PLAN_DATE_MAP[norm]) return NAMA_PLAN_DATE_MAP[norm];
  // Try without leading "PLAN "
  if(norm.startsWith('PLAN ')){
    const s = norm.slice(5);
    if(NAMA_PLAN_DATE_MAP[s]) return NAMA_PLAN_DATE_MAP[s];
  }
  // Try matching by includes
  for(const k of Object.keys(NAMA_PLAN_DATE_MAP)){
    if(norm.includes(k) || k.includes(norm)) return NAMA_PLAN_DATE_MAP[k];
  }
  return '';
}`,
`// PLAN_CATALOG — authoritative P01..P76 ordering + display name + date for each plan.
// aliases[] are the normalized plan names produced by Supabase column parsing.
const PLAN_CATALOG = [
  { display:'PLAN SMMG TAWAKAL', date:'6/3/2018', aliases:['PLAN SMMG TAWAKAL'] },
  { display:'PLAN PORTION ROYALMASTER4', date:'8/3/2018', aliases:['PLAN PORTION ROYAL MASTER 4'] },
  { display:'PORTION JIMMY ROYAL-G12', date:'2018', aliases:['PORTION JIMMY ROYAL TSRMT 12','PORTION JIMMY ROYAL G 12'] },
  { display:'PLAN SAGUHATI PJR -G12', date:'2018', aliases:['PLAN SAGUHATI PJR TSRMT 12','PLAN SAGUHATI PJR G 12'] },
  { display:'PLAN PORTION TN SHAM (PPTS)-G12', date:'2018', aliases:['PLAN PORTION TN SHAM PPTS TSRMT 12','PLAN PORTION TN SHAM PPTS G 12'] },
  { display:'PLAN MANAGEMENT TUAN JIMMY (PMTJ)', date:'13/3/2018', aliases:['PLAN MANAGEMENT TUAN JIMMY PMTJ'] },
  { display:'PLAN SETIA BERSAMAMU (PSB)', date:'26/3/2018', aliases:['PLAN SETIA BERSAMAMU PSB'] },
  { display:'BONUS STAMPING', date:'30/3/2018', aliases:['BONUS STAMPING'] },
  { display:'PLAN HINGGA HUJUNG NYAWA (PHHN)', date:'6/4/2018', aliases:['PLAN HINGGA HUJUNG NYAWA PHHN'] },
  { display:'PORTION TOKEN TUAN JIMMY (TTJ)', date:'6/4/2018', aliases:['PORTION TOKEN TUAN JIMMY TTJ'] },
  { display:'PORTION TOKEN TAMBAHAN TUAN JIMMY -OFFLINE', date:'14/4/2018', aliases:['PORTION TOKEN TAMBAHAN TUAN JIMMY OFFLINE TTTJOFF','PORTION TOKEN TAMBAHAN TUAN JIMMY OFFLINE'] },
  { display:'PLAN SUMBANGAN PORTION JIWA TEGAR (SPJT)', date:'17/4/2018', aliases:['PLAN SUMBANGAN PORTION JIKA TEGAR SPJT','PLAN SUMBANGAN PORTION JIWA TEGAR SPJT'] },
  { display:'PLAN FINAL DESTINATION -PFD', date:'30/4/2018', aliases:['PLAN FINAL DESTINATION PFD'] },
  { display:'PORTION SUMBANGAN OFFLINE T.J.M', date:'31/5/2018', aliases:['PORTION SUMBANGAN OFFLINE TJM'] },
  { display:'SUMBANGAN PENGURUSAN TERTINGGI -SPT', date:'22/6/2018', aliases:['SUMBANGAN PENGURUSAN TERTINGGI SPT'] },
  { display:'SUMBANGAN BANTUAN KEWANGAN SMMG-SBK 1', date:'3/7/2018', aliases:['SUMBANGAN BANTUAN KEWANGAN SMMG SBK 1'] },
  { display:'SUMBANGAN BANTUAN KEWANGAN SMMG-SBK 2', date:'5/7/2018', aliases:['SUMBANGAN BANTUAN KEWANGAN SMMG SBK 2'] },
  { display:'COLLECTION BANTUAN KHAS TSR -CBK', date:'29/7/2018', aliases:['COLLECTION BANTUAN KHAS TSR CBK'] },
  { display:'SUMBANGAN SPECIAL BONUS -SSB', date:'16/8/2018', aliases:['SUMBANGAN SPECIAL BONUS SSB'] },
  { display:'SUMBANGAN FINAL SMMG -SFS', date:'26/9/2018', aliases:['SUMBANGAN FINAL SMMG SFS'] },
  { display:'PLAN SUMBANGAN TAMBAHAN TSRMT-STT', date:'30/10/2018', aliases:['SUMBANGAN TAMBAHAN TSRMT STT','PLAN SUMBANGAN TAMBAHAN TSRMT STT'] },
  { display:'PLAN SQUARING ACCOUNT PROCESSING (SAP)', date:'21/12/2018', aliases:['PLAN SQUARING ACCOUNT PROCESSING SAP'] },
  { display:'SAMPAI PAY OUT 16 (SPO16)', date:'14/1/2019', aliases:['SAMPAI PAY OUT 16 SPO16'] },
  { display:'PLAN SUMBANGAN LAST CALL -SLC', date:'3/8/2019', aliases:['SUMBANGAN LAST CALL SLC','PLAN SUMBANGAN LAST CALL SLC'] },
  { display:'PLAN BTMA - G11&12', date:'2019', aliases:['PLAN BTMA TSRMT 12','PLAN BTMA G 11 12','PLAN BTMA TSRMT G 11 12'] },
  { display:'NEXT STAGE LEVEL -NSL', date:'5/5/2019', aliases:['NEXT STAGE LEVEL NSL'] },
  { display:'BANTUAN KELANCARAN PENGURUSAN GROUP (BKPG)', date:'15/7/2019', aliases:['BANTUAN KELANCARAN PENGURUSAN GROUP BKPG'] },
  { display:'FINAL PLAN FOR ALL -(FPFA)', date:'1/8/2019', aliases:['FINAL PLAN FOR ALL FPFA'] },
  { display:'TEST RUNNING PO TSRMT (TRPT)', date:'6/10/2019', aliases:['TEST RUNNING PO TSRMT TRPT'] },
  { display:'PLAN BUKA SAT AJA (PBSA)', date:'28/10/2019', aliases:['PLAN BUKA SAT AJA PBSA'] },
  { display:'OTHERS', date:'2019', aliases:['OTHERS'] },
  { display:'PLAN EXTRA COI (PEC)', date:'18/1/2020', aliases:['PLAN EXTRA COI PEC'] },
  { display:'LAST PLAN MANAGEMENT (LPM)', date:'6/3/2020', aliases:['LAST PLAN MANAGEMENT LPM'] },
  { display:'PLAN KOMUNITI BERSAMA - (PKB)', date:'19/10/2020', aliases:['PLAN KOMUNITI BERSAMA PKB'] },
  { display:'PLAN SPECIAL JUMBO - (SJPO)', date:'28/12/2020', aliases:['PLAN SPECIAL JUMBO SJPO'] },
  { display:'PLAN UKHWAH (FROM TSRMT 13)', date:'2020', aliases:['PLAN UKHWAH FROM TSRMT 13'] },
  { display:'MISTERI PLAN TSRMT (MPT)', date:'26/2/2021', aliases:['MISTERI PLAN TSRMT MPT'] },
  { display:'MERDEKA PLAN- G7', date:'25/8/2021', aliases:['MERDEKA PLAN TSRMT 7','MERDEKA PLAN G 7','MERDEKA PLAN TSRMT G 7'] },
  { display:'PLAN TOKEN TERAWAL TSR -G12', date:'2021', aliases:['PLAN TOKEN TERAWAL TSR TSRMT 12','PLAN TOKEN TERAWAL TSR G 12'] },
  { display:'PLAN PORTION VIP KAK JUE (PKJ)-G12', date:'2021', aliases:['PLAN PORTION VIP KAK JUE PKJ TSRMT 12','PLAN PORTION VIP KAK JUE PKJ G 12'] },
  { display:'PLAN BANTUAN KHAS TSR (PBKTSR)-G12', date:'2021', aliases:['PLAN BANTUAN KHAS TSR PBKTSR TSRMT 12','PLAN BANTUAN KHAS TSR PBKTSR G 12'] },
  { display:'PLAN BANTUAN KHAS KAK JUE (PBKKJ)-G12', date:'2021', aliases:['PLAN BANTUAN KHAS KAK JUE PBKKJ TSRMT 12','PLAN BANTUAN KHAS KAK JUE PBKKJ G 12'] },
  { display:'PLAN BANTUAN KHAS ARIF@TSR (PBKA)-G12', date:'2021', aliases:['PLAN BANTUAN KHAS ARIF TSR PBKA TSRMT 12','PLAN BANTUAN KHAS ARIF TSR PBKA G 12'] },
  { display:'PLAN MELETOP TSR -G12', date:'2021', aliases:['PLAN MELETOP TSR TSRMT 12','PLAN MELETOP TSR G 12'] },
  { display:'PLAN SMOOTHIE STRAWBERRY(PSS)', date:'18/1/2022', aliases:['PLAN SMOOTHIE STRAWBERRY PSS'] },
  { display:'PLAN SMOOTHIE HARUM MANIS (S.H.M)', date:'30/1/2022', aliases:['PLAN SMOOTHIE HARUM MANIS SHM'] },
  { display:'PLAN FAST LANE RBO (PFLRBO)', date:'18/7/2022', aliases:['PLAN FAST LANE RBO PFLRBO'] },
  { display:'EXTRA SAGUHATI -G12', date:'2022', aliases:['EXTRA SAGUHATI TSRMT 12','EXTRA SAGUHATI G 12'] },
  { display:'PLAN TASK FOR ENDING RBO (TFE)', date:'10/2/2022', aliases:['PLAN TASK FOR ENDING RBO TFE'] },
  { display:'PLAN MAMU UP', date:'26/11/2022', aliases:['PLAN MAMU UP'] },
  { display:'PLAN PAKAT BANTU RBO (PBR)', date:'12/1/2023', aliases:['PLAN PAKAT BANTU RBO PBR'] },
  { display:'SUPER BONUS TSR (SBT)', date:'4/7/2023', aliases:['SUPER BONUS TSR SBT'] },
  { display:'SUMBANGAN BANTUAN RBO TSRMT (SBR)', date:'5/10/2023', aliases:['SUMBANGAN BANTUAN RBO TSRMT SBR'] },
  { display:'FINAL AUTHORISATION RBO (FAR)', date:'2/7/2023', aliases:['FINAL AUTHORISATION RBO FAR'] },
  { display:'SUMBANGAN CLEARING PROCESSING (CPR)', date:'23/7/2023', aliases:['SUMBANGAN CLEARING PROCESSING CPR','SUMBANGAN CLEARING PROCESSING CPR BONUS AWALAN'] },
  { display:'SUMBANGAN SINAR KEGEMILANGAN (SSK)', date:'11/9/2023', aliases:['SUMBANGAN SINAR KEGEMILANGAN SSK'] },
  { display:'SEPTEMBER SUPER FAST (SSF)', date:'15/9/2023', aliases:['SEPTEMBER SUPER FAST SSF'] },
  { display:'SUMBANGAN CLEARING ACC (SCA)', date:'20/10/2023', aliases:['SUMBANGAN CLEARING ACC SCA'] },
  { display:'PLAN LAST DRAW RBO (PLDRBO)', date:'8/11/2023', aliases:['PLAN LAST DRAW RBO PLDRBO'] },
  { display:'YURAN PERINTIS RM10.00', date:'25/11/2023', aliases:['YURAN PERINTIS RM10','YURAN PERINTIS RM10 00'] },
  { display:'SUMBANGAN 2T RBO-TSRMT', date:'23/12/2023', aliases:['SUMBANGAN 2T RBO TSRMT'] },
  { display:'PLAN 3C (CLOSE,COUNTDOWN,CELEBRATION)', date:'18/1/2024', aliases:['PLAN 3C'] },
  { display:'SUMBANGAN BANTUAN KHAS APRIL 2024 RBO', date:'22/4/2024', aliases:['SUMBANGAN BANTUAN KHAS APRIL 2024 RBO','PLAN BANTUAN KHAS APRIL 2024 RBO'] },
  { display:'PLAN BANTUAN KHAS RBO/TSRMT MEI 1', date:'7/5/2024', aliases:['PLAN BANTUAN KHAS RBO TSRMT MEI 1'] },
  { display:'PLAN BANTUAN KHAS RBO/TSRMT MEI 2', date:'22/5/2024', aliases:['PLAN BANTUAN KHAS RBO TSRMT MEI 2'] },
  { display:'PORTION RAHMAH RBO V1 TSRMT', date:'28/5/2024', aliases:['PORTION RAHMAH RBO V1 TSRMT'] },
  { display:'PORTION RAHMAH RBO V2 TSRMT', date:'10/6/2024', aliases:['PORTION RAHMAH RBO V2 TSRMT'] },
  { display:'PLAN SINAR PELANGI', date:'1/9/2024', aliases:['PLAN SINAR PELANGI','PLAN SINAR PELANGI SPECIAL HADIAH SEMASA EVENT LOT'] },
  { display:'BANTUAN KHAS RBO KLCC UPFRONT OCT 2024-1', date:'1/10/2024', aliases:['BANTUAN KHAS RBO KLCC UPFRONT OCT 2024 1'] },
  { display:'BANTUAN KHAS RBO KLCC UPFRONT OCT 2024-2', date:'22/10/2024', aliases:['BANTUAN KHAS RBO KLCC UPFRONT OCT 2024 2'] },
  { display:'PLAN FLY HIGH RBO -TSRMT', date:'17/1/2025', aliases:['PLAN FLY HIGH RBO TSRMT'] },
  { display:'PLAN ADVANCE SYAWAL- VS1', date:'25/2/2025', aliases:['PLAN ADVANCE SYAWAL VS1'] },
  { display:'PLAN ADVANCE SYAWAL- VS2', date:'15/3/2025', aliases:['PLAN ADVANCE SYAWAL VS2'] },
  { display:'PLAN CRUCIAL RBO/TSRMT', date:'10/4/2025', aliases:['PLAN CRUCIAL RBO TSRMT'] },
  { display:'PLAN RBO INVOICES/ TSRMT', date:'11/7/2025', aliases:['PLAN RBO INVOICES TSRMT'] },
  { display:'PLAN FINAL TSRMT RBO 2026', date:'25/5/2026', aliases:['PLAN FINAL TSRTM RBO 2026','PLAN FINAL TSRMT RBO 2026'] }
];

// Normalize a plan name for matching: uppercase, collapse spaces, strip non-alphanumeric except spaces
function normPlan(s){ return String(s||'').toUpperCase().replace(/\\s+/g,' ').replace(/[^A-Z0-9 ]/g,'').trim(); }
// Further normalize: remove all spaces, convert G12<->TSRMT12 variants
function normPlanKey(s){ return normPlan(s).replace(/TSRMT ?12/g,'G12').replace(/\\s+/g,''); }

// Lookup plan in catalog by parsed namaPlan. Returns {order, display, date} or null.
function lookupPlanCatalog(namaPlan){
  if(!namaPlan) return null;
  const nk = normPlanKey(namaPlan);
  for(let i=0;i<PLAN_CATALOG.length;i++){
    const entry = PLAN_CATALOG[i];
    for(const alias of entry.aliases){
      if(normPlanKey(alias) === nk) return { order:i+1, display:entry.display, date:entry.date };
    }
  }
  // Fuzzy fallback: check if any alias is contained in namaPlan or vice versa
  const nn = normPlan(namaPlan);
  for(let i=0;i<PLAN_CATALOG.length;i++){
    const entry = PLAN_CATALOG[i];
    for(const alias of entry.aliases){
      const an = normPlan(alias);
      if(nn && an && (nn.includes(an) || an.includes(nn))) return { order:i+1, display:entry.display, date:entry.date };
    }
  }
  return null;
}

// OSB date lookup (kept from old map for OSB plans only)
const OSB_DATE_MAP = {
  'OSB VS1':'26/1/2023','OSB VS2':'14/7/2024','OSB VS3':'24/5/2025','OSB VS4':'27/6/2025','YURAN WEBSITE':'14/7/2024'
};
function lookupPlanDate(namaPlan){
  if(!namaPlan) return '';
  const norm = String(namaPlan).toUpperCase().replace(/\\s+/g,' ').trim();
  if(OSB_DATE_MAP[norm]) return OSB_DATE_MAP[norm];
  // Try catalog
  const cat = lookupPlanCatalog(namaPlan);
  if(cat) return cat.date;
  return '';
}`);

// ============================================================
// CHANGE 2: pivotPlanOrObRows — attach catalog info
// ============================================================
console.log('[2] pivotPlanOrObRows — attach catOrder + display name');
edit('pivotPlanOrObRows grouped init',
`      if(!grouped[namaPlan]) grouped[namaPlan] = { namaPlan, tarikh: lookupPlanDate(namaPlan), modal:0, pocketMoney:0, perintis:0, poLain:0, bonusExtra1Juta:0, ganjaran:{} };`,
`      if(!grouped[namaPlan]){
        const cat = lookupPlanCatalog(namaPlan);
        grouped[namaPlan] = {
          namaPlan: cat ? cat.display : namaPlan,
          tarikh: cat ? cat.date : lookupPlanDate(namaPlan),
          catOrder: cat ? cat.order : 999,
          modal:0, pocketMoney:0, perintis:0, poLain:0, bonusExtra1Juta:0, ganjaran:{}
        };
      }`);

// ============================================================
// CHANGE 3: renderPlanCard sort — catOrder
// ============================================================
console.log('[3] renderPlanCard sort → catOrder');
edit('renderPlanCard sort',
`  // Sort by TARIKH ascending (2018 → 2026)
  pivotRows.sort((a,b)=>{
    const da = parsePlanDateStr(a.tarikh);
    const db = parsePlanDateStr(b.tarikh);
    if(!da && !db) return 0;
    if(!da) return 1;
    if(!db) return -1;
    return da - db;
  });

  // SPEC SECTION 5: 8 columns — NO | NAMA PLAN | TARIKH (blue) | MODAL (red) | POCKET MONEY | PERINTIS | PO&LAIN-LAIN | JUMLAH IMBUHAN (bold black on blue bg)`,
`  // Sort by PLAN_CATALOG order (P01-P76) — NO date sorting per user request
  pivotRows.sort((a,b)=> (a.catOrder||999) - (b.catOrder||999) );

  // SPEC SECTION 5: 8 columns — NO | NAMA PLAN | TARIKH (blue) | MODAL (red) | POCKET MONEY | PERINTIS | PO&LAIN-LAIN | JUMLAH IMBUHAN (bold black on blue bg)`);

// ============================================================
// CHANGE 4: buildPlanRowsForPDF sort — catOrder
// ============================================================
console.log('[4] buildPlanRowsForPDF sort → catOrder');
edit('buildPlanRowsForPDF sort',
`  const pivotRows = pivotPlanOrObRows(currentMember.planRows);
  pivotRows.sort((a,b)=>{
    const da = parsePlanDateStr(a.tarikh);
    const db = parsePlanDateStr(b.tarikh);
    if(!da && !db) return 0;
    if(!da) return 1;
    if(!db) return -1;
    return da - db;
  });
  let totalModal = 0, totalPocket = 0, totalPerintis = 0, totalPoLain = 0, totalJumlah = 0;`,
`  const pivotRows = pivotPlanOrObRows(currentMember.planRows);
  pivotRows.sort((a,b)=> (a.catOrder||999) - (b.catOrder||999) );
  let totalModal = 0, totalPocket = 0, totalPerintis = 0, totalPoLain = 0, totalJumlah = 0;`);

// ============================================================
// CHANGE 5: buildGanjaranRowsForPDF sort — catOrder
// ============================================================
console.log('[5] buildGanjaranRowsForPDF sort → catOrder');
edit('buildGanjaranRowsForPDF sort',
`  const ganjRows = pivotRows.filter(r => Object.keys(r.ganjaran).length > 0);
  ganjRows.sort((a,b)=>{
    const da = parsePlanDateStr(a.tarikh);
    const db = parsePlanDateStr(b.tarikh);
    if(!da && !db) return 0;
    if(!da) return 1;
    if(!db) return -1;
    return da - db;
  });
  const body = ganjRows.map((r, idx) => {`,
`  const ganjRows = pivotRows.filter(r => Object.keys(r.ganjaran).length > 0);
  ganjRows.sort((a,b)=> (a.catOrder||999) - (b.catOrder||999) );
  const body = ganjRows.map((r, idx) => {`);

// ============================================================
// CHANGE 6: renderGanjaranCard sort — catOrder
// ============================================================
console.log('[6] renderGanjaranCard sort → catOrder');
edit('renderGanjaranCard sort',
`  // Sort ganjaran rows by TARIKH ascending
  ganjRows.sort((a,b)=>{
    const da = parsePlanDateStr(a.tarikh);
    const db = parsePlanDateStr(b.tarikh);
    if(!da && !db) return 0;
    if(!da) return 1;
    if(!db) return -1;
    return da - db;
  });
  // SPEC: GANJARAN table = NO | NAMA PLAN | REMARK (all ganjaran values combined into one remark cell)`,
`  // Sort ganjaran rows by PLAN_CATALOG order (P01-P76)
  ganjRows.sort((a,b)=> (a.catOrder||999) - (b.catOrder||999) );
  // SPEC: GANJARAN table = NO | NAMA PLAN | REMARK (all ganjaran values combined into one remark cell)`);

// ============================================================
// CHANGE 7: CSS — tarikh-col sky blue + bold; jumlah-col light green + black bold (data rows); total-row red+white override
// ============================================================
console.log('[7] CSS — tarikh-col + jumlah-col + total-row colors');

// Update the .pivot-table .jumlah-col rule (line ~723) — change from dark-blue bg/white text to light-green bg/black bold
edit('pivot-table .jumlah-col → light green bg + black bold',
`.pivot-table .jumlah-col {
  background: #1e3a8a; color: #fff; font-weight: 900;
}`,
`.pivot-table .jumlah-col {
  background: #d1fae5 !important; color: #000 !important; font-weight: 800 !important;
}`);

// Update the .pivot-table tr.total-row td.jumlah-col override → red bg + white
edit('pivot-table tr.total-row td.jumlah-col → red + white',
`.pivot-table tr.total-row td.jumlah-col {
  background: #1e3a8a; color: #fff;
}`,
`.pivot-table tr.total-row td.jumlah-col {
  background: #dc2626 !important; color: #fff !important;
}`);

// Update the bare .tarikh-col rule (line 755) — sky blue + bold
edit('.tarikh-col → sky blue + bold',
`.tarikh-col { color: #1e3a8a; font-weight: 600; }`,
`.tarikh-col { color: #0ea5e9; font-weight: 700; }`);

// Update the bare .jumlah-col rule (line 758) — light green + black bold
edit('.jumlah-col → light green + black bold',
`.jumlah-col { background: rgba(220,38,38,0.1); font-weight: 800; color: #7f1d1d; }`,
`.jumlah-col { background: #d1fae5 !important; font-weight: 800 !important; color: #000 !important; }`);

// Update the .total-row .jumlah-col rule (line 760) — keep red+white but make !important
edit('.total-row .jumlah-col → red + white !important',
`.total-row .jumlah-col { background: #991b1b !important; color: #fff !important; }`,
`.total-row .jumlah-col { background: #dc2626 !important; color: #fff !important; }`);

// CRITICAL FIX: .plan-table.col-table tr.total-row td was forcing color to amber (!important)
// which overrode the desired white text. Change to white.
edit('plan-table.col-table total-row td color → white (was amber)',
`.plan-table.col-table tr.total-row td { color: var(--amber) !important; }`,
`.plan-table.col-table tr.total-row td { color: #fff !important; background: #dc2626 !important; }`);

// Update responsive @media 900px rules — keep colors consistent
edit('Responsive 900px tarikh-col + jumlah-col colors',
`  .tarikh-col { min-width: 70px; color: #1e3a8a !important; font-weight: 600; }
  .modal-col { color: #dc2626 !important; font-weight: 600; }
  .jumlah-col { background: rgba(220,38,38,0.12); font-weight: 800; color: #7f1d1d !important; }`,
`  .tarikh-col { min-width: 70px; color: #0ea5e9 !important; font-weight: 700; }
  .modal-col { color: #dc2626 !important; font-weight: 600; }
  .jumlah-col { background: #d1fae5 !important; font-weight: 800 !important; color: #000 !important; }`);

// ============================================================
// CHANGE 8: PDF ahliFields — IC first, REMARK removed
// ============================================================
console.log('[8] PDF ahliFields — IC first, REMARK removed');
edit('ahliFields new order',
`  const ahliFields = [
    ['NAMA', getVal(ahli, isNamaField)],
    ['IC', formatICDisplay(icVal)],
    ['TEL', getVal(ahli, k => String(k).toUpperCase()==='TEL')],
    ['EMAIL', getVal(ahli, isEmailField)],
    ['ALAMAT', getVal(ahli, isAlamatField)],
    ['NAMA BANK', getVal(ahli, isBankField)],
    ['NO AKAUN', getVal(ahli, isNoAkaunField)],
    ['GROUP', getVal(ahli, k => String(k).toUpperCase().includes('GROUP'))],
    ['REMARK', getVal(ahli, isRemarkField) || '-']
  ];`,
`  const ahliFields = [
    ['IC', formatICDisplay(icVal)],
    ['NAMA', getVal(ahli, isNamaField)],
    ['TEL', getVal(ahli, k => String(k).toUpperCase()==='TEL')],
    ['EMAIL', getVal(ahli, isEmailField)],
    ['NAMA BANK', getVal(ahli, isBankField)],
    ['NO AKAUN', getVal(ahli, isNoAkaunField)],
    ['ALAMAT', getVal(ahli, isAlamatField)],
    ['GROUP', getVal(ahli, k => String(k).toUpperCase().includes('GROUP'))]
  ];`);

// ============================================================
// CHANGE 9: PDF JUMLAH KESELURUHAN table — full width, only last row red+white
// ============================================================
console.log('[9] PDF JUMLAH KESELURUHAN table — full width, only last row red');
edit('JUMLAH KESELURUHAN table — full width + only last row red',
`  // SPEC: JUMLAH KESELURUHAN table — centered on page
  const jumlahTableW = 160;
  const jumlahTableX = (pageW - jumlahTableW) / 2;
  doc.autoTable({
    startY: 62,
    head: [['PERKARA','JUMLAH MODAL','JUMLAH IMBUHAN']],
    body: [
      ['JUMLAH IMBUHAN Plan 2018-2026', fmtNum(planTotals.totalModal), fmtNum(planTotals.totalJumlah)],
      ['JUMLAH IMBUHAN REKOD OSB', fmtNum(obTotals.totalModal), fmtNum(obTotals.totalJumlah)],
      ['JUMLAH KESELURUHAN', fmtNum(grandModal), fmtNum(grandJumlah)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [220,38,38], textColor: [255,255,255], fontStyle: 'bold', fontSize: 10, halign: 'center' },
    bodyStyles: { fontSize: 10, textColor: [255,255,255], halign: 'center', fillColor: [220,38,38] },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 40, halign: 'right' },
      2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: jumlahTableX, right: jumlahTableX }
  });`,
`  // SPEC: JUMLAH KESELURUHAN table — full margin width, only LAST row red+white
  doc.autoTable({
    startY: 62,
    head: [['PERKARA','JUMLAH MODAL','JUMLAH IMBUHAN']],
    body: [
      ['JUMLAH IMBUHAN Plan 2018-2026', fmtNum(planTotals.totalModal), fmtNum(planTotals.totalJumlah)],
      ['JUMLAH IMBUHAN REKOD OSB', fmtNum(obTotals.totalModal), fmtNum(obTotals.totalJumlah)],
      ['JUMLAH KESELURUHAN', fmtNum(grandModal), fmtNum(grandJumlah)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [220,38,38], textColor: [255,255,255], fontStyle: 'bold', fontSize: 10, halign: 'center' },
    bodyStyles: { fontSize: 10, textColor: [40,40,40], halign: 'center' },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 45, halign: 'right' },
      2: { cellWidth: 45, halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: function(data){
      // Only the LAST body row (JUMLAH KESELURUHAN) gets red bg + white text
      if(data.section === 'body' && data.row.index === 2){
        data.cell.styles.fillColor = [220,38,38];
        data.cell.styles.textColor = [255,255,255];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: margin, right: margin }
  });`);

// ============================================================
// CHANGE 10: PDF JUMLAH KESELURUHAN IMBUHAN box — gold bg, BLACK bold text, bigger box
// ============================================================
console.log('[10] PDF JUMLAH KESELURUHAN IMBUHAN box — gold bg + BLACK bold');

edit('Box height + width',
`  let boxY = doc.lastAutoTable.finalY + 16;
  if(boxY > pageH - 70){ boxY = pageH - 70; }
  const boxW = 150, boxH = 36;`,
`  let boxY = doc.lastAutoTable.finalY + 16;
  if(boxY > pageH - 75){ boxY = pageH - 75; }
  const boxW = 170, boxH = 40;`);

edit('Box label + RM value',
`  // Label "JUMLAH KESELURUHAN IMBUHAN"
  doc.setFont('helvetica','bold');
  doc.setFontSize(11);
  doc.setTextColor(120, 80, 10);
  const labelText = 'JUMLAH KESELURUHAN IMBUHAN';
  const labelW = doc.getTextWidth(labelText);
  doc.text(labelText, (pageW - labelW)/2, boxY + 12);
  // Big RM value (red, bold, 16pt)
  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  const rmText = 'RM ' + fmtNum(grandJumlah);
  const rmW = doc.getTextWidth(rmText);
  doc.text(rmText, (pageW - rmW)/2, boxY + 26);`,
`  // Label "JUMLAH KESELURUHAN IMBUHAN"
  doc.setFont('helvetica','bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  const labelText = 'JUMLAH KESELURUHAN IMBUHAN';
  const labelW = doc.getTextWidth(labelText);
  doc.text(labelText, (pageW - labelW)/2, boxY + 13);
  // Big RM value (BLACK bold, 18pt)
  doc.setFont('helvetica','bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  const rmText = 'RM ' + fmtNum(grandJumlah);
  const rmW = doc.getTextWidth(rmText);
  doc.text(rmText, (pageW - rmW)/2, boxY + 28);`);

// ============================================================
// CHANGE 11: PDF SULIT box — bigger title + body + taller box
// ============================================================
console.log('[11] PDF SULIT box — bigger text + taller box');

edit('Sulit Y + box height',
`  let sulitY = boxY + boxH + 12;
  if(sulitY > pageH - 35){ sulitY = pageH - 35; }
  const sulitBoxW = pageW - margin*2 - 8;
  const sulitBoxH = 22;`,
`  let sulitY = boxY + boxH + 14;
  if(sulitY > pageH - 45){ sulitY = pageH - 45; }
  const sulitBoxW = pageW - margin*2 - 8;
  const sulitBoxH = 32;`);

edit('Sulit title font size 12 → 16',
`  // SULIT title
  doc.setFont('helvetica','bold');
  doc.setFontSize(12);
  doc.setTextColor(180, 20, 20);
  const sulitTitle = 'SULIT';
  const sulitTitleW = doc.getTextWidth(sulitTitle);
  doc.text(sulitTitle, (pageW - sulitTitleW)/2, sulitY + 7);`,
`  // SULIT title
  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  doc.setTextColor(180, 20, 20);
  const sulitTitle = 'SULIT';
  const sulitTitleW = doc.getTextWidth(sulitTitle);
  doc.text(sulitTitle, (pageW - sulitTitleW)/2, sulitY + 9);`);

edit('Sulit body font 7 → 9 + spacing',
`  // SULIT body text
  doc.setFont('helvetica','normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 30, 30);
  const sulitText = 'Maklumat di dalam dokumen ini adalah SULIT dan ditujukan khas untuk penerima yang sah sahaja. Sebarang akses, penyebaran, atau penyalinan tanpa kebenaran adalah DILARANG.';
  const sulitLines = doc.splitTextToSize(sulitText, sulitBoxW - 8);
  sulitLines.forEach((line, i) => {
    const lineW = doc.getTextWidth(line);
    doc.text(line, (pageW - lineW)/2, sulitY + 12 + i*3.8);
  });`,
`  // SULIT body text
  doc.setFont('helvetica','normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 30, 30);
  const sulitText = 'Maklumat di dalam dokumen ini adalah SULIT dan ditujukan khas untuk penerima yang sah sahaja. Sebarang akses, penyebaran, atau penyalinan tanpa kebenaran adalah DILARANG.';
  const sulitLines = doc.splitTextToSize(sulitText, sulitBoxW - 10);
  sulitLines.forEach((line, i) => {
    const lineW = doc.getTextWidth(line);
    doc.text(line, (pageW - lineW)/2, sulitY + 15 + i*4.8);
  });`);

// ============================================================
// CHANGE 12: PDF TARIKH color — sky blue (was dark blue)
// ============================================================
console.log('[12] PDF TARIKH color → sky blue');

edit('PLAN autoTable TARIKH → sky blue',
`        2: { cellWidth: 22, halign: 'center', textColor: [30,58,138] /* TARIKH dark blue */ },
        3: { cellWidth: 18, halign: 'right', textColor: [220,38,38] /* MODAL red */ },`,
`        2: { cellWidth: 22, halign: 'center', textColor: [14,165,233] /* TARIKH sky blue */ },
        3: { cellWidth: 18, halign: 'right', textColor: [220,38,38] /* MODAL red */ },`);

edit('OSB autoTable TARIKH → sky blue',
`        2: { cellWidth: 18, halign: 'center', textColor: [30,58,138] /* TARIKH dark blue */ },
        3: { cellWidth: 14, halign: 'right', textColor: [220,38,38] /* MODAL red */ },`,
`        2: { cellWidth: 18, halign: 'center', textColor: [14,165,233] /* TARIKH sky blue */ },
        3: { cellWidth: 14, halign: 'right', textColor: [220,38,38] /* MODAL red */ },`);

// ============================================================
// CHANGE 14: PDF PLAN/OSB JUMLAH column — gold bg + black bold (data rows)
// ============================================================
console.log('[14] PDF PLAN/OSB JUMLAH column → gold bg + black bold');

edit('PLAN autoTable JUMLAH col → gold + black',
`        7: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: [255,255,255], fillColor: [220,38,38] /* JUMLAH red bg */ }`,
`        7: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: [0,0,0], fillColor: [255,215,0] /* JUMLAH IMBUHAN gold bg, black text */ }`);

edit('OSB autoTable JUMLAH col → gold + black',
`        8: { cellWidth: 18, halign: 'right', fontStyle: 'bold', textColor: [255,255,255], fillColor: [220,38,38] /* JUMLAH red bg */ }`,
`        8: { cellWidth: 18, halign: 'right', fontStyle: 'bold', textColor: [0,0,0], fillColor: [255,215,0] /* JUMLAH IMBUHAN gold bg, black text */ }`);

// ============================================================
// CHANGE 15: Clock display — 3-line stacked (TARIKH bold, HARI middle, MASA white AM/PM)
// ============================================================
console.log('[15] Clock — 3-line stacked + CSS + updateClock');

// Home screen clockPill
edit('Home clockPill HTML',
`      <span class="topbar-clock" id="clockPill">--:--:--</span>`,
`      <span class="topbar-clock" id="clockPill"><div class="clock-tarikh">--/--/----</div><div class="clock-hari">---</div><div class="clock-masa">--:--:-- --</div></span>`);

// Member screen memberClockPill
edit('Member memberClockPill HTML',
`      <span class="topbar-clock" id="memberClockPill">--:--:--</span>`,
`      <span class="topbar-clock" id="memberClockPill"><div class="clock-tarikh">--/--/----</div><div class="clock-hari">---</div><div class="clock-masa">--:--:-- --</div></span>`);

// Add new clock CSS right after the existing .topbar-clock rule (don't replace it)
edit('Add new clock CSS rules after .topbar-clock',
`.topbar-clock{ background:rgba(0,0,0,0.4); border:1px dashed var(--amber);
  padding:0.35rem 0.7rem; border-radius:8px; color:var(--amber-light);
  font-family:'Courier New',monospace; font-size:0.8rem; font-weight:700; }`,
`.topbar-clock{ background:rgba(0,0,0,0.4); border:1px dashed var(--amber);
  padding:0.35rem 0.7rem; border-radius:8px; color:var(--amber-light);
  font-family:'Courier New',monospace; font-size:0.8rem; font-weight:700; }
.topbar-clock{ display:inline-flex !important; flex-direction:column; align-items:center; gap:0; line-height:1.15; }
.topbar-clock .clock-tarikh{ font-size:0.82rem; font-weight:900; color:var(--amber); letter-spacing:0.3px; }
.topbar-clock .clock-hari{ font-size:0.6rem; font-weight:700; color:var(--amber); }
.topbar-clock .clock-masa{ font-size:0.62rem; font-weight:800; color:#fff; }`);

// Replace updateClock function entirely
edit('updateClock function — 3-line stacked',
`function updateClock(){
  const d = new Date();
  const pad = n => String(n).padStart(2,'0');
  const days = ['AHAD','ISNIN','SELASA','RABU','KHAMIS','JUMAAT','SABTU'];
  const months = ['JAN','FEB','MAC','APR','MEI','JUN','JUL','OGOS','SEP','OKT','NOV','DIS'];
  const dayName = days[d.getDay()];
  const dateStr = pad(d.getDate())+'/'+months[d.getMonth()]+'/'+d.getFullYear();
  const timeStr = pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
  const fullStr = dayName+' '+dateStr+' '+timeStr;
  const homeClock = document.getElementById('clockPill');
  if(homeClock) homeClock.textContent = fullStr;
  const memberClock = document.getElementById('memberClockPill');
  if(memberClock) memberClock.textContent = fullStr;
}`,
`function updateClock(){
  const d = new Date();
  const pad = n => String(n).padStart(2,'0');
  const days = ['AHAD','ISNIN','SELASA','RABU','KHAMIS','JUMAAT','SABTU'];
  const months = ['JAN','FEB','MAC','APR','MEI','JUN','JUL','OGOS','SEP','OKT','NOV','DIS'];
  const dayName = days[d.getDay()];
  const dateStr = pad(d.getDate())+' '+months[d.getMonth()]+' '+d.getFullYear();
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if(h === 0) h = 12;
  const timeStr = pad(h)+':'+pad(d.getMinutes())+':'+pad(d.getSeconds())+' '+ampm;
  const setClock = function(id){
    const el = document.getElementById(id);
    if(!el) return;
    const t = el.querySelector('.clock-tarikh'); if(t) t.textContent = dateStr;
    const h2 = el.querySelector('.clock-hari'); if(h2) h2.textContent = dayName;
    const m2 = el.querySelector('.clock-masa'); if(m2) m2.textContent = timeStr;
  };
  setClock('clockPill');
  setClock('memberClockPill');
}`);

// ============================================================
// CHANGE 16: Supabase auto-refresh — add .select() + merge confirmed data
// ============================================================
console.log('[16] Supabase save — add .select() + merge confirmed data');

// saveAhliEdit: add .select() + merge
edit('saveAhliEdit — add .select() + merge',
`    // Step 1: Update the ahli record
    const { error } = await supa.from(window.TABLES.ahli)
      .update(updates)
      .eq(icKey || window.IC_COLUMNS.ahli, icVal);
    if(error){ showToast('Gagal simpan: '+error.message, 'error'); return; }`,
`    // Step 1: Update the ahli record (add .select() to force round-trip confirmation)
    const { data: updatedData, error } = await supa.from(window.TABLES.ahli)
      .update(updates)
      .eq(icKey || window.IC_COLUMNS.ahli, icVal)
      .select();
    if(error){ showToast('Gagal simpan: '+error.message, 'error'); return; }
    // Merge confirmed server data immediately (auto-refresh, no manual Supabase refresh needed)
    if(updatedData && updatedData[0]) Object.assign(currentMember.ahli, updatedData[0]);`);

// saveWarisEdit: existing-waris update — add .select() + merge
edit('saveWarisEdit existing-update — add .select() + merge',
`  try {
    const updates = {...editBuffer};
    const { error } = await supa.from(window.TABLES.waris)
      .update(updates).eq(icKey, icVal);
    if(error){ showToast('Gagal simpan: '+error.message, 'error'); return; }`,
`  try {
    const updates = {...editBuffer};
    const { data: updatedWarisData, error } = await supa.from(window.TABLES.waris)
      .update(updates).eq(icKey, icVal).select();
    if(error){ showToast('Gagal simpan: '+error.message, 'error'); return; }
    if(updatedWarisData && updatedWarisData[0]) Object.assign(currentMember.waris, updatedWarisData[0]);`);

// Add a clarifying comment to the new-waris insert (which already uses .select())
edit('saveWarisEdit new-insert — clarify comment',
`      const { data, error } = await supa.from(window.TABLES.waris).insert(newRow).select();
      if(error){ showToast('Gagal tambah waris: '+error.message, 'error'); return; }`,
`      // .select() already present — forces round-trip confirmation so we can merge server data
      const { data, error } = await supa.from(window.TABLES.waris).insert(newRow).select();
      if(error){ showToast('Gagal tambah waris: '+error.message, 'error'); return; }`);

// ============================================================
// CHANGE 17: Update page.tsx redirect (handled as direct file edit below)
// CHANGE 18: Update eslint.config.mjs ignores (handled as direct file edit below)
// ============================================================

// Update build-version comment for traceability
edit('Update build version meta',
`<meta name="build-version" content="1782171887147-portal4" />`,
`<meta name="build-version" content="1782171887147-portal5" />`, { optional: true });

// ============================================================
// Write result
// ============================================================
fs.writeFileSync(DST, html, 'utf8');
console.log('\n=== DONE: ' + editCount + ' edits applied ===');
console.log('Source: ' + SRC + ' (' + origLen + ' chars)');
console.log('Output: ' + DST + ' (' + html.length + ' chars, delta: ' + (html.length - origLen) + ')');
