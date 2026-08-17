const demoState = {
  currentScreen: 'login',
  currentRole: null,
  leaveRequests: [
    {
      id: 'L-001',
      child: 'ด.ญ. กานต์พิชชา ใจดี',
      nickname: 'น้องข้าวหอม',
      parent: 'คุณสมชาย ใจดี',
      type: 'ลาป่วย',
      date: '18 ส.ค. 2569',
      reason: 'มีไข้และต้องพักรักษาตัวที่บ้าน',
      status: 'PENDING',
      createdAt: '17 ส.ค. 2569 10:15 น.',
      approvedBy: null
    }
  ],
  attendance: [
    { id: 'S01', name: 'น้องข้าวหอม', fullName: 'กานต์พิชชา ใจดี', status: 'PRESENT', time: '08:05 น.' },
    { id: 'S02', name: 'น้องภูมิ', fullName: 'ภูมิพัฒน์ มีสุข', status: 'PRESENT', time: '08:01 น.' },
    { id: 'S03', name: 'น้องขิม', fullName: 'ขวัญฤทัย พงษ์ดี', status: 'LEAVE', time: '-' },
    { id: 'S04', name: 'น้องปั้น', fullName: 'ปัณณวิชญ์ วัฒนะ', status: 'ABSENT', time: '-' },
    { id: 'S05', name: 'น้องมิน', fullName: 'มินตรา เจริญศรี', status: 'PRESENT', time: '08:03 น.' },
    { id: 'S06', name: 'น้องฟ้า', fullName: 'ฟ้ารดา พูลผล', status: 'PRESENT', time: '07:58 น.' }
  ],
  attendanceSummary: { present: 21, leave: 2, absent: 1 },
  development: { physical: 90, emotional: 85, social: 88, intellectual: 92 },
  developmentNote: 'สามารถจับคู่สีและรูปทรงได้ดี รอคิวและแบ่งปันอุปกรณ์กับเพื่อนได้',
  auditLogs: [
    ['10:15','คุณสมชาย ใจดี','ผู้ปกครอง','SUBMIT_LEAVE','ส่งคำขอลาป่วยของน้องข้าวหอม'],
    ['09:05','ครูอรทัย','ครู','ATTENDANCE','บันทึกการเข้าเรียนห้องอนุบาล 2/1'],
    ['08:42','ครูอรทัย','ครู','VIEW_CHILD','เปิดข้อมูลเด็กในห้องที่รับผิดชอบ'],
    ['08:30','ผู้บริหารระบบ','ผู้บริหาร','VIEW_DASHBOARD','เปิด Dashboard ภาพรวม'],
    ['08:15','ระบบ','System','AUTH','ตรวจสอบสิทธิ์ผู้ใช้งานสำเร็จ'],
    ['08:00','ระบบ','System','BACKUP_CHECK','ตรวจสอบสถานะการสำรองข้อมูล']
  ]
};

const modules = [
  ['01','ทะเบียนเด็กและผู้ใช้งาน','จัดเก็บข้อมูลเด็ก ผู้ปกครอง ครู ห้องเรียน และความสัมพันธ์ของบัญชีกับเด็ก'],
  ['02','เช็กชื่อการเข้าเรียน','ครูบันทึก มา / ลา / ขาด และผู้ปกครองตรวจสอบประวัติได้'],
  ['03','คำขอแจ้งลา','ผู้ปกครองส่งคำขอ ครูตรวจสอบ และสถานะถูกเก็บย้อนหลัง'],
  ['04','ข่าวสารและประกาศ','เผยแพร่ข่าวสาร กิจกรรม และประกาศตามกลุ่มเป้าหมาย'],
  ['05','รายการอาหารประจำวัน','แสดงเมนูอาหารและข้อมูลที่เกี่ยวข้องกับการดูแลประจำวัน'],
  ['06','กิจกรรมประจำวัน','ครูบันทึกกิจกรรมการเรียนรู้และหลักฐานประกอบ'],
  ['07','พัฒนาการรายบุคคล','บันทึกพัฒนาการ 4 ด้านจากการสังเกตและกิจกรรม'],
  ['08','Dashboard และรายงาน','ผู้บริหารดู KPI แนวโน้ม และรายงานตามช่วงเวลา']
];

