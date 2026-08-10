/* ==========================================================================
   Bang Yai Child Development Center MIS - Parent View Component
   Parent Interface: Attendance, LINE Notifications, Growth/Vaccines & Radar Chart
   ========================================================================== */

const ParentView = {
  selectedChildId: 'child-101',

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const children = window.appStore.getChildren();
    const activeChild = window.appStore.getChildById(this.selectedChildId) || children[0];
    const attendance = window.appStore.getAttendance('2569-08-10');
    const childAtt = attendance.find(a => a.childId === activeChild.id);
    const leaveReqs = window.appStore.getLeaveRequests().filter(l => l.childId === activeChild.id);
    const meals = window.appStore.getMealPlan();
    const todayMeal = meals[0] || {};
    const announcements = window.appStore.getAnnouncements();
    const devRec = window.appStore.getDevelopmentRecords().find(d => d.childId === activeChild.id);
    const lineNotifs = window.appStore.getLineNotifications();

    container.innerHTML = `
      <div class="animate-fade-in">
        <!-- Top Banner & Child Selector -->
        <div class="glass-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, rgba(236, 253, 245, 0.9), rgba(209, 250, 229, 0.9)); border-color: rgba(16, 185, 129, 0.2);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div class="student-avatar" style="width: 56px; height: 56px; font-size: 1.5rem; background: var(--role-parent); color: #FFF;">
                ${activeChild.nickname.substring(4, 5)}
              </div>
              <div>
                <span class="badge badge-parent" style="margin-bottom: 0.25rem;">มุมมองผู้ปกครอง</span>
                <h2 style="font-size: 1.35rem; font-weight: 700; margin: 0;">${activeChild.firstName} ${activeChild.lastName} (${activeChild.nickname})</h2>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                  ห้องอนุบาล 1/1 | อายุ ${activeChild.ageString} | ผู้ปกครอง: ${activeChild.parentName} (${activeChild.parentRelation})
                </p>
              </div>
            </div>

            <!-- Child Selector dropdown -->
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label style="font-size: 0.85rem; font-weight: 600;">เลือกบุตรหลาน:</label>
              <select class="form-control" style="width: auto; min-height: 38px;" onchange="ParentView.selectedChildId = this.value; ParentView.render('${containerId}');">
                ${children.map(c => `<option value="${c.id}" ${c.id === activeChild.id ? 'selected' : ''}>${c.nickname} (${c.firstName})</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Quick Stat Grid -->
        <div class="grid-4" style="margin-bottom: 1.5rem;">
          <!-- Today Attendance Status -->
          <div class="glass-card stat-card">
            <div class="stat-icon emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <div class="stat-label">สถานะการมาเรียนวันนี้</div>
              <div class="stat-value" style="font-size: 1.2rem;">
                ${childAtt ? (childAtt.status === 'PRESENT' ? '<span style="color: var(--success-500);">มาเรียน (07:45 น.)</span>' : '<span style="color: var(--warning-500);">แจ้งลาป่วย</span>') : 'รอครูเช็กชื่อ'}
              </div>
              <div class="stat-label" style="font-size: 0.75rem;">ผู้เช็กชื่อ: ${childAtt ? childAtt.checkedBy : '-'}</div>
            </div>
          </div>

          <!-- Growth & BMI Status -->
          <div class="glass-card stat-card">
            <div class="stat-icon indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/></svg>
            </div>
            <div>
              <div class="stat-label">ส่วนสูง / น้ำหนัก / BMI</div>
              <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">
                ${activeChild.heightCm || 98.5} ซม. | ${activeChild.weightKg || 15.2} กก.
              </div>
              <div class="stat-label" style="font-size: 0.75rem;"><span class="badge badge-success" style="padding: 1px 6px; font-size: 0.7rem;">${activeChild.growthStatus || 'สมส่วนตามเกณฑ์'}</span></div>
            </div>
          </div>

          <!-- Today Meal Summary -->
          <div class="glass-card stat-card">
            <div class="stat-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
            </div>
            <div>
              <div class="stat-label">เมนูอาหารกลางวันวันนี้</div>
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main); line-height: 1.3;">
                ${todayMeal.lunch || 'ข้าวสวย + ต้มจืดฟักใส่ไก่'}
              </div>
              <div class="stat-label" style="font-size: 0.75rem;">แพ้อาหาร: <strong style="color: var(--danger-500);">${activeChild.allergy}</strong></div>
            </div>
          </div>

          <!-- Leave Action Card -->
          <div class="glass-card stat-card" style="justify-content: space-between;">
            <div>
              <div class="stat-label">คำขอแจ้งลา</div>
              <div class="stat-value" style="font-size: 1.2rem;">${leaveReqs.length} รายการ</div>
              <div class="stat-label" style="font-size: 0.75rem;">${leaveReqs.find(l => l.status === 'PENDING') ? '<span style="color: var(--warning-500);">รอครูอนุมัติ</span>' : 'ไม่มีค้าง'}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="ModalsComponent.openLeaveModal('${activeChild.id}')">+ แจ้งลา</button>
          </div>
        </div>

        <!-- LINE Official Account Live Notification Stream -->
        <div class="glass-card" style="margin-bottom: 1.5rem; background: var(--line-bg); border-color: rgba(6, 199, 85, 0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-line" style="font-size: 0.85rem; font-weight: 700;">💬 LINE Official Account Notification (จำลองการส่งเข้ามือถือ)</span>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">แจ้งเตือนแบบ Real-Time</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${lineNotifs.slice(0, 2).map(n => `
              <div style="background: #FFFFFF; border-radius: var(--radius-md); padding: 0.75rem 1rem; border-left: 4px solid var(--line-green); box-shadow: var(--shadow-sm);">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #111827; margin-bottom: 2px;">
                  <span>${n.title}</span>
                  <span style="font-size: 0.75rem; color: #6B7280; font-weight: normal;">${n.timestamp}</span>
                </div>
                <p style="font-size: 0.85rem; color: #374151; margin: 0;">${n.message}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2 Column Section: Development Spider Radar Chart & Growth Vaccines -->
        <div class="grid-2" style="margin-bottom: 1.5rem;">
          <!-- Left: Spider Radar Chart -->
          <div class="glass-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h3 style="font-weight: 700; font-size: 1.1rem;">กราฟใยแมงมุมประเมินพัฒนาการ 4 ด้าน</h3>
              <span class="badge badge-info">เทอม 1/2569</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap;">
              <div id="parent-radar-chart"></div>
              <div style="flex: 1; min-width: 180px;">
                <div id="parent-dev-bars"></div>
              </div>
            </div>

            <div style="background: var(--bg-app); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted); border-left: 3px solid var(--primary-600); margin-top: 1rem;">
              <strong>ข้อสังเกตจากครูผู้ดูแล (${devRec ? devRec.evaluator : 'ครูวิภาดา'}):</strong><br>
              "${devRec ? devRec.notes : 'เด็กมีพัฒนาการสมวัยดีเยี่ยม ร่าเริง สื่อสารชัดเจน เข้ากับเพื่อนได้ดี'}"
            </div>
          </div>

          <!-- Right: Vaccines & Growth Tracking -->
          <div class="glass-card">
            <h3 style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              ประวัติการได้รับวัคซีนและสุขภาพปฐมวัย
            </h3>

            <div style="margin-bottom: 1rem;">
              <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">รายการวัคซีนที่ได้รับแล้วตามเกณฑ์กรมอนามัย:</label>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                ${(activeChild.vaccines || ['BCG', 'MMR', 'คอกรน-โปลิโอ']).map(v => `<span class="badge badge-success">✓ ${v}</span>`).join('')}
              </div>
            </div>

            <h4 style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-main);">ข่าวสารศูนย์พัฒนาเด็กเล็ก</h4>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${announcements.slice(0, 2).map(ann => `
                <div style="padding: 0.65rem; border-radius: var(--radius-md); background: var(--bg-app); border-left: 3px solid var(--primary-600);">
                  <strong style="font-size: 0.88rem; color: var(--text-main);">${ann.title}</strong>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0;">${ann.content}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- History Table of Leave Requests -->
        <div class="glass-card">
          <h3 style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem;">ประวัติคำขอแจ้งลาของ ${activeChild.nickname}</h3>
          
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>วันที่ยื่น</th>
                  <th>ประเภทการลา</th>
                  <th>ช่วงวันที่ลา</th>
                  <th>เหตุผลการลา</th>
                  <th>สถานะ</th>
                  <th>หมายเหตุครู</th>
                </tr>
              </thead>
              <tbody>
                ${leaveReqs.length ? leaveReqs.map(l => `
                  <tr>
                    <td>${l.submittedAt}</td>
                    <td><span class="badge badge-info">${l.leaveType}</span></td>
                    <td>${l.startDate} ถึง ${l.endDate}</td>
                    <td>${l.reason}</td>
                    <td>
                      ${l.status === 'APPROVED' ? '<span class="badge badge-success">อนุมัติแล้ว</span>' :
                        l.status === 'REJECTED' ? '<span class="badge badge-danger">ไม่อนุมัติ</span>' :
                        '<span class="badge badge-warning">รออนุมัติ</span>'}
                    </td>
                    <td>${l.remark || '-'}</td>
                  </tr>
                `).join('') : '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">ยังไม่มีประวัติการแจ้งลา</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Render Charts
    setTimeout(() => {
      window.ChartUtils.renderRadarChart('parent-radar-chart', devRec || { physicalScore: 4, emotionalScore: 4, socialScore: 3, intellectualScore: 4 });
      window.ChartUtils.renderDevelopmentBars('parent-dev-bars', devRec || { physicalScore: 4, emotionalScore: 4, socialScore: 3, intellectualScore: 4 });
    }, 50);
  }
};

window.ParentView = ParentView;
