/* ==========================================================================
   Bang Yai Child Development Center MIS - Teacher View Component
   Teacher Interface: Attendance Grid, Leave Approvals, Activity & Growth/Dev
   ========================================================================== */

const TeacherView = {
  selectedClassId: 'class-bm',
  currentTab: 'ATTENDANCE', // ATTENDANCE, LEAVE_APPROVALS, DEV_EVAL, GROWTH_RECORD, ACTIVITIES

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const classrooms = window.appStore.getClassrooms();
    const activeClass = classrooms.find(c => c.id === this.selectedClassId) || classrooms[0];
    const children = window.appStore.getChildren(this.selectedClassId);
    const attendance = window.appStore.getAttendance();
    const leaveReqs = window.appStore.getLeaveRequests();
    const pendingLeaves = leaveReqs.filter(l => l.status === 'PENDING');

    const classAtts = attendance.filter(a => children.some(c => c.id === a.childId));
    const checkedCount = classAtts.length;
    const presentCount = classAtts.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const rate = checkedCount > 0 ? Math.round((presentCount / (checkedCount || 1)) * 100) : 0;

    container.innerHTML = `
      <div class="animate-fade-in">
        <!-- Header Banner & Class Selector -->
        <div class="glass-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(238, 242, 255, 0.9), rgba(224, 231, 255, 0.9)); border-color: rgba(79, 70, 229, 0.2);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-teacher" style="margin-bottom: 0.25rem;">มุมมองครู / ผู้ดูแลเด็ก</span>
              <h2 style="font-size: 1.35rem; font-weight: 700; margin: 0;">${activeClass.name}</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                ครูประจำชั้น: <strong>${activeClass.teacherName}</strong> | เช็กชื่อแล้ว: <strong>${checkedCount}/${children.length} คน</strong>
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <select class="form-control" style="width: auto; min-height: 38px; font-weight: 600;" onchange="TeacherView.selectedClassId = this.value; TeacherView.render('${containerId}');">
                ${classrooms.map(c => `<option value="${c.id}" ${c.id === activeClass.id ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
              <button class="btn btn-primary btn-sm" onclick="ModalsComponent.openAnnouncementModal()">
                + ประกาศใหม่
              </button>
            </div>
          </div>
        </div>

        <!-- Sub Tabs for Teacher -->
        <div class="view-tabs">
          <button class="tab-link ${this.currentTab === 'ATTENDANCE' ? 'active' : ''}" onclick="TeacherView.currentTab = 'ATTENDANCE'; TeacherView.render('${containerId}');">
            📋 เช็กชื่อการเข้าเรียน (${checkedCount}/${children.length} คน)
          </button>
          <button class="tab-link ${this.currentTab === 'LEAVE_APPROVALS' ? 'active' : ''}" onclick="TeacherView.currentTab = 'LEAVE_APPROVALS'; TeacherView.render('${containerId}');">
            📩 คำขอแจ้งลา ${pendingLeaves.length > 0 ? `<span class="badge" style="background: #F59E0B; color: #FFF; font-weight: 700; padding: 2px 8px; font-size: 0.75rem; margin-left: 4px;">${pendingLeaves.length} รออนุมัติ</span>` : `(${leaveReqs.length})`}
          </button>
          <button class="tab-link ${this.currentTab === 'DEV_EVAL' ? 'active' : ''}" onclick="TeacherView.currentTab = 'DEV_EVAL'; TeacherView.render('${containerId}');">
            📊 ประเมินพัฒนาการ 4 ด้าน
          </button>
          <button class="tab-link ${this.currentTab === 'GROWTH_RECORD' ? 'active' : ''}" onclick="TeacherView.currentTab = 'GROWTH_RECORD'; TeacherView.render('${containerId}');">
            ⚖️ บันทึกส่วนสูง / น้ำหนัก / วัคซีน
          </button>
          <button class="tab-link ${this.currentTab === 'ACTIVITIES' ? 'active' : ''}" onclick="TeacherView.currentTab = 'ACTIVITIES'; TeacherView.render('${containerId}');">
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
              <button class="btn btn-sm btn-primary" onclick="TeacherView.currentTab = 'LEAVE_APPROVALS'; TeacherView.render('${containerId}');" style="background: #D97706; border-color: #D97706; color: #FFF; font-weight: 700;">
                👉 ตรวจสอบและอนุมัติ (${pendingLeaves.length})
              </button>
            </div>
          </div>
        ` : ''}

        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <h3 style="font-weight: 700; font-size: 1.1rem;">ระบบเช็กชื่อรายวันประจำวันที่ ${window.appStore.getTodayThaiFormatted()}</h3>
            <span class="badge badge-line">💬 แจ้งเตือน LINE อัตโนมัติ</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${children.map(child => {
              const att = attendance.find(a => a.childId === child.id);
              const status = att ? att.status : null;
              const childPendingLeave = pendingLeaves.find(p => p.childId === child.id);
              
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
                        <div class="student-avatar" style="background-color: ${child.avatarColor}; color: #FFF;">
                          ${child.nickname.charAt(0)}
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
                        <button class="att-btn ${!status ? 'selected' : ''}" style="background: ${!status ? '#6B7280' : '#F3F4F6'}; color: ${!status ? '#FFFFFF' : '#4B5563'}; border: 1px solid #D1D5DB;" onclick="TeacherView.handleCheckIn('${child.id}', 'UNCHECKED', '${containerId}')">
                          ⏳ ยังไม่เช็ก
                        </button>
                        <button class="att-btn present ${status === 'PRESENT' ? 'selected' : ''}" onclick="TeacherView.handleCheckIn('${child.id}', 'PRESENT', '${containerId}')">
                          ✓ มาเรียน
                        </button>
                        <button class="att-btn late ${status === 'LATE' ? 'selected' : ''}" onclick="TeacherView.handleCheckIn('${child.id}', 'LATE', '${containerId}')">
                          ⏱ มาสาย
                        </button>
                        <button class="att-btn leave ${status === 'LEAVE' ? 'selected' : ''}" onclick="TeacherView.handleCheckIn('${child.id}', 'LEAVE', '${containerId}')">
                          📄 แจ้งลา
                        </button>
                        <button class="att-btn absent ${status === 'ABSENT' ? 'selected' : ''}" onclick="TeacherView.handleCheckIn('${child.id}', 'ABSENT', '${containerId}')">
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
                          <button class="btn btn-success btn-sm" style="padding: 0.25rem 0.75rem; font-size: 0.8rem; font-weight: 700;" onclick="TeacherView.handleApproveLeave('${childPendingLeave.id}', 'APPROVED', '${containerId}')">✓ อนุมัติการลา</button>
                          <button class="btn btn-danger btn-sm" style="padding: 0.25rem 0.75rem; font-size: 0.8rem; font-weight: 700;" onclick="TeacherView.handleApproveLeave('${childPendingLeave.id}', 'REJECTED', '${containerId}')">✕ ไม่อนุมัติ</button>
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
            <button class="btn btn-secondary btn-sm" onclick="TeacherView.render('${containerId}')">
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
                          <button class="btn btn-success btn-sm" style="font-weight: 700; padding: 0.3rem 0.75rem;" onclick="TeacherView.handleApproveLeave('${l.id}', 'APPROVED', '${containerId}')">✓ อนุมัติ</button>
                          <button class="btn btn-danger btn-sm" style="font-weight: 700; padding: 0.3rem 0.75rem;" onclick="TeacherView.handleApproveLeave('${l.id}', 'REJECTED', '${containerId}')">✕ ไม่อนุมัติ</button>
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
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <h3 style="font-weight: 700; font-size: 1.1rem;">บันทึกส่วนสูง น้ำหนัก และประวัติวัคซีนเด็กปฐมวัย</h3>
            <span class="badge badge-success">ตามเกณฑ์กรมอนามัย</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${children.map(child => `
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; background: var(--bg-surface);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                  <strong>${child.nickname} (${child.firstName} ${child.lastName})</strong>
                  <button class="btn btn-primary btn-sm" onclick="TeacherView.saveGrowthData('${child.id}', '${child.nickname}', '${containerId}')">💾 บันทึกการเติบโต</button>
                </div>

                <div class="grid-3">
                  <div>
                    <label class="form-label" style="font-size: 0.8rem;">ส่วนสูง (ซม.)</label>
                    <input type="number" step="0.1" id="growth-h-${child.id}" class="form-control btn-sm" value="${child.heightCm || 98.5}">
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.8rem;">น้ำหนัก (กก.)</label>
                    <input type="number" step="0.1" id="growth-w-${child.id}" class="form-control btn-sm" value="${child.weightKg || 15.2}">
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.8rem;">การประเมินการเติบโต</label>
                    <select id="growth-status-${child.id}" class="form-control btn-sm">
                      <option value="สมส่วนตามเกณฑ์" ${child.growthStatus === 'สมส่วนตามเกณฑ์' ? 'selected' : ''}>สมส่วนตามเกณฑ์</option>
                      <option value="ท้วม/เริ่มอ้วน" ${child.growthStatus === 'ท้วม/เริ่มอ้วน' ? 'selected' : ''}>ท้วม/เริ่มอ้วน</option>
                      <option value="ค่อนข้างผอม" ${child.growthStatus === 'ค่อนข้างผอม' ? 'selected' : ''}>ค่อนข้างผอม</option>
                    </select>
                  </div>
                </div>
              </div>
            `).join('')}
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
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                    <strong style="font-size: 1.05rem; color: var(--text-main);">${child.nickname} (${child.firstName} ${child.lastName})</strong>
                    <button class="btn btn-primary btn-sm" onclick="TeacherView.saveDevEval('${child.id}', '${child.nickname} (${child.firstName})', '${containerId}')">💾 บันทึกผลประเมิน</button>
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
      const activities = window.appStore.getActivities();
      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <h3 style="font-weight: 700; font-size: 1.1rem;">บันทึกภาพและกิจกรรมประจำวัน</h3>
            <button class="btn btn-primary btn-sm" onclick="ModalsComponent.openActivityModal()">+ เพิ่มกิจกรรมใหม่</button>
          </div>

          <div class="grid-2">
            ${activities.map(act => `
              <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-surface);">
                <img src="${act.image}" alt="Activity" style="width: 100%; height: 180px; object-fit: cover;">
                <div style="padding: 1rem;">
                  <span class="badge badge-info" style="margin-bottom: 0.35rem;">${act.date}</span>
                  <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem;">${act.title}</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted);">${act.description}</p>
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
    
    window.appStore.addAuditLog(
      teacherName,
      'UPDATE_ATTENDANCE',
      `เช็กชื่อ ${child ? child.nickname : childId} เป็นสถานะ ${status}`
    );

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

  saveGrowthData(childId, childNickname, containerId) {
    const teacherName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';
    const child = window.appStore.getChildById(childId);
    if (child) {
      const height = parseFloat(document.getElementById(`growth-h-${childId}`).value) || 98.5;
      const weight = parseFloat(document.getElementById(`growth-w-${childId}`).value) || 15.2;
      const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
      
      child.heightCm = height;
      child.weightKg = weight;
      child.bmi = bmi;
      child.growthStatus = document.getElementById(`growth-status-${childId}`).value;
      window.appStore.saveData(window.appStore.data);

      window.appStore.addAuditLog(
        teacherName,
        'SAVE_GROWTH_DATA',
        `บันทึกข้อมูลการเติบโต (ส่วนสูง ${height} ซม. / น้ำหนัก ${weight} กก. / BMI ${bmi}) ของ ${childNickname}`
      );

      if (window.ModalsComponent) {
        window.ModalsComponent.showToast(`บันทึกข้อมูลส่วนสูงและน้ำหนักของ ${childNickname} เรียบร้อยแล้ว! (BMI: ${bmi})`, 'success');
      }
      this.render(containerId);
    }
  },

  saveDevEval(childId, childName, containerId) {
    const teacherName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';
    const physicalScore = parseInt(document.getElementById(`dev-phy-${childId}`).value);
    const emotionalScore = parseInt(document.getElementById(`dev-emo-${childId}`).value);
    const socialScore = parseInt(document.getElementById(`dev-soc-${childId}`).value);
    const intellectualScore = parseInt(document.getElementById(`dev-int-${childId}`).value);
    const notes = document.getElementById(`dev-notes-${childId}`).value;

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
  }
};

window.TeacherView = TeacherView;
