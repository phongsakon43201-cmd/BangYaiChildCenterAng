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
            <input type="date" id="modal-leave-start" class="form-control" value="2569-08-11" required>
          </div>
          <div>
            <label class="form-label">ถึงวันที่</label>
            <input type="date" id="modal-leave-end" class="form-control" value="2569-08-11" required>
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

    const child = window.appStore.getChildById(this.activeChildId);

    window.appStore.addLeaveRequest({
      childId: this.activeChildId,
      childName: `${child.nickname} (${child.firstName})`,
      parentName: child.parentName,
      leaveType,
      startDate,
      endDate,
      reason
    });

    window.appStore.addAuditLog(
      child.parentName,
      'SUBMIT_LEAVE',
      `ยื่นคำขอแจ้งลา (${leaveType}) ให้ ${child.nickname} วันที่ ${startDate}`
    );

    alert('ส่งคำขอแจ้งลาเรียบร้อยแล้ว! ระบบได้ส่งข้อมูลไปยังครูประจำชั้นแล้ว');
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
            <option value="class-2">เฉพาะห้องอนุบาล 1/1</option>
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
      classId: 'class-2',
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
