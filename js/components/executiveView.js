/* ==========================================================================
   Bang Yai Child Development Center MIS - Executive View Component
   Executive Interface: KPI Dashboard, Child Registry, Audit Logs
   ========================================================================== */

const ExecutiveView = {
  currentTab: 'DASHBOARD',
  showFullNationalId: false,

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const children = window.appStore.getChildren();
    const attendance = window.appStore.getAttendance();
    const leaveReqs = window.appStore.getLeaveRequests();
    const devRecs = window.appStore.getDevelopmentRecords();
    const auditLogs = window.appStore.getAuditLogs();
    const centerInfo = window.appStore.getCenterInfo();

    const presentCount = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const leaveCount = attendance.filter(a => a.status === 'LEAVE').length;
    const absentCount = attendance.filter(a => a.status === 'ABSENT').length;
    const rate = children.length > 0 ? Math.round((presentCount / children.length) * 100) : 0;

    container.innerHTML = `
      <div class="animate-fade-in">
        <div class="glass-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(255, 251, 235, 0.9), rgba(254, 243, 199, 0.9)); border-color: rgba(217, 119, 6, 0.2);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-executive" style="margin-bottom: 0.25rem;">มุมมองผู้บริหาร / เทศบาล</span>
              <h2 style="font-size: 1.35rem; font-weight: 700; margin: 0;">${centerInfo.name}</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                อ.${centerInfo.district} จ.${centerInfo.province} | ปีการศึกษา ${centerInfo.academicYear} | ภาคเรียนที่ ${centerInfo.term}
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" onclick="window.ExportUtils.printExecutiveReport()" style="font-weight: 600;">
                🖨️ พิมพ์รายงานสรุปผล
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ExecutiveView.exportDataCSV()" style="font-weight: 600; background: #FFF;">
                📥 ส่งออก Excel (CSV)
              </button>
            </div>
          </div>
        </div>

        <div class="view-tabs">
          <button class="tab-link ${this.currentTab === 'DASHBOARD' ? 'active' : ''}" onclick="ExecutiveView.currentTab = 'DASHBOARD'; ExecutiveView.render('${containerId}');">
            📊 Dashboard ภาพรวม
          </button>
          <button class="tab-link ${this.currentTab === 'REGISTRY' ? 'active' : ''}" onclick="ExecutiveView.currentTab = 'REGISTRY'; ExecutiveView.render('${containerId}');">
            📋 ทะเบียนนักเรียน (${children.length} คน)
          </button>
          <button class="tab-link ${this.currentTab === 'AUDIT_LOGS' ? 'active' : ''}" onclick="ExecutiveView.currentTab = 'AUDIT_LOGS'; ExecutiveView.render('${containerId}');">
            🔐 Audit Logs (${auditLogs.length})
          </button>
        </div>

        <div id="exec-tab-content">
          ${this.renderTabContent(this.currentTab, children, attendance, leaveReqs, devRecs, auditLogs, centerInfo, containerId, presentCount, leaveCount, absentCount, rate)}
        </div>
      </div>
    `;

    if (this.currentTab === 'DASHBOARD') {
      setTimeout(() => {
        if (window.ChartUtils) {
          window.ChartUtils.renderDonutChart('exec-attendance-donut', rate, 'อัตรามาเรียน', '#10B981');
          window.ChartUtils.renderAttendanceTrend('exec-att-trend');
        }
      }, 50);
    }
  },

  renderTabContent(tab, children, attendance, leaveReqs, devRecs, auditLogs, centerInfo, containerId, presentCount, leaveCount, absentCount, rate) {
    if (tab === 'DASHBOARD') {
      return `
        <div class="grid-4" style="margin-bottom: 1.5rem;">
          <div class="glass-card stat-card">
            <div class="stat-icon indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="stat-label">จำนวนนักเรียนทั้งหมด</div>
              <div class="stat-value">${children.length} คน</div>
              <div class="stat-label" style="font-size: 0.75rem;">ความจุรองรับ: ${centerInfo.totalCapacity} คน</div>
            </div>
          </div>
          <div class="glass-card stat-card">
            <div class="stat-icon emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <div class="stat-label">อัตราการมาเรียนวันนี้</div>
              <div class="stat-value" style="color: var(--success-500);">${rate}%</div>
              <div class="stat-label" style="font-size: 0.75rem;">มาเรียน ${presentCount} | ลา ${leaveCount} | ขาด ${absentCount}</div>
            </div>
          </div>
          <div class="glass-card stat-card">
            <div class="stat-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <div class="stat-label">คำขอแจ้งลา (รอดำเนินการ)</div>
              <div class="stat-value">${leaveReqs.filter(l => l.status === 'PENDING').length} รายการ</div>
              <div class="stat-label" style="font-size: 0.75rem;">ทั้งหมด: ${leaveReqs.length} รายการ</div>
            </div>
          </div>
          <div class="glass-card stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div>
              <div class="stat-label">บันทึกพัฒนาการครบ</div>
              <div class="stat-value">${devRecs.length}/${children.length}</div>
              <div class="stat-label" style="font-size: 0.75rem;">ภาคเรียน ${centerInfo.term}</div>
            </div>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom: 1.5rem;">
          <div class="glass-card">
            <h3 style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem;">📊 อัตราการมาเรียนวันนี้</h3>
            <div id="exec-attendance-donut"></div>
          </div>
          <div class="glass-card">
            <h3 style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem;">📈 แนวโน้มการมาเรียนรายสัปดาห์</h3>
            <div id="exec-att-trend"></div>
          </div>
        </div>

        <div class="grid-3" style="margin-bottom: 1.5rem;">
          <div class="glass-card">
            <h4 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main);">💰 งบประมาณค่าอาหาร</h4>
            <div style="background: white; border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border-color);">
              <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">งบประมาณรายเดือน (22 วัน/เดือน)</div>
              <div style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">
                ${(children.length * 22).toLocaleString()} บาท/เดือน
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">อัตราค่าอาหารต่อคน (${children.length} คน)</div>
            </div>
          </div>
          <div class="glass-card">
            <h4 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main);">📏 สรุปการเจริญเติบโตเฉลี่ย</h4>
            <div style="background: white; border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border-color);">
              <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">การประเมินสุขภาพตามเกณฑ์</div>
              <div style="font-size: 1.35rem; font-weight: 700; color: #059669; margin-top: 2px;">
                ${children.filter(c => c.growthStatus === 'สมส่วนตามเกณฑ์').length}/${children.length} สมส่วน
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">อ้างอิงเกณฑ์กรมอนามัย กระทรวงสาธารณสุข</div>
            </div>
          </div>
          <div class="glass-card">
            <h4 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main);">🏫 ข้อมูลศูนย์พัฒนาเด็กเล็ก</h4>
            <div style="background: white; border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border-color);">
              <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">ห้องเรียนปัจจุบัน</div>
              <div style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">
                ${window.appStore.getClassrooms().length} ห้องเรียน
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">ครูประจำชั้น: ${window.appStore.getClassrooms().map(c => c.teacherName).join(', ')}</div>
            </div>
          </div>
        </div>
      `;
    }

    if (tab === 'REGISTRY') {
      const showFullId = this.showFullNationalId || false;
      const maskId = (idStr) => {
        if (!idStr) return '-';
        if (showFullId) return idStr;
        return idStr.replace(/^(\d-\d{4}-)\d{5}(-\d{2}-\d)$/, '$1XXXXX$2');
      };
      const classrooms = window.appStore.getClassrooms();
      const getClassName = (classId) => {
        const cls = classrooms.find(c => c.id === classId);
        return cls ? cls.name : classId || '-';
      };

      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">ทะเบียนนักเรียนศูนย์พัฒนาเด็กเล็ก</h3>
              <span class="badge badge-success" style="font-size: 0.75rem; margin-top: 4px;">ปฏิบัติตามหลัก PDPA (Data Minimization)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button class="btn btn-secondary btn-sm" onclick="ExecutiveView.showFullNationalId = !ExecutiveView.showFullNationalId; ExecutiveView.render('${containerId}');">
                ${showFullId ? 'ซ่อน เลขบัตรประชาชน (PDPA)' : 'แสดง เลขบัตรประชาชนเต็ม'}
              </button>
              <input type="text" placeholder="ค้นหาชื่อนักเรียน / ผู้ปกครอง..." class="form-control btn-sm" style="max-width: 240px;" onkeyup="ExecutiveView.filterRegistry(this.value)">
            </div>
          </div>

          <div class="data-table-container">
            <table class="data-table" id="registry-table">
              <thead>
                <tr>
                  <th>เลขประจำตัวประชาชน (PDPA)</th>
                  <th>ชื่อ - นามสกุล (ชื่อเล่น)</th>
                  <th>เพศ</th>
                  <th>อายุ</th>
                  <th>ห้องเรียน</th>
                  <th>ผู้ปกครอง</th>
                  <th>เบอร์โทรศัพท์ติดต่อ</th>
                  <th>สิ่งที่แพ้อาหาร</th>
                </tr>
              </thead>
              <tbody>
                ${children.map(c => `
                  <tr>
                    <td style="font-family: monospace;">${maskId(c.nationalId)}</td>
                    <td><strong>${c.firstName} ${c.lastName} (${c.nickname})</strong></td>
                    <td>${c.gender}</td>
                    <td>${c.ageString}</td>
                    <td><span class="badge badge-teacher" style="font-size: 0.75rem; white-space: nowrap;">${getClassName(c.classId)}</span></td>
                    <td>${c.parentName} (${c.parentRelation})</td>
                    <td>${c.parentPhone}</td>
                    <td><strong style="color: ${c.allergy !== 'ไม่มี' ? 'var(--danger-500)' : 'var(--text-muted)'};">${c.allergy}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'AUDIT_LOGS') {
      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.1rem;">บันทึกการเข้าถึงระบบ Audit Log ฉบับเต็ม</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">ตามข้อกำหนด พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) & OWASP ASVS</p>
            </div>
            <span class="badge badge-success">บันทึกอัตโนมัติ Real-Time</span>
          </div>

          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>วัน-เวลา (Timestamp)</th>
                  <th>ผู้ดำเนินการ (User & Role)</th>
                  <th>การกระทำ (Action Code)</th>
                  <th>รายละเอียด (Log Details)</th>
                </tr>
              </thead>
              <tbody>
                ${auditLogs.map(l => `
                  <tr>
                    <td style="font-family: monospace; font-size: 0.85rem;">${l.timestamp}</td>
                    <td><strong>${l.user}</strong></td>
                    <td><span class="badge badge-info">${l.action}</span></td>
                    <td>${l.details}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    return '';
  },

  filterRegistry(query) {
    const table = document.getElementById('registry-table');
    if (!table) return;
    const trs = table.getElementsByTagName('tr');
    const q = query.toLowerCase();

    for (let i = 1; i < trs.length; i++) {
      const text = trs[i].textContent.toLowerCase();
      trs[i].style.display = text.includes(q) ? '' : 'none';
    }
  },

  exportDataCSV() {
    const children = window.appStore.getChildren();
    const showFullId = this.showFullNationalId || false;
    const maskId = (idStr) => (showFullId ? idStr : (idStr || '').replace(/^(\d-\d{4}-)\d{5}(-\d{2}-\d)$/, '$1XXXXX$2'));
    const rows = [
      ['เลขประจำตัวประชาชน (PDPA)', 'ชื่อ', 'นามสกุล', 'ชื่อเล่น', 'เพศ', 'อายุ', 'ผู้ปกครอง', 'เบอร์โทรศัพท์ติดต่อ', 'สิ่งที่แพ้อาหาร'],
      ...children.map(c => [maskId(c.nationalId), c.firstName, c.lastName, c.nickname, c.gender, c.ageString, c.parentName, c.parentPhone, c.allergy])
    ];
    window.ExportUtils.exportToCSV('BangYai_Child_Center_Registry_2569.csv', rows);
  }
};

window.ExecutiveView = ExecutiveView;