const guidedSteps = [
  { screen:'asis', title:'เริ่มจากปัญหาของกระบวนการเดิม', description:'ชี้ให้เห็นข้อมูลกระจัดกระจาย งานซ้ำ การติดตามคำขอยาก และการสรุปรายงานล่าช้า' },
  { screen:'overview', title:'อธิบายแนวคิดระบบกลาง', description:'เน้น Single Source of Truth และการแบ่งสิทธิ์ผู้ใช้ 3 บทบาท' },
  { screen:'parent', role:'PARENT', tab:'leave', title:'ผู้ปกครองส่งคำขอแจ้งลา', description:'กรอกประเภท วันที่ และเหตุผล แล้วกดส่งคำขอ เพื่อสร้างสถานะ PENDING' },
  { screen:'teacher', role:'TEACHER', tab:'leave', title:'ครูได้รับคำขอในระบบเดียวกัน', description:'ชี้ให้เห็นคำขอที่ผู้ปกครองเพิ่งส่ง และกด “อนุมัติ” เพื่อเปลี่ยนสถานะ' },
  { screen:'parent', role:'PARENT', tab:'leave', title:'ผู้ปกครองเห็นสถานะที่เปลี่ยนแล้ว', description:'แสดงว่าผู้ปกครองไม่ต้องไล่ถามในแชต เพราะสถานะตรวจสอบย้อนหลังได้' },
  { screen:'teacher', role:'TEACHER', tab:'attendance', title:'ครูเช็กชื่อในหน้าเดียว', description:'กดสถานะของน้องข้าวหอมเพื่อแสดงว่าข้อมูลการมาเรียนถูกอัปเดตจากงานประจำวัน' },
  { screen:'teacher', role:'TEACHER', tab:'development', title:'ครูบันทึกพัฒนาการ 4 ด้าน', description:'อธิบายว่าเป็นการบันทึกจากการสังเกต ไม่ใช่การวินิจฉัยทางการแพทย์' },
  { screen:'executive', role:'EXECUTIVE', tab:'dashboard', title:'ผู้บริหารเห็นภาพรวมจากข้อมูลกลาง', description:'ชี้ KPI การมาเรียน แนวโน้ม และภาพรวมพัฒนาการโดยไม่ต้องรอรวบรวมไฟล์' },
  { screen:'privacy', title:'ปิดด้วย Privacy by Design', description:'อธิบาย Parent เห็นเฉพาะลูกตนเอง ครูเห็นเฉพาะห้องที่รับผิดชอบ และผู้บริหารเห็นตามหน้าที่' },
  { screen:'kpi', title:'จบด้วยเกณฑ์ความสำเร็จที่วัดได้', description:'ย้ำ Functional ≥95%, Task completion ≥90%, Satisfaction ≥4.00 และไม่มี Cross-account access' }
];

let guidedIndex = 0;
let guidedActive = false;

function qs(selector){ return document.querySelector(selector); }
function qsa(selector){ return [...document.querySelectorAll(selector)]; }

