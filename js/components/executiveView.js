/* ==========================================================================
   Bang Yai Child Development Center MIS - Executive View Component
   Executive Dashboard, Analytics Charts, Registry, Audit Log & Report Export
   ========================================================================== */

const ExecutiveView = {
  currentTab: 'DASHBOARD', // DASHBOARD, REGISTRY, AUDIT_LOGS

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const centerInfo = window.appStore.getCenterInfo();
    const children = window.appStore.getChildren();
    const attendance = window.appStore.getAttendance('2569-08-10');
    const presentCount = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const rate = Math.round((presentCount / (children.length || 1)) * 100);
    const leaveReqs = window.appStore.getLeaveRequests();
    const auditLogs = window.appStore.getAuditLogs();

    container.innerHTML = `
      <div class="animate-fade-in">
        <!-- Header Banner & Action Buttons -->
        <div class="glass-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(255, 251, 235, 0.95), rgba(254, 243, 199, 0.95)); border-color: rgba(217, 119, 6, 0.25);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-executive" style="margin-bottom: 0.25rem;">ผู้บริหาร / เทศบาลเมืองบางใหญ่</span>
              <h2 style="font-size: 1.35rem; font-weight: 700; margin: 0;">แดชบอร์ดผู้บริหารและศูนย์ข้อมูลสารสนเทศ (Executive Data Center)</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                ${centerInfo.name} | การกำกับดูแลเชิงนโยบายและความมั่นคงปลอดภัย (Single Source of Truth)
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button class="btn btn-primary" onclick="ExportUtils.printExecutiveReport()" style="background: linear-gradient(135deg, var(--role-executive), #B45309);">
                🖨️ พิมพ์รายงานผู้บริหาร
              </button>
              <button class="btn btn-secondary btn-sm" onclick="ExecutiveView.exportDataCSV()">
                📥 ส่งออก CSV
              </button>
            </div>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="grid-4" style="margin-bottom: 1.5rem;">
          <div class="glass-card stat-card">
            <div class="stat-icon indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="stat-value">${children.length} คน</div>
              <div class="stat-label">จำนวนเด็กในศูนย์ทั้งหมด</div>
            </div>
          </div>

          <div class="glass-card stat-card">
            <div class="stat-icon emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <div class="stat-value" style="color: var(--success-500);">${rate}%</div>
              <div class="stat-label">อัตราการมาเรียนวันนี้ (${presentCount}/${children.length})</div>
            </div>
          </div>

          <div class="glass-card stat-card">
            <div class="stat-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <div class="stat-value">${leaveReqs.filter(l => l.status === 'PENDING').length} รายการ</div>
              <div class="stat-label">คำขอแจ้งลารออนุมัติ</div>
            </div>
          </div>

          <div class="glass-card stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <div class="stat-value">${auditLogs.length}</div>
              <div class="stat-label">Audit Logs ความปลอดภัย</div>
            </div>
          </div>
        </div>

        <!-- Executive Navigation Tabs -->
        <div class="view-tabs">
          <button class="tab-link ${this.currentTab === 'DASHBOARD' ? 'active' : ''}" onclick="ExecutiveView.currentTab = 'DASHBOARD'; ExecutiveView.render('${containerId}');">
            📈 ภาพรวมสถิติ & กราฟพัฒนาการ
          </button>
          <button class="tab-link ${this.currentTab === 'REGISTRY' ? 'active' : ''}" onclick="ExecutiveView.currentTab = 'REGISTRY'; ExecutiveView.render('${containerId}');">
            👥 ทะเบียนเด็ก & ผู้ปกครอง (${children.length})
          </button>
          <button class="tab-link ${this.currentTab === 'AUDIT_LOGS' ? 'active' : ''}" onclick="ExecutiveView.currentTab = 'AUDIT_LOGS'; ExecutiveView.render('${containerId}');">
            🛡️ ประวัติการใช้งาน & Audit Log (${auditLogs.length})
          </button>
        </div>

        <!-- Tab Content -->
        <div id="executive-tab-content">
          ${this.renderTabContent(this.currentTab, children, attendance, auditLogs, containerId)}
        </div>
      </div>
    `;

    if (this.currentTab === 'DASHBOARD') {
      setTimeout(() => {
        window.ChartUtils.renderDonutChart('exec-donut-chart', rate, 'การมาเรียนวันนี้', '#10B981');
        window.ChartUtils.renderAttendanceTrend('exec-trend-chart');
        window.ChartUtils.renderDevelopmentBars('exec-dev-chart', { physical: 4, emotional: 4, social: 3, intellectual: 4 });
      }, 50);
    }
  },

  renderTabContent(tab, children, attendance, auditLogs, containerId) {
    if (tab === 'DASHBOARD') {
      return `
        <div class="grid-3" style="margin-bottom: 1.5rem;">
          <!-- Donut Chart -->
          <div class="glass-card">
            <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; text-align: center;">สัดส่วนการเข้าเรียนประจำวัน</h3>
            <div id="exec-donut-chart"></div>
            <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; font-size: 0.8rem;">
              <span style="color: var(--success-500); font-weight: 600;">● มาเรียน (${attendance.filter(a=>a.status==='PRESENT').length})</span>
              <span style="color: var(--warning-500); font-weight: 600;">● มาสาย (${attendance.filter(a=>a.status==='LATE').length})</span>
              <span style="color: var(--info-500); font-weight: 600;">● ลา (${attendance.filter(a=>a.status==='LEAVE').length})</span>
            </div>
          </div>

          <!-- Weekly Trend Chart -->
          <div class="glass-card">
            <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.5rem; text-align: center;">แนวโน้มอัตราการมาเรียนสัปดาห์นี้</h3>
            <div id="exec-trend-chart"></div>
          </div>

          <!-- 4 Aspects Overview -->
          <div class="glass-card">
            <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 1rem; text-align: center;">ภาพรวมพัฒนาการ 4 ด้านทั้งศูนย์</h3>
            <div id="exec-dev-chart"></div>
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

      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">ทะเบียนข้อมูลเด็กปฐมวัยและผู้ปกครอง</h3>
              <span class="badge badge-success" style="font-size: 0.75rem; margin-top: 4px;">🔒 มาตรฐาน PDPA (Data Minimization)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button class="btn btn-secondary btn-sm" onclick="ExecutiveView.showFullNationalId = !ExecutiveView.showFullNationalId; ExecutiveView.render('${containerId}');">
                ${showFullId ? '🔒 ซ่อนเลขบัตรประชาชน (PDPA)' : '👁️ แสดงเลขบัตรประชาชนเต็ม'}
              </button>
              <input type="text" placeholder="🔍 ค้นหาชื่อเด็ก / ผู้ปกครอง..." class="form-control btn-sm" style="max-width: 240px;" onkeyup="ExecutiveView.filterRegistry(this.value)">
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
                  <th>เบอร์โทรศัพท์</th>
                  <th>การแพ้อาหาร</th>
                </tr>
              </thead>
              <tbody>
                ${children.map(c => `
                  <tr>
                    <td style="font-family: monospace;">${maskId(c.nationalId)}</td>
                    <td><strong>${c.firstName} ${c.lastName} (${c.nickname})</strong></td>
                    <td>${c.gender}</td>
                    <td>${c.ageString}</td>
                    <td><span class="badge badge-teacher">อนุบาล 1/1</span></td>
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
              <h3 style="font-weight: 700; font-size: 1.1rem;">ประวัติการใช้งานและ Audit Log ระบบ</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted);">ตามมาตรฐาน พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) & OWASP ASVS</p>
            </div>
            <span class="badge badge-success">ระบบบันทึกแบบ Real-Time</span>
          </div>

          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>วัน-เวลา (Timestamp)</th>
                  <th>ผู้ใช้งาน (User & Role)</th>
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
    const rows = [
      ['National ID', 'First Name', 'Last Name', 'Nickname', 'Gender', 'Age', 'Parent Name', 'Parent Phone', 'Allergy'],
      ...children.map(c => [c.nationalId, c.firstName, c.lastName, c.nickname, c.gender, c.ageString, c.parentName, c.parentPhone, c.allergy])
    ];
    window.ExportUtils.exportToCSV('BangYai_Child_Center_Registry_2569.csv', rows);
  }
};

window.ExecutiveView = ExecutiveView;
