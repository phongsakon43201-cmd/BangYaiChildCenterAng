/* ==========================================================================
   Bang Yai Child Development Center MIS - Teacher View Component
   Teacher Interface: Attendance Grid, Leave Approvals, Activity & Growth/Dev
   ========================================================================== */

const TeacherView = {
  selectedClassId: 'class-bm',
  currentTab: 'ATTENDANCE', // ATTENDANCE, LEAVE_APPROVALS, DEV_EVAL, GROWTH_RECORD, ACTIVITIES

  switchTab(tabId, containerId = 'main-view-root') {
    this.currentTab = tabId;
    this.render(containerId);
  },

  render(containerId = 'main-view-root') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const classrooms = window.appStore.getClassrooms();
    const activeClass = classrooms.find(c => c.id === this.selectedClassId) || classrooms[0] || { name: 'ห้อง "ลูกหมีน่ารัก"', teacherName: 'นางสาวกานดา ใจดี (ครูแก้ว)' };
    const children = window.appStore.getChildren(this.selectedClassId) || [];
    const attendance = window.appStore.getAttendance() || [];
    const leaveReqs = window.appStore.getLeaveRequests() || [];
    const pendingLeaves = leaveReqs.filter(l => l.status === 'PENDING');

    const classAtts = attendance.filter(a => children.some(c => c.id === a.childId));
    const checkedCount = classAtts.length;
    const presentCount = classAtts.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;

    container.innerHTML = `
      <div class="animate-fade-in">
        <!-- Header Banner & Class Selector -->
        <div class="glass-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.95)); border-color: rgba(79, 70, 229, 0.25);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-teacher" style="margin-bottom: 0.25rem;">👩‍🏫 มุมมองครู / ผู้ดูแลเด็ก</span>
              <h2 style="font-size: 1.35rem; font-weight: 700; margin: 0;">${activeClass.name}</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                ครูประจำชั้น: <strong>${activeClass.teacherName}</strong> | เช็กชื่อแล้ว: <strong style="color: var(--primary-600);">${checkedCount}/${children.length} คน</strong>
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <select class="form-control" style="width: auto; min-height: 38px; font-weight: 600; background: #FFF;" onchange="window.TeacherView.selectedClassId = this.value; window.TeacherView.render('${containerId}');">
                ${classrooms.map(c => `<option value="${c.id}" ${c.id === activeClass.id ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
              <button type="button" class="btn btn-primary btn-sm" onclick="window.ModalsComponent.openAnnouncementModal()">
                📢 + ประกาศใหม่
              </button>
            </div>
          </div>
        </div>

        <!-- Sub Tabs for Teacher (5 Tabs) -->
        <div class="view-tabs">
          <button type="button" class="tab-link ${this.currentTab === 'ATTENDANCE' ? 'active' : ''}" onclick="window.TeacherView.switchTab('ATTENDANCE', '${containerId}')">
            📋 เช็กชื่อการเข้าเรียน (${checkedCount}/${children.length} คน)
          </button>
          <button type="button" class="tab-link ${this.currentTab === 'LEAVE_APPROVALS' ? 'active' : ''}" onclick="window.TeacherView.switchTab('LEAVE_APPROVALS', '${containerId}')">
            📩 คำขอแจ้งลา ${pendingLeaves.length > 0 ? `<span class="badge" style="background: #F59E0B; color: #FFF; font-weight: 700; padding: 2px 8px; font-size: 0.75rem; margin-left: 4px;">${pendingLeaves.length} รออนุมัติ</span>` : `(${leaveReqs.length})`}
          </button>
          <button type="button" class="tab-link ${this.currentTab === 'DEV_EVAL' ? 'active' : ''}" onclick="window.TeacherView.switchTab('DEV_EVAL', '${containerId}')">
            📊 ประเมินพัฒนาการ 4 ด้าน
          </button>
          <button type="button" class="tab-link ${this.currentTab === 'GROWTH_RECORD' ? 'active' : ''}" onclick="window.TeacherView.switchTab('GROWTH_RECORD', '${containerId}')">
            ⚖️ บันทึกส่วนสูง / น้ำหนัก / วัคซีน
          </button>
          <button type="button" class="tab-link ${this.currentTab === 'ACTIVITIES' ? 'active' : ''}" onclick="window.TeacherView.switchTab('ACTIVITIES', '${containerId}')">
            🎨 บันทึกกิจกรรมประจำวัน
          </button>
        </div>

        <!-- Tab Content -->
        <div id="teacher-tab-content">
          ${this.renderTabContent(this.currentTab, children, attendance, pendingLeaves, containerId)}
        </div>
      </div>
    `;
  },

  renderTabContent(tab, children, attendance, pendingLeaves, containerId) {
    if (tab === 'ATTENDANCE') {
      return `
        ${pendingLeaves.length > 0 ? `
          <div class="glass-card" style="margin-bottom: 1.25rem; background: #FFFBEB; border: 1px solid #F59E0B; border-left: 6px solid #D97706; padding: 1rem 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.75rem;">🔔</span>
                <div>
                  <strong style="color: #92400E; font-size: 1rem;">มีคำขอแจ้งลาจากผู้ปกครองรอการอนุมัติ ${pendingLeaves.length} รายการ</strong>
                  <p style="font-size: 0.85rem; color: #78350F; margin: 2px 0 0 0;">
                    ${pendingLeaves.map(p => `<strong>${p.childName}</strong> (${p.leaveType}: ${p.reason})`).join(' | ')}
                  </p>
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-primary" onclick="window.TeacherView.switchTab('LEAVE_APPROVALS', '${containerId}')" style="background: #D97706; border-color: #D97706; color: #FFF; font-weight: 700;">
                👉 ตรวจสอบและอนุมัติ (${pendingLeaves.length})
              </button>
            </div>
          </div>
        ` : ''}

        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">ระบบเช็กชื่อรายวันประจำวันที่ ${window.appStore.getTodayThaiFormatted()}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 2px 0 0 0;">บันทึกสถานะการมาเรียนและส่งแจ้งเตือนผ่าน LINE อัตโนมัติ</p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.TeacherView.exportAttendanceCSV()" style="font-weight: 600; background: #FFF;">
                📥 ส่งออก Excel (CSV)
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.ExportUtils.printAttendanceSheet(window.appStore.getAttendance(), window.appStore.getChildren())" style="font-weight: 600; background: #FFF;">
                🖨️ พิมพ์ใบเช็กชื่อ
              </button>
              <span class="badge badge-line">💬 LINE อัตโนมัติ</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${children.map(child => {
              const att = attendance.find(a => a.childId === child.id);
              const status = att ? att.status : null;
              const childPendingLeave = pendingLeaves.find(p => p.childId === child.id || (p.childName && (p.childName.includes(child.nickname) || p.childName.includes(child.firstName))));
              
              let statusBadgeHtml = '';
              if (!status) {
                statusBadgeHtml = `<span class="badge" style="background: #F3F4F6; color: #6B7280; border: 1px dashed #D1D5DB; font-size: 0.75rem;">⏳ ยังไม่ได้เช็กชื่อ</span>`;
              } else if (status === 'PRESENT') {
                statusBadgeHtml = `<span class="badge badge-success" style="font-size: 0.75rem;">✓ มาเรียน (${att.checkTime || '07:45 น.'})</span>`;
              } else if (status === 'LATE') {
                statusBadgeHtml = `<span class="badge badge-warning" style="font-size: 0.75rem;">⏱ มาสาย (${att.checkTime || '08:15 น.'})</span>`;
              } else if (status === 'LEAVE') {
                statusBadgeHtml = `<span class="badge badge-info" style="font-size: 0.75rem;">📄 แจ้งลา (${att.checkedBy || 'ผู้ปกครองแจ้งลา'})</span>`;
              } else if (status === 'ABSENT') {
                statusBadgeHtml = `<span class="badge badge-danger" style="font-size: 0.75rem;">✕ ขาดเรียน</span>`;
              }

              return `
                <div class="attendance-card" style="${childPendingLeave ? 'border-left: 4px solid #F59E0B; background: #FFFDF5;' : ''}">
                  <div style="width: 100%;">
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
                      <div class="student-info">
                        <div class="student-avatar" style="background-color: ${child.avatarColor || '#4F46E5'}; color: #FFF;">
                          ${(child.nickname ? child.nickname.replace(/^น้อง/, '').charAt(0) : child.firstName.charAt(0)) || '👶'}
                        </div>
                        <div>
                          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <strong style="font-size: 1rem; color: var(--text-main);">${child.nickname} (${child.firstName} ${child.lastName})</strong>
                            ${statusBadgeHtml}
                            ${childPendingLeave ? `<span class="badge badge-warning" style="font-size: 0.75rem; background: #FEF3C7; color: #92400E; border: 1px solid #F59E0B;">📩 ยื่นคำขอ${childPendingLeave.leaveType}</span>` : ''}
                          </div>
                          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">ผู้ปกครอง: ${child.parentName} | โทร: ${child.parentPhone}</p>
                        </div>
                      </div>

                      <div class="attendance-btn-group">
                        <button type="button" class="att-btn ${!status ? 'selected' : ''}" style="background: ${!status ? '#6B7280' : '#F3F4F6'}; color: ${!status ? '#FFFFFF' : '#4B5563'}; border: 1px solid #D1D5DB;" onclick="window.TeacherView.handleCheckIn('${child.id}', 'UNCHECKED', '${containerId}')">
                          ⏳ ยังไม่เช็ก
                        </button>
                        <button type="button" class="att-btn present ${status === 'PRESENT' ? 'selected' : ''}" onclick="window.TeacherView.handleCheckIn('${child.id}', 'PRESENT', '${containerId}')">
                          ✓ มาเรียน
                        </button>
                        <button type="button" class="att-btn late ${status === 'LATE' ? 'selected' : ''}" onclick="window.TeacherView.handleCheckIn('${child.id}', 'LATE', '${containerId}')">
                          ⏱ มาสาย
                        </button>
                        <button type="button" class="att-btn leave ${status === 'LEAVE' ? 'selected' : ''}" onclick="window.TeacherView.handleCheckIn('${child.id}', 'LEAVE', '${containerId}')">
                          📄 แจ้งลา
                        </button>
                        <button type="button" class="att-btn absent ${status === 'ABSENT' ? 'selected' : ''}" onclick="window.TeacherView.handleCheckIn('${child.id}', 'ABSENT', '${containerId}')">
                          ✕ ขาดเรียน
                        </button>
                      </div>
                    </div>

                    ${childPendingLeave ? `
                      <div style="margin-top: 0.65rem; background: #FEF3C7; border: 1px dashed #F59E0B; border-radius: 8px; padding: 0.5rem 0.85rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                        <div style="font-size: 0.85rem; color: #92400E;">
                          <strong>📩 คำขอแจ้งลา (${childPendingLeave.leaveType}):</strong> วันที่ ${childPendingLeave.startDate} ถึง ${childPendingLeave.endDate} <span style="color: #78350F;">(เหตุผล: ${childPendingLeave.reason})</span>
                        </div>
                        <div style="display: flex; gap: 0.4rem;">
                          <button type="button" class="btn btn-success btn-sm" style="padding: 0.25rem 0.75rem; font-size: 0.8rem; font-weight: 700;" onclick="window.TeacherView.handleApproveLeave('${childPendingLeave.id}', 'APPROVED', '${containerId}')">✓ อนุมัติการลา</button>
                          <button type="button" class="btn btn-danger btn-sm" style="padding: 0.25rem 0.75rem; font-size: 0.8rem; font-weight: 700;" onclick="window.TeacherView.handleApproveLeave('${childPendingLeave.id}', 'REJECTED', '${containerId}')">✕ ไม่อนุมัติ</button>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (tab === 'LEAVE_APPROVALS') {
      const allReqs = [...window.appStore.getLeaveRequests()].sort((a, b) => (a.status === 'PENDING' ? -1 : 1));
      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.15rem; margin: 0;">รายการคำขอแจ้งลาจากผู้ปกครอง</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                รอการอนุมัติ: <strong style="color: #D97706;">${pendingLeaves.length} รายการ</strong> | ทั้งหมด: ${allReqs.length} รายการ
              </p>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.TeacherView.render('${containerId}')">
              🔄 รีเฟรชข้อมูล
            </button>
          </div>
          
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ชื่อเด็ก</th>
                  <th>ผู้ปกครอง</th>
                  <th>ประเภท</th>
                  <th>วันที่ลา</th>
                  <th>เหตุผล</th>
                  <th>สถานะ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                ${allReqs.length > 0 ? allReqs.map(l => `
                  <tr style="${l.status === 'PENDING' ? 'background-color: #FFFDF5; font-weight: 500;' : ''}">
                    <td><strong>${l.childName}</strong></td>
                    <td>${l.parentName}</td>
                    <td><span class="badge badge-info">${l.leaveType}</span></td>
                    <td>${l.startDate} ถึง ${l.endDate}</td>
                    <td style="max-width: 250px;">${l.reason}</td>
                    <td>
                      ${l.status === 'APPROVED' ? '<span class="badge badge-success">✓ อนุมัติแล้ว</span>' :
                        l.status === 'REJECTED' ? '<span class="badge badge-danger">✕ ไม่อนุมัติ</span>' :
                        '<span class="badge badge-warning" style="background: #FEF3C7; color: #92400E; border: 1px solid #F59E0B; font-weight: 700;">⏳ รออนุมัติ</span>'}
                    </td>
                    <td>
                      ${l.status === 'PENDING' ? `
                        <div style="display: flex; gap: 0.35rem;">
                          <button type="button" class="btn btn-success btn-sm" style="font-weight: 700; padding: 0.3rem 0.75rem;" onclick="window.TeacherView.handleApproveLeave('${l.id}', 'APPROVED', '${containerId}')">✓ อนุมัติ</button>
                          <button type="button" class="btn btn-danger btn-sm" style="font-weight: 700; padding: 0.3rem 0.75rem;" onclick="window.TeacherView.handleApproveLeave('${l.id}', 'REJECTED', '${containerId}')">✕ ไม่อนุมัติ</button>
                        </div>
                      ` : `<span style="font-size: 0.8rem; color: var(--text-muted);">${l.approvedBy ? `โดย ${l.approvedBy}` : 'ดำเนินการแล้ว'}</span>`}
                    </td>
                  </tr>
                `).join('') : '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">ยังไม่มีรายการคำขอแจ้งลาในระบบ</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'GROWTH_RECORD') {
      return `
        <div class="glass-card" style="margin-bottom: 1.25rem; background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%); border-left: 5px solid #10B981; padding: 1.25rem;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span style="font-size: 1.35rem;">⚖️</span>
                <h3 style="font-weight: 800; font-size: 1.15rem; margin: 0; color: #065F46;">ระบบคำนวณดัชนีมวลกาย (BMI) และประเมินการเจริญเติบโตอัตโนมัติ</h3>
              </div>
              <p style="font-size: 0.88rem; color: #047857; margin: 0 0 0.5rem 0;">
                สูตรคำนวณสากล: <strong>น้ำหนัก (กก.) / [ส่วนสูง (ม.)]²</strong> (ระบบจะคำนวณและจำแนกเกณฑ์ให้อัตโนมัติทันทีที่กรอก)
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <span class="badge badge-success" style="font-weight: 700;">🟢 สมส่วน (ปกติ)</span>
              <span class="badge badge-warning" style="background: #FEF3C7; color: #92400E; font-weight: 700;">🟡 ท้วม/น้ำหนักเกิน</span>
              <span class="badge badge-danger" style="font-weight: 700;">🔴 อ้วน</span>
              <span class="badge badge-info" style="font-weight: 700;">🔵 ค่อนข้างผอม</span>
            </div>
          </div>
        </div>

        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">บันทึกส่วนสูง น้ำหนัก และประเมินสุขภาพรายบุคคล (${children.length} คน)</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 2px 0 0 0;">แก้ไขตัวเลขเพื่อดูการคำนวณ BMI แบบ Real-Time</p>
            </div>
            <span class="badge badge-success">คำนวณอัตโนมัติ Real-Time</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${children.map(child => {
              const h = child.heightCm || 92.0;
              const w = child.weightKg || 13.5;
              const hM = h / 100;
              const curBmi = (w / (hM * hM)).toFixed(1);
              const curStatus = child.growthStatus || 'สมส่วนตามเกณฑ์';
              const badgeBg = curStatus === 'สมส่วนตามเกณฑ์' ? '#10B981' : curStatus === 'ท้วม/เริ่มอ้วน' ? '#F59E0B' : curStatus === 'อ้วน' ? '#EF4444' : '#3B82F6';

              return `
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.1rem 1.25rem; background: var(--bg-surface); box-shadow: var(--shadow-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                      <div class="student-avatar" style="width: 38px; height: 38px; font-size: 1rem; background-color: ${child.avatarColor || '#4F46E5'}; color: #FFF;">
                        ${(child.nickname ? child.nickname.replace(/^น้อง/, '').charAt(0) : child.firstName.charAt(0)) || '👶'}
                      </div>
                      <div>
                        <strong style="font-size: 1.05rem; color: var(--text-main);">${child.nickname} (${child.firstName} ${child.lastName})</strong>
                        <span id="growth-bmi-badge-${child.id}" class="badge" style="background: ${badgeBg}; color: #FFF; font-weight: 700; margin-left: 0.5rem; font-size: 0.8rem; padding: 3px 9px;">
                          BMI: ${curBmi} (${curStatus})
                        </span>
                      </div>
                    </div>
                    
                    <button type="button" class="btn btn-primary btn-sm" onclick="window.TeacherView.saveGrowthData('${child.id}', '${containerId}')" style="font-weight: 700; padding: 0.4rem 1rem;">
                      💾 บันทึกการเติบโต
                    </button>
                  </div>

                  <div class="grid-3" style="gap: 1rem; align-items: end;">
                    <div>
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 600;">ส่วนสูง (เซนติเมตร)</label>
                      <input type="number" step="0.1" min="30" max="220" id="growth-h-${child.id}" class="form-control btn-sm" value="${h}" oninput="window.TeacherView.autoCalcBMI('${child.id}')" placeholder="เช่น 92.0" style="font-weight: 700; font-size: 0.95rem;">
                    </div>
                    <div>
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 600;">น้ำหนัก (กิโลกรัม)</label>
                      <input type="number" step="0.1" min="2" max="150" id="growth-w-${child.id}" class="form-control btn-sm" value="${w}" oninput="window.TeacherView.autoCalcBMI('${child.id}')" placeholder="เช่น 13.5" style="font-weight: 700; font-size: 0.95rem;">
                    </div>
                    <div>
                      <label class="form-label" style="font-size: 0.82rem; font-weight: 600;">ผลประเมินการเติบโต (Auto)</label>
                      <select id="growth-status-${child.id}" class="form-control btn-sm" style="font-weight: 600; min-height: 38px;">
                        <option value="สมส่วนตามเกณฑ์" ${curStatus === 'สมส่วนตามเกณฑ์' ? 'selected' : ''}>🟢 สมส่วนตามเกณฑ์ (น้ำหนักปกติ)</option>
                        <option value="ท้วม/เริ่มอ้วน" ${curStatus === 'ท้วม/เริ่มอ้วน' ? 'selected' : ''}>🟡 ท้วม / เริ่มอ้วน (น้ำหนักเกิน)</option>
                        <option value="อ้วน" ${curStatus === 'อ้วน' ? 'selected' : ''}>🔴 อ้วน / อ้วนมาก</option>
                        <option value="ค่อนข้างผอม" ${curStatus === 'ค่อนข้างผอม' ? 'selected' : ''}>🔵 ค่อนข้างผอม (ผอมเกินไป)</option>
                      </select>
                    </div>
                  </div>

                  <div style="margin-top: 0.65rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted); padding-top: 0.4rem; border-top: 1px dashed var(--border-color); flex-wrap: wrap; gap: 0.35rem;">
                    <div id="growth-bmi-calc-${child.id}">
                      สูตร: ${w} / (${hM.toFixed(2)})² = <strong>${(w / (hM * hM)).toFixed(2)}</strong>
                    </div>
                    <div style="color: var(--text-muted);">
                      อายุ: ${child.ageString || '2 ขวบ 6 เดือน'} | วัคซีนครบ: ${(child.vaccines || []).length} เข็ม
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (tab === 'DEV_EVAL') {
      const devRecs = window.appStore.getDevelopmentRecords();
      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">แบบบันทึกการประเมินพัฒนาการ 4 ด้าน (เทอม 1/2569)</h3>
            <div>
              <span class="badge badge-parent">มาตรฐานสถานพัฒนาเด็กปฐมวัยแห่งชาติ</span>
              <span class="badge badge-warning" style="font-size: 0.72rem; margin-left: 0.25rem;">⚠️ ไม่ใช้แทนการวินิจฉัยทางการแพทย์</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${children.map(child => {
              const rec = devRecs.find(d => d.childId === child.id) || { physicalScore: 4, emotionalScore: 4, socialScore: 3, intellectualScore: 4, notes: '' };
              return `
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; background: var(--bg-surface);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                    <strong style="font-size: 1.05rem; color: var(--text-main);">${child.nickname} (${child.firstName} ${child.lastName})</strong>
                    <button type="button" class="btn btn-primary btn-sm" onclick="window.TeacherView.saveDevEval('${child.id}', '${containerId}')">💾 บันทึกผลประเมิน</button>
                  </div>

                  <div class="grid-4" style="margin-bottom: 1rem;">
                    <div>
                      <label class="form-label" style="font-size: 0.8rem;">1. ร่างกาย</label>
                      <select id="dev-phy-${child.id}" class="form-control btn-sm">
                        <option value="4" ${rec.physicalScore == 4 ? 'selected' : ''}>ดีเยี่ยม (4.0)</option>
                        <option value="3" ${rec.physicalScore == 3 ? 'selected' : ''}>ดี (3.0)</option>
                        <option value="2" ${rec.physicalScore == 2 ? 'selected' : ''}>ผ่านเกณฑ์ (2.0)</option>
                        <option value="1" ${rec.physicalScore == 1 ? 'selected' : ''}>ควรส่งเสริม (1.0)</option>
                      </select>
                    </div>

                    <div>
                      <label class="form-label" style="font-size: 0.8rem;">2. อารมณ์-จิตใจ</label>
                      <select id="dev-emo-${child.id}" class="form-control btn-sm">
                        <option value="4" ${rec.emotionalScore == 4 ? 'selected' : ''}>ดีเยี่ยม (4.0)</option>
                        <option value="3" ${rec.emotionalScore == 3 ? 'selected' : ''}>ดี (3.0)</option>
                        <option value="2" ${rec.emotionalScore == 2 ? 'selected' : ''}>ผ่านเกณฑ์ (2.0)</option>
                        <option value="1" ${rec.emotionalScore == 1 ? 'selected' : ''}>ควรส่งเสริม (1.0)</option>
                      </select>
                    </div>

                    <div>
                      <label class="form-label" style="font-size: 0.8rem;">3. สังคม</label>
                      <select id="dev-soc-${child.id}" class="form-control btn-sm">
                        <option value="4" ${rec.socialScore == 4 ? 'selected' : ''}>ดีเยี่ยม (4.0)</option>
                        <option value="3" ${rec.socialScore == 3 ? 'selected' : ''}>ดี (3.0)</option>
                        <option value="2" ${rec.socialScore == 2 ? 'selected' : ''}>ผ่านเกณฑ์ (2.0)</option>
                        <option value="1" ${rec.socialScore == 1 ? 'selected' : ''}>ควรส่งเสริม (1.0)</option>
                      </select>
                    </div>

                    <div>
                      <label class="form-label" style="font-size: 0.8rem;">4. สติปัญญา</label>
                      <select id="dev-int-${child.id}" class="form-control btn-sm">
                        <option value="4" ${rec.intellectualScore == 4 ? 'selected' : ''}>ดีเยี่ยม (4.0)</option>
                        <option value="3" ${rec.intellectualScore == 3 ? 'selected' : ''}>ดี (3.0)</option>
                        <option value="2" ${rec.intellectualScore == 2 ? 'selected' : ''}>ผ่านเกณฑ์ (2.0)</option>
                        <option value="1" ${rec.intellectualScore == 1 ? 'selected' : ''}>ควรส่งเสริม (1.0)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="form-label" style="font-size: 0.8rem;">บันทึกพฤติกรรมและข้อสังเกต</label>
                    <input type="text" id="dev-notes-${child.id}" class="form-control btn-sm" value="${rec.notes || 'เด็กมีความสนใจใฝ่รู้ การเคลื่อนไหวปกติ มีมนุษยสัมพันธ์ดี'}" placeholder="ระบุข้อสังเกต...">
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (tab === 'ACTIVITIES') {
      const activities = window.appStore.getActivities() || [];
      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">บันทึกภาพและกิจกรรมประจำวัน</h3>
            <button type="button" class="btn btn-primary btn-sm" onclick="window.ModalsComponent.openActivityModal()">+ เพิ่มกิจกรรมใหม่</button>
          </div>

          <div class="grid-2">
            ${activities.map(act => `
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-surface);">
                <img src="${act.image || './assets/images/banner.png'}" alt="Activity" style="width: 100%; height: 180px; object-fit: cover;" onerror="this.src='./assets/images/banner.png'">
                <div style="padding: 1rem;">
                  <span class="badge badge-info" style="margin-bottom: 0.35rem;">${act.date || window.appStore.getTodayBEString()}</span>
                  <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">${act.title}</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${act.description || ''}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return '';
  },

  handleCheckIn(childId, status, containerId) {
    const teacherName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';
    const child = window.appStore.getChildById(childId);
    window.appStore.updateAttendance(childId, status, teacherName);
    
    const statusLabels = {
      PRESENT: 'มาเรียน',
      LATE: 'มาสาย',
      LEAVE: 'แจ้งลา',
      ABSENT: 'ขาดเรียน',
      UNCHECKED: 'ยังไม่เช็กชื่อ'
    };

    window.appStore.addAuditLog(
      teacherName,
      'UPDATE_ATTENDANCE',
      `เช็กชื่อ ${child ? child.nickname : childId} เป็นสถานะ ${statusLabels[status] || status}`
    );

    if (window.ModalsComponent) {
      window.ModalsComponent.showToast(
        `บันทึกสถานะ "${statusLabels[status] || status}" ของ ${child ? child.nickname : 'เด็ก'} เรียบร้อยแล้ว`,
        status === 'PRESENT' ? 'success' : status === 'LATE' ? 'warning' : status === 'ABSENT' ? 'error' : 'info'
      );
    }

    this.render(containerId);
  },

  handleApproveLeave(leaveId, status, containerId) {
    const teacherName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';
    const updated = window.appStore.updateLeaveStatus(leaveId, status, teacherName, status === 'APPROVED' ? 'อนุมัติเรียบร้อยค่ะ' : 'เนื่องจากไม่อยู่ในเงื่อนไขการลา');
    
    window.appStore.addAuditLog(
      teacherName,
      'APPROVE_LEAVE',
      `ปรับสถานะคำขอแจ้งลา (${leaveId}) เป็น ${status}`
    );

    if (window.ModalsComponent) {
      window.ModalsComponent.showToast(
        status === 'APPROVED' ? `อนุมัติคำขอแจ้งลาของ ${updated ? updated.childName : 'เด็ก'} เรียบร้อยแล้ว (อัปเดตสถานะการเข้าเรียนและแจ้ง LINE แล้ว)` : `บันทึกสถานะไม่อนุมัติคำขอแจ้งลาเรียบร้อยแล้ว`,
        status === 'APPROVED' ? 'success' : 'warning'
      );
    }

    this.render(containerId);
  },

  // Real-Time Auto BMI Calculation & Growth Classification
  autoCalcBMI(childId) {
    const hElem = document.getElementById(`growth-h-${childId}`);
    const wElem = document.getElementById(`growth-w-${childId}`);
    const statusElem = document.getElementById(`growth-status-${childId}`);
    const badgeElem = document.getElementById(`growth-bmi-badge-${childId}`);
    const calcElem = document.getElementById(`growth-bmi-calc-${childId}`);

    if (!hElem || !wElem) return { bmi: 0, status: 'สมส่วนตามเกณฑ์' };

    const heightCm = parseFloat(hElem.value) || 0;
    const weightKg = parseFloat(wElem.value) || 0;

    if (heightCm <= 0 || weightKg <= 0) {
      if (badgeElem) {
        badgeElem.style.background = '#9CA3AF';
        badgeElem.innerHTML = 'โปรดระบุส่วนสูง & น้ำหนัก';
      }
      if (calcElem) calcElem.innerHTML = 'สูตร: น้ำหนัก (กก.) / [ส่วนสูง (ม.)]²';
      return { bmi: 0, status: 'สมส่วนตามเกณฑ์' };
    }

    const heightM = heightCm / 100;
    const rawBmi = weightKg / (heightM * heightM);
    const bmi = parseFloat(rawBmi.toFixed(1));
    const bmiDetailed = rawBmi.toFixed(2);

    // Standard Classification:
    // Toddlers & Early Childhood (Department of Health Thailand & WHO criteria)
    let status = 'สมส่วนตามเกณฑ์';
    let badgeBg = '#10B981';

    if (heightCm < 130) {
      // Early childhood (2-5 years old toddler standard)
      if (rawBmi < 13.8) {
        status = 'ค่อนข้างผอม';
        badgeBg = '#3B82F6';
      } else if (rawBmi <= 17.5) {
        status = 'สมส่วนตามเกณฑ์';
        badgeBg = '#10B981';
      } else if (rawBmi <= 19.0) {
        status = 'ท้วม/เริ่มอ้วน';
        badgeBg = '#F59E0B';
      } else {
        status = 'อ้วน';
        badgeBg = '#EF4444';
      }
    } else {
      // General / Adult BMI criteria
      if (rawBmi < 18.5) {
        status = 'ค่อนข้างผอม';
        badgeBg = '#3B82F6';
      } else if (rawBmi <= 22.9) {
        status = 'สมส่วนตามเกณฑ์';
        badgeBg = '#10B981';
      } else if (rawBmi <= 24.9) {
        status = 'ท้วม/เริ่มอ้วน';
        badgeBg = '#F59E0B';
      } else {
        status = 'อ้วน';
        badgeBg = '#EF4444';
      }
    }

    // Auto-update select element
    if (statusElem) {
      statusElem.value = status;
    }

    // Auto-update live badge
    if (badgeElem) {
      badgeElem.style.background = badgeBg;
      badgeElem.innerHTML = `BMI: ${bmi} (${status})`;
    }

    // Auto-update live formula string
    if (calcElem) {
      calcElem.innerHTML = `สูตร: ${weightKg} / (${heightM.toFixed(2)})² = <strong>${bmiDetailed}</strong> (BMI: ${bmi})`;
    }

    return { bmi, status };
  },

  saveGrowthData(childId, containerId) {
    const teacherName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';
    const child = window.appStore.getChildById(childId);
    const childNickname = child ? child.nickname : 'เด็ก';

    // Calculate real-time BMI & status
    const calc = this.autoCalcBMI(childId);
    const hElem = document.getElementById(`growth-h-${childId}`);
    const wElem = document.getElementById(`growth-w-${childId}`);
    const statusElem = document.getElementById(`growth-status-${childId}`);

    const height = hElem ? (parseFloat(hElem.value) || 92.0) : 92.0;
    const weight = wElem ? (parseFloat(wElem.value) || 13.5) : 13.5;
    const bmi = calc.bmi || parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
    const growthStatus = (statusElem && statusElem.value) || calc.status || 'สมส่วนตามเกณฑ์';

    window.appStore.updateChild(childId, {
      heightCm: height,
      weightKg: weight,
      bmi: bmi,
      growthStatus: growthStatus
    });

    window.appStore.addAuditLog(
      teacherName,
      'SAVE_GROWTH_DATA',
      `บันทึกข้อมูลการเติบโต (ส่วนสูง ${height} ซม. / น้ำหนัก ${weight} กก. / BMI ${bmi} - ${growthStatus}) ของ ${childNickname}`
    );

    if (window.ModalsComponent) {
      window.ModalsComponent.showToast(`บันทึกข้อมูล ${childNickname} เรียบร้อยแล้ว! (ส่วนสูง ${height} ซม. / น้ำหนัก ${weight} กก. / BMI ${bmi} : ${growthStatus})`, 'success');
    }
    this.render(containerId);
  },

  saveDevEval(childId, containerId) {
    const teacherName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';
    const child = window.appStore.getChildById(childId);
    const childName = child ? `${child.nickname} (${child.firstName} ${child.lastName})` : childId;

    const phyElem = document.getElementById(`dev-phy-${childId}`);
    const emoElem = document.getElementById(`dev-emo-${childId}`);
    const socElem = document.getElementById(`dev-soc-${childId}`);
    const intElem = document.getElementById(`dev-int-${childId}`);
    const notesElem = document.getElementById(`dev-notes-${childId}`);

    const physicalScore = phyElem ? parseInt(phyElem.value, 10) : 4;
    const emotionalScore = emoElem ? parseInt(emoElem.value, 10) : 4;
    const socialScore = socElem ? parseInt(socElem.value, 10) : 3;
    const intellectualScore = intElem ? parseInt(intElem.value, 10) : 4;
    const notes = notesElem ? notesElem.value.trim() : 'เด็กมีความสนใจใฝ่รู้ การเคลื่อนไหวปกติ มีมนุษยสัมพันธ์ดี';

    window.appStore.saveDevelopmentRecord({
      childId,
      childName,
      term: '1/2569',
      evalDate: window.appStore.getTodayBEString(),
      physicalScore,
      emotionalScore,
      socialScore,
      intellectualScore,
      evaluator: teacherName,
      notes
    });

    window.appStore.addAuditLog(
      teacherName,
      'SAVE_DEV_EVAL',
      `บันทึกผลการประเมินพัฒนาการ 4 ด้าน ของ ${childName}`
    );

    if (window.ModalsComponent) {
      window.ModalsComponent.showToast(`บันทึกผลประเมินพัฒนาการของ ${childName} เรียบร้อยแล้ว!`, 'success');
    }
    this.render(containerId);
  },

  exportAttendanceCSV() {
    const children = window.appStore.getChildren(this.selectedClassId) || [];
    const attendance = window.appStore.getAttendance() || [];
    const today = window.appStore.getTodayBEString();
    
    const rows = [
      ['ศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่ จังหวัดนนทบุรี'],
      [`รายงานการเช็กชื่อเข้าเรียน ประจำวันที่ ${today}`],
      [''],
      ['ลำดับ', 'รหัสนักเรียน', 'ชื่อ-นามสกุล', 'ชื่อเล่น', 'สถานะการมาเรียน', 'เวลาเช็กชื่อ', 'ผู้ปกครอง', 'เบอร์ติดต่อ']
    ];

    children.forEach((c, idx) => {
      const att = attendance.find(a => a.childId === c.id);
      const statusText = !att ? 'ยังไม่เช็กชื่อ' : att.status === 'PRESENT' ? 'มาเรียน' : att.status === 'LATE' ? 'มาสาย' : att.status === 'LEAVE' ? 'ลา' : 'ขาด';
      rows.push([
        idx + 1,
        c.id,
        `${c.firstName} ${c.lastName}`,
        c.nickname,
        statusText,
        att ? (att.checkTime || '-') : '-',
        c.parentName,
        c.parentPhone
      ]);
    });

    window.ExportUtils.exportToCSV(`รายงานเช็กชื่อ_${today}.csv`, rows);
    if (window.ModalsComponent) {
      window.ModalsComponent.showToast('ส่งออกไฟล์ Excel (CSV) เรียบร้อยแล้ว', 'success');
    }
  }
};

window.TeacherView = TeacherView;