function showScreen(screen){
  demoState.currentScreen = screen;
  qsa('.screen').forEach(el => el.classList.remove('active'));
  const target = qs(`#screen-${screen}`);
  if (target) target.classList.add('active');
  qsa('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const nav = qs(`.nav-btn[data-screen="${screen}"]`) || qs(`.nav-btn[data-role="${screen === 'parent' ? 'PARENT' : screen === 'teacher' ? 'TEACHER' : screen === 'executive' ? 'EXECUTIVE' : ''}"]`);
  if(nav) nav.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  qs('#sidebar')?.classList.remove('open');
}

function openRole(role){
  demoState.currentRole = role;
  const map = { PARENT:'parent', TEACHER:'teacher', EXECUTIVE:'executive' };
  showScreen(map[role]);
}
window.openRole = openRole;

function switchTab(group, tab){
  qsa(`[data-${group}-tab]`).forEach(btn => btn.classList.toggle('active', btn.dataset[`${group}Tab`] === tab));
  qsa(`#screen-${group === 'exec' ? 'executive' : group} .role-tab`).forEach(el => el.classList.remove('active'));
  const id = group === 'exec' ? `#exec-tab-${tab}` : `#${group}-tab-${tab}`;
  qs(id)?.classList.add('active');
}

function statusBadge(status){
  const map = {
    PENDING:['รอครูอนุมัติ','status-pending'],
    APPROVED:['อนุมัติแล้ว','status-approved'],
    REJECTED:['ไม่อนุมัติ','status-rejected'],
    PRESENT:['มาเรียน','status-present'],
    LEAVE:['ลา','status-leave'],
    ABSENT:['ขาด','status-rejected']
  };
  const [text,cls] = map[status] || [status,''];
  return `<span class="status ${cls}">${text}</span>`;
}

function renderParentLeave(){
  const container = qs('#parent-leave-history');
  if(!container) return;
  container.innerHTML = demoState.leaveRequests.map(req => `
    <article class="leave-item">
      <div class="leave-item-head"><div><strong>${req.type} • ${req.date}</strong><p>${req.reason}</p></div>${statusBadge(req.status)}</div>
      <p>ส่งเมื่อ ${req.createdAt}${req.approvedBy ? ` • ดำเนินการโดย ${req.approvedBy}` : ''}</p>
    </article>`).join('');
  const latest = demoState.leaveRequests[0];
  qs('#parent-latest-leave').innerHTML = latest ? `<article class="leave-item"><div class="leave-item-head"><div><strong>${latest.type} • ${latest.date}</strong><p>${latest.reason}</p></div>${statusBadge(latest.status)}</div></article>` : '<div class="empty-state">ยังไม่มีคำขอแจ้งลา</div>';
  qs('#parent-leave-count').textContent = demoState.leaveRequests.length;
}

function renderTeacherLeaves(){
  const pending = demoState.leaveRequests.filter(r => r.status === 'PENDING');
  qs('#teacher-pending-badge').textContent = pending.length;
  qs('#exec-pending-count').textContent = pending.length;
  qs('#teacher-pending-preview').innerHTML = pending.length ? `<article class="leave-item"><div class="leave-item-head"><div><strong>${pending[0].nickname} • ${pending[0].type}</strong><p>${pending[0].date} — ${pending[0].reason}</p></div>${statusBadge('PENDING')}</div></article>` : '<div class="empty-state">ไม่มีคำขอรอตรวจสอบ</div>';
  qs('#teacher-leave-list').innerHTML = demoState.leaveRequests.map(req => `
    <article class="leave-item">
      <div class="leave-item-head">
        <div><strong>${req.nickname} (${req.child})</strong><p>ผู้ปกครอง: ${req.parent}</p><p>${req.type} • ${req.date}</p><p>เหตุผล: ${req.reason}</p></div>
        ${statusBadge(req.status)}
      </div>
      ${req.status === 'PENDING' ? `<div class="leave-actions"><button class="btn btn-teacher btn-sm" onclick="updateLeaveStatus('${req.id}','APPROVED')">✓ อนุมัติ</button><button class="btn btn-ghost btn-sm" onclick="updateLeaveStatus('${req.id}','REJECTED')">ไม่อนุมัติ</button></div>` : `<p>ดำเนินการโดย ${req.approvedBy || 'ครูอรทัย'}</p>`}
    </article>`).join('');
}

function updateLeaveStatus(id,status){
  const req = demoState.leaveRequests.find(r=>r.id===id);
  if(!req) return;
  req.status = status;
  req.approvedBy = 'ครูอรทัย';
  if(status === 'APPROVED'){
    const child = demoState.attendance.find(a=>a.id==='S01');
    if(child){ child.status = 'LEAVE'; child.time='-'; }
    demoState.attendanceSummary.present = 20;
    demoState.attendanceSummary.leave = 3;
    addAudit('11:08','ครูอรทัย','ครู','APPROVE_LEAVE','อนุมัติคำขอลาของน้องข้าวหอม');
  } else {
    addAudit('11:08','ครูอรทัย','ครู','REJECT_LEAVE','ไม่อนุมัติคำขอลาของน้องข้าวหอม');
  }
  renderAll();
  showModal(status === 'APPROVED' ? 'อนุมัติคำขอเรียบร้อย' : 'บันทึกผลไม่อนุมัติแล้ว', 'สถานะถูกอัปเดตใน Mockup และผู้ปกครองสามารถเห็นผลได้ทันที');
}
window.updateLeaveStatus = updateLeaveStatus;

function renderAttendance(){
  const list = qs('#teacher-attendance-list');
  list.innerHTML = demoState.attendance.map(st => `
    <div class="attendance-row">
      <div class="student-meta"><strong>${st.name} (${st.fullName})</strong><span>${st.id==='S01' ? 'ผู้ปกครอง: คุณสมชาย ใจดี' : 'ห้องอนุบาล 2/1'}</span></div>
      <div class="attendance-buttons">
        <button class="${st.status==='PRESENT'?'active-present':''}" onclick="setAttendance('${st.id}','PRESENT')">✓ มา</button>
        <button class="${st.status==='LEAVE'?'active-leave':''}" onclick="setAttendance('${st.id}','LEAVE')">ลา</button>
        <button class="${st.status==='ABSENT'?'active-absent':''}" onclick="setAttendance('${st.id}','ABSENT')">ขาด</button>
      </div>
    </div>`).join('');
  qs('#attendance-summary-text').textContent = `มา ${demoState.attendanceSummary.present} • ลา ${demoState.attendanceSummary.leave} • ขาด ${demoState.attendanceSummary.absent}`;
  qs('#teacher-present-count').textContent = demoState.attendanceSummary.present;
  qs('#teacher-leave-count').textContent = demoState.attendanceSummary.leave;
  qs('#teacher-absent-count').textContent = demoState.attendanceSummary.absent;
  qs('#exec-present-count').textContent = demoState.attendanceSummary.present;
  qs('#exec-attendance-rate').textContent = `${Math.round((demoState.attendanceSummary.present/24)*100)}%`;
  const child = demoState.attendance.find(a=>a.id==='S01');
  qs('#parent-today-status').textContent = child.status === 'PRESENT' ? 'มาเรียน' : child.status === 'LEAVE' ? 'แจ้งลา' : 'ขาดเรียน';
  qs('#parent-today-time').textContent = child.time;
  qs('#parent-attendance-table').innerHTML = [
    ['17 ส.ค. 2569',child.status,child.time,'ครูอรทัย'],
    ['14 ส.ค. 2569','PRESENT','08:02 น.','ครูอรทัย'],
    ['13 ส.ค. 2569','PRESENT','08:07 น.','ครูอรทัย'],
    ['12 ส.ค. 2569','LEAVE','-','คำขอผู้ปกครอง']
  ].map(row=>`<tr><td>${row[0]}</td><td>${statusBadge(row[1])}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`).join('');
}

function setAttendance(id,status){
  const target = demoState.attendance.find(a=>a.id===id);
  if(!target) return;
  if(target.status === status) return;
  const summary = demoState.attendanceSummary;
  const decrement = s => { if(s==='PRESENT') summary.present--; if(s==='LEAVE') summary.leave--; if(s==='ABSENT') summary.absent--; };
  const increment = s => { if(s==='PRESENT') summary.present++; if(s==='LEAVE') summary.leave++; if(s==='ABSENT') summary.absent++; };
  decrement(target.status); increment(status);
  target.status = status; target.time = status==='PRESENT' ? '11:10 น.' : '-';
  addAudit('11:10','ครูอรทัย','ครู','ATTENDANCE_UPDATE',`อัปเดตสถานะ ${target.name} เป็น ${status}`);
  renderAll();
  toast('อัปเดตสถานะการเข้าเรียนใน Mockup แล้ว');
}
window.setAttendance = setAttendance;

function renderDevelopment(){
  const labels = [['physical','ร่างกาย'],['emotional','อารมณ์-จิตใจ'],['social','สังคม'],['intellectual','สติปัญญา']];
  const bars = labels.map(([key,label]) => `<div class="dev-bar-row"><strong>${label}</strong><div class="bar-track"><div class="bar-fill" style="width:${demoState.development[key]}%"></div></div><span>${demoState.development[key]}%</span></div>`).join('');
  qs('#parent-development-bars').innerHTML = bars;
  qs('#exec-development-bars').innerHTML = bars;
  qs('#parent-development-detail').textContent = demoState.developmentNote;
  qs('#parent-dev-note').textContent = demoState.developmentNote;
  qs('#teacher-dev-inputs').innerHTML = labels.map(([key,label])=>`<div class="dev-input-row"><strong>${label}</strong><input type="range" min="50" max="100" value="${demoState.development[key]}" data-dev-key="${key}"><span>${demoState.development[key]}%</span></div>`).join('');
  qsa('[data-dev-key]').forEach(input=>input.addEventListener('input',e=>{ e.target.nextElementSibling.textContent=`${e.target.value}%`; }));
}

function renderChart(){
  const data = [['จ',88],['อ',92],['พ',83],['พฤ',91],['ศ',Math.round((demoState.attendanceSummary.present/24)*100)]];
  qs('#attendance-chart').innerHTML = data.map(([day,val])=>`<div class="chart-col"><div class="chart-bar" style="height:${Math.max(35,val*1.8)}px"></div><span>${day}<br><strong>${val}%</strong></span></div>`).join('');
}

function renderAudit(){
  qs('#audit-table').innerHTML = demoState.auditLogs.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('');
  qs('#exec-audit-count').textContent = demoState.auditLogs.length;
}

function addAudit(time,user,role,event,detail){
  demoState.auditLogs.unshift([time,user,role,event,detail]);
}

function renderModules(){
  qs('#module-grid').innerHTML = modules.map(m=>`<article class="module-card"><span class="module-number">MODULE ${m[0]}</span><h3>${m[1]}</h3><p>${m[2]}</p></article>`).join('');
}

function renderAll(){
  renderParentLeave();
  renderTeacherLeaves();
  renderAttendance();
  renderDevelopment();
  renderChart();
  renderAudit();
  renderModules();
}

function toast(message){
  const el = qs('#toast');
  el.textContent = message; el.style.display='block';
  clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>el.style.display='none',2200);
}

