/* ==========================================================================
   Bang Yai Child Development Center MIS - Parent View Component
   Parent Interface: Attendance, Leave Requests, Meals & Development Records
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

            <!-- Child Selector dropdown if multiple children -->
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label style="font-size: 0.85rem; font-weight: 600;">เลือกบุตรหลาน:</label>
              <select class="form-control" style="width: auto; min-height: 38px;" onchange="ParentView.selectedChildId = this.value; ParentView.render('${containerId}');">
                ${children.map(c => `<option value="${c.id}" ${c.id === activeChild.id ? 'selected' : ''}>${c.nickname} (${c.firstName})</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Quick Stat Grid -->
        <div class="grid-3" style="margin-bottom: 1.5rem;">
          <!-- Today Attendance Status -->
          <div class="glass-card stat-card">
            <div class="stat-icon emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <div class="stat-label">สถานะการมาเรียนวันนี้</div>
              <div class="stat-value" style="font-size: 1.3rem;">
                ${childAtt ? (childAtt.status === 'PRESENT' ? '<span style="color: var(--success-500);">มาเรียน (07:45 น.)</span>' : '<span style="color: var(--warning-500);">แจ้งลาป่วย</span>') : 'รอครูเช็กชื่อ'}
              </div>
              <div class="stat-label" style="font-size: 0.75rem;">ผู้เช็กชื่อ: ${childAtt ? childAtt.checkedBy : '-'}</div>
            </div>
          </div>

          <!-- Today Meal Quick Summary -->
          <div class="glass-card stat-card">
            <div class="stat-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            </div>
            <div>
              <div class="stat-label">เมนูอาหารกลางวันวันนี้</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-main); line-height: 1.3;">
                ${todayMeal.lunch || 'ข้าวสวย + ต้มจืดฟักใส่ไก่'}
              </div>
              <div class="stat-label" style="font-size: 0.75rem;">แพ้อาหาร: <strong style="color: var(--danger-500);">${activeChild.allergy}</strong></div>
            </div>
          </div>

          <!-- Leave Action Card -->
          <div class="glass-card stat-card" style="justify-content: space-between;">
            <div>
              <div class="stat-label">คำขอแจ้งลา</div>
              <div class="stat-value" style="font-size: 1.2rem;">
                ${leaveReqs.length} รายการ
              </div>
              <div class="stat-label" style="font-size: 0.75rem;">
                ${leaveReqs.find(l => l.status === 'PENDING') ? '<span style="color: var(--warning-500);">มีรายการรอการอนุมัติ</span>' : 'ไม่มีรายการค้าง'}
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="ModalsComponent.openLeaveModal('${activeChild.id}')">
              + ยื่นแจ้งลา
            </button>
          </div>
        </div>

        <!-- 2 Column Section: Development Record & Announcements -->
        <div class="grid-2" style="margin-bottom: 1.5rem;">
          <!-- Left: Development Scores -->
          <div class="glass-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h3 style="font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                ผลการประเมินพัฒนาการรายบุคคล (4 ด้าน)
              </h3>
              <span class="badge badge-info">เทอม 1/2569</span>
            </div>

            <div id="parent-dev-bars" style="margin-bottom: 1.25rem;"></div>

            <div style="background: var(--bg-app); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted); border-left: 3px solid var(--primary-600);">
              <strong>ข้อสังเกตจากครูผู้ดูแล (${devRec ? devRec.evaluator : 'ครูวิภาดา'}):</strong><br>
              "${devRec ? devRec.notes : 'เด็กมีพัฒนาการสมวัยดีเยี่ยม ร่าเริง สื่อสารชัดเจน เข้ากับเพื่อนได้ดี'}"
            </div>
          </div>

          <!-- Right: Center Announcements -->
          <div class="glass-card">
            <h3 style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              ข่าวสารและประกาศศูนย์พัฒนาเด็กเล็ก
            </h3>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${announcements.map(ann => `
                <div style="padding: 0.85rem; border-radius: var(--radius-md); background: var(--bg-app); border-left: 4px solid ${ann.pinned ? 'var(--primary-600)' : 'var(--border-color)'};">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                    <strong style="font-size: 0.95rem; color: var(--text-main);">${ann.title}</strong>
                    ${ann.pinned ? '<span class="badge badge-warning" style="font-size: 0.7rem;">หมุดสำคัญ</span>' : ''}
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.35rem;">${ann.content}</p>
                  <span style="font-size: 0.75rem; color: var(--text-subtle);">${ann.author} • ${ann.createdAt}</span>
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

    // Render Development bars chart
    setTimeout(() => {
      window.ChartUtils.renderDevelopmentBars('parent-dev-bars', devRec || { physical: 4, emotional: 4, social: 3, intellectual: 4 });
    }, 50);
  }
};

window.ParentView = ParentView;
