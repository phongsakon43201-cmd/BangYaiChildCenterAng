/* ==========================================================================
   Bang Yai Child Development Center MIS - Interactive Modals Component
   ========================================================================== */

const ModalsComponent = {
  activeChildId: null,

  renderContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="app-modal-backdrop" class="modal-backdrop">
        <div id="app-modal-content" class="modal-content">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;
  },

  openLeaveModal(childId) {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    const child = window.appStore.getChildById(childId) || { nickname: 'บุตรหลาน', id: childId };
    this.activeChildId = child.id;

    content.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">📄 ยื่นคำขอแจ้งลาสำหรับ ${child.nickname}</h3>
        <button class="btn btn-secondary btn-sm" onclick="ModalsComponent.closeModal()">✕</button>
      </div>

      <form onsubmit="ModalsComponent.submitLeaveForm(event)">
        <div class="form-group">
          <label class="form-label">ประเภทการลา</label>
          <select id="modal-leave-type" class="form-control" required>
            <option value="ลาป่วย">ลาป่วย (ไข้หวัด/ปวดศีรษะ/กักตัว)</option>
            <option value="ลากิจ">ลากิจ (ธุระครอบครัว/เดินทางต่างจังหวัด)</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>

        <div class="grid-2" style="margin-bottom: 1rem;">
          <div>
            <label class="form-label">ตั้งแต่วันที่</label>
            <input type="date" id="modal-leave-start" class="form-control" value="${window.appStore ? window.appStore.getTodayBEString() : '2569-08-12'}" required>
          </div>
          <div>
            <label class="form-label">ถึงวันที่</label>
            <input type="date" id="modal-leave-end" class="form-control" value="${window.appStore ? window.appStore.getTodayBEString() : '2569-08-12'}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">รายละเอียด / เหตุผลการลา</label>
          <textarea id="modal-leave-reason" class="form-control" rows="3" placeholder="ระบุเหตุผลการลา..." required></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="ModalsComponent.closeModal()">ยกเลิก</button>
          <button type="submit" class="btn btn-primary">ส่งคำขอแจ้งลา</button>
        </div>
      </form>
    `;

    backdrop.classList.add('active');
  },

  submitLeaveForm(e) {
    e.preventDefault();
    const leaveType = document.getElementById('modal-leave-type').value;
    const startDate = document.getElementById('modal-leave-start').value;
    const endDate = document.getElementById('modal-leave-end').value;
    const reason = document.getElementById('modal-leave-reason').value;

    const child = window.appStore.getChildById(this.activeChildId) || window.appStore.getChildren()[0];
    const currentUser = window.authController.getCurrentUser();
    const parentName = currentUser ? currentUser.name : child.parentName;

    window.appStore.addLeaveRequest({
      childId: child.id,
      childName: `${child.nickname} (${child.firstName} ${child.lastName})`,
      parentName: parentName,
      leaveType,
      startDate,
      endDate,
      reason
    });

    window.appStore.addAuditLog(
      parentName,
      'SUBMIT_LEAVE',
      `ยื่นคำขอแจ้งลา (${leaveType}) ให้ ${child.nickname} (${child.firstName}) วันที่ ${startDate} ถึง ${endDate}`
    );

    this.showToast('ส่งคำขอแจ้งลาเรียบร้อยแล้ว! ส่งข้อมูลไปยังครูประจำชั้นแล้ว [สถานะ: รอครูอนุมัติ]', 'success');
    this.closeModal();

    if (window.appController) {
      window.appController.refreshCurrentView();
    }
  },

  openAnnouncementModal() {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    content.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">📢 ประกาศข่าวสารใหม่</h3>
        <button class="btn btn-secondary btn-sm" onclick="ModalsComponent.closeModal()">✕</button>
      </div>

      <form onsubmit="ModalsComponent.submitAnnouncementForm(event)">
        <div class="form-group">
          <label class="form-label">หัวข้อข่าวสาร / ประกาศ</label>
          <input type="text" id="modal-ann-title" class="form-control" placeholder="ระบุหัวข้อประกาศ..." required>
        </div>

        <div class="form-group">
          <label class="form-label">กลุ่มเป้าหมายผู้รับ</label>
          <select id="modal-ann-target" class="form-control">
            <option value="ALL">ทุกห้องเรียนในศูนย์พัฒนาเด็กเล็ก</option>
            <option value="class-bm">เฉพาะห้องลูกหมีน่ารัก</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">เนื้อหาประกาศ</label>
          <textarea id="modal-ann-content" class="form-control" rows="4" placeholder="ระบุรายละเอียด..." required></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="ModalsComponent.closeModal()">ยกเลิก</button>
          <button type="submit" class="btn btn-primary">เผยแพร่ประกาศ</button>
        </div>
      </form>
    `;

    backdrop.classList.add('active');
  },

  submitAnnouncementForm(e) {
    e.preventDefault();
    const title = document.getElementById('modal-ann-title').value;
    const targetClass = document.getElementById('modal-ann-target').value;
    const content = document.getElementById('modal-ann-content').value;
    const authorName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';

    window.appStore.addAnnouncement({
      title,
      targetClass,
      content,
      author: authorName
    });

    window.appStore.addAuditLog(
      authorName,
      'CREATE_ANNOUNCEMENT',
      `เผยแพร่ประกาศข่าวสาร: ${title}`
    );

    this.showToast('เผยแพร่ประกาศข่าวสารเรียบร้อยแล้ว!', 'success');
    this.closeModal();

    if (window.appController) {
      window.appController.refreshCurrentView();
    }
  },

  openActivityModal() {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    content.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">🎨 เพิ่มบันทึกกิจกรรมประจำวัน</h3>
        <button class="btn btn-secondary btn-sm" onclick="ModalsComponent.closeModal()">✕</button>
      </div>

      <form onsubmit="ModalsComponent.submitActivityForm(event)">
        <div class="form-group">
          <label class="form-label">ชื่อกิจกรรม</label>
          <input type="text" id="modal-act-title" class="form-control" placeholder="ระบุชื่อกิจกรรม..." required>
        </div>

        <div class="form-group">
          <label class="form-label">รายละเอียดการเรียนรู้และประสบการณ์</label>
          <textarea id="modal-act-desc" class="form-control" rows="3" placeholder="ระบุรายละเอียด..." required></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="ModalsComponent.closeModal()">ยกเลิก</button>
          <button type="submit" class="btn btn-primary">บันทึกกิจกรรม</button>
        </div>
      </form>
    `;

    backdrop.classList.add('active');
  },

  submitActivityForm(e) {
    e.preventDefault();
    const title = document.getElementById('modal-act-title').value;
    const description = document.getElementById('modal-act-desc').value;
    const authorName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ครูประจำชั้น';

    window.appStore.addActivity({
      title,
      description,
      classId: 'class-bm',
      image: './assets/images/banner.png'
    });

    window.appStore.addAuditLog(
      authorName,
      'ADD_ACTIVITY',
      `เพิ่มบันทึกกิจกรรมประจำวัน: ${title}`
    );

    this.showToast('บันทึกกิจกรรมประจำวันเรียบร้อยแล้ว!', 'success');
    this.closeModal();

    if (window.appController) {
      window.appController.refreshCurrentView();
    }
  },

  closeModal() {
    const backdrop = document.getElementById('app-modal-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  },

  openConnectLineModal(childId) {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    const child = window.appStore.getChildById(childId) || window.appStore.getChildren()[0];
    const currentLineId = child.parentLineId || localStorage.getItem('BANGYAI_LINE_PERSONAL_USER_ID') || 'U97dc0505bb590d70c66d401224a422db';

    content.innerHTML = `
      <div>
        <div class="modal-header" style="background: linear-gradient(135deg, #06C755, #05B34C); color: white; margin: -1.75rem -1.75rem 1.25rem -1.75rem; padding: 1.25rem 1.75rem; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <h3 class="modal-title" style="color: white; margin: 0; font-size: 1.15rem;">💬 เชื่อมต่อ LINE รับแจ้งเตือนส่วนบุคคล</h3>
          <button class="btn btn-secondary btn-sm" style="color: white; background: transparent; border-color: rgba(255,255,255,0.4);" onclick="ModalsComponent.closeModal()">✕</button>
        </div>
        <div style="padding: 0.5rem 0;">
          <div style="text-align: center; margin-bottom: 1.25rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📲</div>
            <h4 style="font-weight: 700; margin-bottom: 0.25rem; font-size: 1.1rem; color: var(--text-main);">รับการแจ้งเตือนของ ${child.nickname} (${child.firstName} ${child.lastName})</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
              รับข้อความเมื่อครูเช็กชื่อ (มา/สาย/ลา) และผลอนุมัติใบลาตรงเข้า LINE ส่วนตัวของคุณทันที
            </p>
          </div>

          <div style="background: var(--bg-app); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; text-align: center; border: 1px solid var(--border-color);">
            <span class="badge badge-line" style="margin-bottom: 0.5rem;">ขั้นตอนที่ 1</span>
            <p style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">แอดเพื่อนกับ LINE Official Account ของศูนย์ฯ</p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.85rem; background: var(--bg-surface); padding: 0.4rem 0.85rem; border-radius: 6px; border: 1px dashed var(--line-green); font-weight: 700; color: var(--line-green);">
                @ศูนย์พัฒนาเด็กเล็กเทศบาลเมืองบางใหญ่
              </span>
            </div>
          </div>

          <form onsubmit="ModalsComponent.handleConnectLineSubmit(event, '${child.id}')">
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-weight: 700;">ขั้นตอนที่ 2: ระบุ LINE User ID ของคุณ</label>
              <input type="text" id="modal-connect-line-id" class="form-control" value="${currentLineId}" placeholder="เช่น U97dc0505bb590d70c66d401224a422db" required style="font-family: monospace; font-weight: 600;">
              <small style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.35rem;">
                * ดูรหัส User ID ได้จากเมนู Basic settings ใน LINE Developers Console
              </small>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-secondary" onclick="ModalsComponent.closeModal()">ยกเลิก</button>
              <button type="submit" class="btn btn-success" style="background: #06C755; border-color: #06C755; color: white; font-weight: 700;">
                💾 บันทึกการเชื่อมต่อ LINE
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
  },

  handleConnectLineSubmit(e, childId) {
    e.preventDefault();
    const lineId = document.getElementById('modal-connect-line-id').value.trim();
    if (!lineId) return;

    const child = window.appStore.getChildById(childId);
    if (child) {
      child.parentLineId = lineId;
    }

    localStorage.setItem('BANGYAI_LINE_PERSONAL_USER_ID', lineId);
    window.appStore.saveData(window.appStore.data);

    this.showToast(`เชื่อมต่อ LINE รับแจ้งเตือนของ ${child ? child.nickname : 'บุตรหลาน'} เรียบร้อยแล้ว!`, 'success');
    this.closeModal();

    if (window.appController) {
      window.appController.refreshCurrentView();
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999; display: flex; flex-direction: column; gap: 0.75rem; pointer-events: none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';

    toast.style.cssText = `background: ${bgColor}; color: #FFFFFF; padding: 0.85rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 0.6rem; pointer-events: auto; opacity: 1; transition: opacity 0.4s ease, transform 0.4s ease;`;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3200);
  }
};

window.ModalsComponent = ModalsComponent;