function showModal(title,message){
  qs('#modal-title').textContent=title; qs('#modal-message').textContent=message;
  qs('#confirm-modal').classList.add('show'); qs('#confirm-modal').setAttribute('aria-hidden','false');
}

function runGuidedStep(){
  const step = guidedSteps[guidedIndex];
  if(step.role) openRole(step.role); else showScreen(step.screen);
  if(step.tab){
    if(step.screen==='parent') switchTab('parent',step.tab);
    if(step.screen==='teacher') switchTab('teacher',step.tab);
    if(step.screen==='executive') switchTab('exec',step.tab);
  }
  qs('#guided-step-label').textContent = `ขั้นตอน ${guidedIndex+1}/${guidedSteps.length}`;
  qs('#guided-title').textContent = step.title;
  qs('#guided-description').textContent = step.description;
  qs('#guided-progress-bar').style.width = `${((guidedIndex+1)/guidedSteps.length)*100}%`;
  qs('#guided-prev').disabled = guidedIndex===0;
  qs('#guided-next').textContent = guidedIndex===guidedSteps.length-1 ? 'จบ Demo ✓' : 'ถัดไป →';
}

function startGuided(){
  guidedActive=true; guidedIndex=0; qs('#guided-panel').classList.add('show'); runGuidedStep();
}
function exitGuided(){ guidedActive=false; qs('#guided-panel').classList.remove('show'); }

function resetDemo(){
  location.reload();
}

document.addEventListener('DOMContentLoaded',()=>{
  renderAll();
  qsa('[data-screen]').forEach(btn=>btn.addEventListener('click',()=>showScreen(btn.dataset.screen)));
  qsa('[data-screen-jump]').forEach(btn=>btn.addEventListener('click',()=>showScreen(btn.dataset.screenJump)));
  qsa('[data-role]').forEach(btn=>btn.addEventListener('click',()=>openRole(btn.dataset.role)));
  qsa('[data-role-login]').forEach(btn=>btn.addEventListener('click',()=>openRole(btn.dataset.roleLogin)));
  qsa('[data-parent-tab]').forEach(btn=>btn.addEventListener('click',()=>switchTab('parent',btn.dataset.parentTab)));
  qsa('[data-teacher-tab]').forEach(btn=>btn.addEventListener('click',()=>switchTab('teacher',btn.dataset.teacherTab)));
  qsa('[data-exec-tab]').forEach(btn=>btn.addEventListener('click',()=>switchTab('exec',btn.dataset.execTab)));
  qsa('[data-parent-tab-jump]').forEach(btn=>btn.addEventListener('click',()=>switchTab('parent',btn.dataset.parentTabJump)));
  qsa('[data-teacher-tab-jump]').forEach(btn=>btn.addEventListener('click',()=>switchTab('teacher',btn.dataset.teacherTabJump)));

  qs('#leave-form').addEventListener('submit',e=>{
    e.preventDefault();
    const req = {
      id:`L-${Date.now()}`,
      child:'ด.ญ. กานต์พิชชา ใจดี',nickname:'น้องข้าวหอม',parent:'คุณสมชาย ใจดี',
      type:qs('#leave-type').value,
      date:new Date(qs('#leave-date').value).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'}),
      reason:qs('#leave-reason').value.trim() || 'ไม่ระบุ', status:'PENDING', createdAt:'17 ส.ค. 2569 11:05 น.', approvedBy:null
    };
    demoState.leaveRequests.unshift(req);
    addAudit('11:05','คุณสมชาย ใจดี','ผู้ปกครอง','SUBMIT_LEAVE',`ส่งคำขอ${req.type}ของน้องข้าวหอม`);
    renderAll();
    showModal('ส่งคำขอแจ้งลาสำเร็จ','สถานะเริ่มต้นคือ “รอครูอนุมัติ” จากนั้นเปลี่ยนไปบทบาทครูเพื่อสาธิตขั้นตอนถัดไป');
  });

  qs('#development-form').addEventListener('submit',e=>{
    e.preventDefault();
    qsa('[data-dev-key]').forEach(input=> demoState.development[input.dataset.devKey]=Number(input.value));
    demoState.developmentNote = qs('#dev-note').value.trim();
    addAudit('11:12','ครูอรทัย','ครู','UPDATE_DEVELOPMENT','บันทึกพัฒนาการ 4 ด้านของน้องข้าวหอม');
    renderAll();
    showModal('บันทึกพัฒนาการเรียบร้อย','ข้อมูล Mockup ถูกสะท้อนไปยังมุมมองผู้ปกครองและ Dashboard ผู้บริหารแล้ว');
  });

  qs('#report-form').addEventListener('submit',e=>{
    e.preventDefault();
    const type=qs('#report-type').value;
    qs('#report-preview').innerHTML = `<div class="report-result"><div><span>ประเภทรายงาน</span><strong>${type}</strong></div><div><span>จำนวนนักเรียน</span><strong>24 คน</strong></div><div><span>อัตราการมาเรียนเฉลี่ย</span><strong>${Math.round((demoState.attendanceSummary.present/24)*100)}%</strong></div><div><span>คำขอลารออนุมัติ</span><strong>${demoState.leaveRequests.filter(r=>r.status==='PENDING').length} รายการ</strong></div><button class="btn btn-executive" type="button" onclick="toast('Mockup: ตัวอย่างการส่งออก PDF / CSV')">⬇ ส่งออก PDF / CSV (Mockup)</button></div>`;
    addAudit('11:15','ผู้บริหารระบบ','ผู้บริหาร','GENERATE_REPORT',`สร้างรายงานตัวอย่าง: ${type}`); renderAudit();
  });

  qs('#start-guided-demo').addEventListener('click',startGuided);
  qs('#guided-exit').addEventListener('click',exitGuided);
  qs('#guided-prev').addEventListener('click',()=>{ if(guidedIndex>0){guidedIndex--;runGuidedStep();} });
  qs('#guided-next').addEventListener('click',()=>{ if(guidedIndex<guidedSteps.length-1){guidedIndex++;runGuidedStep();} else {exitGuided();showModal('Guided Demo จบแล้ว','ปิดท้ายด้วยคำถามจากกรรมการ หรือกลับไปยังหน้าที่ต้องการอธิบายเพิ่มเติมได้ทันที');} });
  qs('#reset-demo-btn').addEventListener('click',resetDemo);
  qs('#mobile-menu-btn').addEventListener('click',()=>qs('#sidebar').classList.toggle('open'));
  qs('#modal-close').addEventListener('click',()=>qs('#confirm-modal').classList.remove('show'));
  qs('#confirm-modal').addEventListener('click',e=>{if(e.target.id==='confirm-modal')e.currentTarget.classList.remove('show')});
});
