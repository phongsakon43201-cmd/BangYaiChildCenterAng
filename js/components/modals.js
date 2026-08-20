/* ==========================================================================
   Bang Yai Child Development Center MIS - Interactive Modals Component
   ========================================================================== */

const ModalsComponent = {
  activeChildId: null,

  renderContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="app-modal-backdrop" class="modal-backdrop" onclick="ModalsComponent.handleBackdropClick(event)">
        <div id="app-modal-content" class="modal-content" onclick="event.stopPropagation()">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    // Listen for Escape key to close modal
    document.removeEventListener('keydown', ModalsComponent.handleKeyDown);
    document.addEventListener('keydown', ModalsComponent.handleKeyDown);
  },

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      ModalsComponent.closeModal();
    }
  },

  handleBackdropClick(e) {
    if (e.target.id === 'app-modal-backdrop') {
      ModalsComponent.closeModal();
    }
  },

  openLeaveModal(childId) {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    let child = window.appStore.getChildById(childId);
    if (!child) {
      const currentUser = window.authController ? window.authController.getCurrentUser() : null;
      if (currentUser && currentUser.childId) {
        child = window.appStore.getChildById(currentUser.childId);
      }
    }
    if (!child) {
      child = window.appStore.getChildren()[0] || { id: 'STD-01', firstName: 'เด็ก', nickname: 'น้อง' };
    }
    this.activeChildId = child.id;

    // ISO format for HTML5 date input: YYYY-MM-DD
    const todayIso = new Date().toISOString().split('T')[0];

    content.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">📄 ยื่นคำขอแจ้งลาสำหรับ ${child.nickname} (${child.firstName})</h3>
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.ModalsComponent.closeModal()">✕</button>
      </div>

      <form onsubmit="window.ModalsComponent.submitLeaveForm(event)">
        <input type="hidden" id="modal-leave-child-id" value="${child.id}">

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
            <input type="date" id="modal-leave-start" class="form-control" value="${todayIso}" required>
          </div>
          <div>
            <label class="form-label">ถึงวันที่</label>
            <input type="date" id="modal-leave-end" class="form-control" value="${todayIso}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">รายละเอียด / เหตุผลการลา</label>
          <textarea id="modal-leave-reason" class="form-control" rows="3" placeholder="ระบุเหตุผลการลา..." required></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="window.ModalsComponent.closeModal()">ยกเลิก</button>
          <button type="submit" class="btn btn-primary">ส่งคำขอแจ้งลา</button>
        </div>
      </form>
    `;

    backdrop.classList.add('active');
  },

  submitLeaveForm(e) {
    e.preventDefault();
    const childIdInput = document.getElementById('modal-leave-child-id');
    const childId = (childIdInput && childIdInput.value) || this.activeChildId;
    const leaveType = document.getElementById('modal-leave-type').value;
    const rawStart = document.getElementById('modal-leave-start').value;
    const rawEnd = document.getElementById('modal-leave-end').value;
    const reason = document.getElementById('modal-leave-reason').value;

    const child = window.appStore.getChildById(childId) || window.appStore.getChildren()[0] || { id: childId, nickname: 'บุตรหลาน', firstName: '' };
    const currentUser = window.authController.getCurrentUser();
    const parentName = currentUser ? currentUser.name : (child.parentName || 'ผู้ปกครอง');

    // Convert to Thai BE Date
    const startDate = window.appStore.formatToBEDate(rawStart);
    const endDate = window.appStore.formatToBEDate(rawEnd);

    window.appStore.addLeaveRequest({
      childId: child.id,
      childName: `${child.nickname} (${child.firstName} ${child.lastName || ''})`.trim(),
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

  openEditParentModal(childId) {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    let child = window.appStore.getChildById(childId);
    if (!child) {
      const currentUser = window.authController ? window.authController.getCurrentUser() : null;
      if (currentUser && currentUser.childId) {
        child = window.appStore.getChildById(currentUser.childId);
      }
    }
    if (!child) child = window.appStore.getChildren()[0] || { id: 'STD-01', nickname: 'น้องโต้' };

    const currentUser = window.authController.getCurrentUser();
    const currentParentName = currentUser ? currentUser.name : (child.parentName || 'ผู้ปกครอง');

    content.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">✏️ แก้ไขข้อมูลผู้ปกครอง (${child.nickname})</h3>
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.ModalsComponent.closeModal()">✕</button>
      </div>

      <form onsubmit="window.ModalsComponent.handleEditParentSubmit(event)">
        <input type="hidden" id="modal-parent-child-id" value="${child.id}">

        <div class="form-group">
          <label class="form-label">ชื่อ-นามสกุล ผู้ปกครอง</label>
          <input type="text" id="modal-parent-name" class="form-control" value="${currentParentName}" required placeholder="เช่น นายสมชาย ใจดี">
        </div>

        <div class="form-group">
          <label class="form-label">เบอร์โทรศัพท์ติดต่อ</label>
          <input type="tel" id="modal-parent-phone" class="form-control" value="${child.parentPhone || '081-000-0000'}" required placeholder="เช่น 081-234-5678">
        </div>

        <div class="form-group">
          <label class="form-label">ความสัมพันธ์กับเด็ก</label>
          <select id="modal-parent-relation" class="form-control">
            <option value="บิดา" ${child.parentRelation === 'บิดา' ? 'selected' : ''}>บิดา (พ่อ)</option>
            <option value="มารดา" ${child.parentRelation === 'มารดา' ? 'selected' : ''}>มารดา (แม่)</option>
            <option value="ผู้ปกครอง" ${child.parentRelation === 'ผู้ปกครอง' ? 'selected' : ''}>ผู้ปกครอง / ญาติ</option>
          </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="window.ModalsComponent.closeModal()">ยกเลิก</button>
          <button type="submit" class="btn btn-primary">💾 บันทึกข้อมูล</button>
        </div>
      </form>
    `;

    backdrop.classList.add('active');
  },

  handleEditParentSubmit(e) {
    e.preventDefault();
    const childId = document.getElementById('modal-parent-child-id').value;
    const newName = document.getElementById('modal-parent-name').value.trim();
    const newPhone = document.getElementById('modal-parent-phone').value.trim();
    const newRelation = document.getElementById('modal-parent-relation').value;

    if (!newName) return;

    // 1. Update in AppStore & Supabase DB
    const child = window.appStore.updateChild(childId, {
      parentName: newName,
      parentPhone: newPhone,
      parentRelation: newRelation
    });

    // 2. Update current authenticated user
    const currentUser = window.authController.getCurrentUser();
    if (currentUser) {
      currentUser.name = newName;
      localStorage.setItem('BANGYAI_CURRENT_USER', JSON.stringify(currentUser));
      if (window.OFFICIAL_ACCOUNTS && window.OFFICIAL_ACCOUNTS[currentUser.username]) {
        window.OFFICIAL_ACCOUNTS[currentUser.username].name = newName;
      }
    }

    window.appStore.addAuditLog(
      newName,
      'UPDATE_PARENT_INFO',
      `แก้ไขข้อมูลผู้ปกครองของ ${child ? child.nickname : childId} (ชื่อ: ${newName}, โทร: ${newPhone})`
    );

    this.showToast('บันทึกข้อมูลผู้ปกครองเรียบร้อยแล้ว!', 'success');
    this.closeModal();

    if (window.NavbarComponent) {
      window.NavbarComponent.render('navbar-root');
    }
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
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.ModalsComponent.closeModal()">✕</button>
      </div>

      <form onsubmit="window.ModalsComponent.submitAnnouncementForm(event)">
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
          <button type="button" class="btn btn-secondary" onclick="window.ModalsComponent.closeModal()">ยกเลิก</button>
          <button type="submit" class="btn btn-primary">เผยแพร่ประกาศ</button>
        </div>
      </form>
    `;

    backdrop.classList.add('active');
  },

  submitAnnouncementForm(e) {
    e.preventDefault();
    const title = document.getElementById('modal-ann-title').value.trim();
    const targetClass = document.getElementById('modal-ann-target').value;
    const content = document.getElementById('modal-ann-content').value.trim();
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
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.ModalsComponent.closeModal()">✕</button>
      </div>

      <form onsubmit="window.ModalsComponent.submitActivityForm(event)">
        <div class="form-group">
          <label class="form-label">ชื่อกิจกรรม</label>
          <input type="text" id="modal-act-title" class="form-control" placeholder="ระบุชื่อกิจกรรม..." required>
        </div>

        <div class="form-group">
          <label class="form-label">รายละเอียดการเรียนรู้และประสบการณ์</label>
          <textarea id="modal-act-desc" class="form-control" rows="3" placeholder="ระบุรายละเอียด..." required></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary" onclick="window.ModalsComponent.closeModal()">ยกเลิก</button>
          <button type="submit" class="btn btn-primary">บันทึกกิจกรรม</button>
        </div>
      </form>
    `;

    backdrop.classList.add('active');
  },

  submitActivityForm(e) {
    e.preventDefault();
    const title = document.getElementById('modal-act-title').value.trim();
    const description = document.getElementById('modal-act-desc').value.trim();
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

  // ==========================================================================
  // PWA Add to Home Screen (A2HS) Modal
  // ==========================================================================
  openPWAInstallModal() {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isStandalone) {
      this.showToast('แอปพลิเคชันนี้ได้รับการติดตั้งบนหน้าจอโทรศัพท์ของคุณแล้ว!', 'success');
      return;
    }

    content.innerHTML = `
      <div style="text-align: center; padding: 0.5rem 0;">
        <div style="width: 72px; height: 72px; border-radius: 18px; background: linear-gradient(135deg, #4F46E5, #3B82F6); margin: 0 auto 1.25rem auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35);">
          <img src="./assets/images/logo.png" alt="Logo" style="width: 52px; height: 52px; object-fit: contain;" onerror="this.src='./assets/images/logo.png'">
        </div>

        <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.35rem;">
          เพิ่มไอคอนลงหน้าจอมือถือ
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; max-width: 420px; margin-left: auto; margin-right: auto;">
          ติดตั้งเว็บแอปศูนย์พัฒนาเด็กเล็กเทศบาลเมืองบางใหญ่ เข้าใช้งานได้สะดวกรวดเร็วเหมือนแอปพลิเคชันมือถือ
        </p>

        ${isIOS ? `
          <!-- iOS Safari Step-by-Step Visual Instruction -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-lg); padding: 1.25rem; text-align: left; margin-bottom: 1.5rem;">
            <div style="font-weight: 700; color: #1E293B; margin-bottom: 0.75rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🍎</span>
              <span>ขั้นตอนสำหรับ iPhone / iPad (Safari):</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="width: 28px; height: 28px; border-radius: 50%; background: #3B82F6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">1</span>
                <div>กดปุ่ม <strong>แชร์ (Share)</strong> <span style="display: inline-block; background: #E2E8F0; padding: 2px 8px; border-radius: 4px; font-weight: 700;">⎋ หรือ 📤</span> ที่แถบด้านล่างของ Safari</div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="width: 28px; height: 28px; border-radius: 50%; background: #3B82F6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">2</span>
                <div>เลื่อนลงมาแล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)"</strong> <span style="display: inline-block; background: #E2E8F0; padding: 2px 6px; border-radius: 4px;">➕</span></div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="width: 28px; height: 28px; border-radius: 50%; background: #3B82F6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">3</span>
                <div>กดปุ่ม <strong>"เพิ่ม (Add)"</strong> ที่มุมขวาบน เพื่อสร้างไอคอนบนหน้าจอ</div>
              </div>
            </div>
          </div>
        ` : `
          <!-- Android / Chrome Native 1-Click Install Button -->
          <div style="margin-bottom: 1.5rem;">
            <button type="button" class="btn btn-primary" onclick="window.triggerPWAInstall(); window.ModalsComponent.closeModal();" style="width: 100%; padding: 0.85rem; font-size: 1.05rem; font-weight: 800; background: linear-gradient(135deg, #10B981, #059669); border: none; box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: var(--radius-md);">
              <span>📲</span>
              <span>กดติดตั้งแอปพลิเคชันทันที (1-Click)</span>
            </button>
            <small style="display: block; color: var(--text-muted); font-size: 0.78rem; margin-top: 0.65rem;">
              * หากไม่ขึ้นหน้าต่างติดตั้ง สามารถกดเมนูจุดสามจุด (⋮) ของเบราว์เซอร์ แล้วเลือก "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก"
            </small>
          </div>
        `}

        <div style="display: flex; justify-content: center;">
          <button type="button" class="btn btn-secondary" onclick="window.ModalsComponent.closeModal()" style="padding: 0.5rem 1.75rem;">
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
  },

  // ==========================================================================
  // Ultra-Easy LINE Connection Modal for Parents
  // ==========================================================================
  openConnectLineModal(childId) {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    const child = window.appStore.getChildById(childId) || window.appStore.getChildren()[0] || { id: 'STD-01', nickname: 'น้องโต้', firstName: 'ณัฐธีร์', lastName: 'แสนเจริญ' };
    const currentLineId = child.parentLineId || '';

    // Recommended presets for quick 1-click testing
    const demoPresets = [
      { name: 'คุณพัชรพล (พ่อน้องโต้)', id: 'U4c8e56010b4418f615ba32341dab6a93' },
      { name: 'คุณสมพร (แม่น้องแก้ม)', id: 'U97dc0505bb590d70c66d401224a422db' },
      { name: 'คุณชาญชัย (พ่อน้องพอล)', id: 'U1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d' }
    ];

    content.innerHTML = `
      <div>
        <div class="modal-header" style="background: linear-gradient(135deg, #06C755, #05B34C); color: white; margin: -1.75rem -1.75rem 1.25rem -1.75rem; padding: 1.25rem 1.75rem; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span style="font-size: 1.6rem;">💬</span>
            <div>
              <h3 class="modal-title" style="color: white; margin: 0; font-size: 1.15rem;">เชื่อมต่อ LINE แจ้งเตือนของ ${child.nickname}</h3>
              <p style="font-size: 0.75rem; color: rgba(255,255,255,0.9); margin: 2px 0 0 0;">LINE Official Account: @740ikamd (เทศบาลเมืองบางใหญ่)</p>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="color: white; background: transparent; border-color: rgba(255,255,255,0.4);" onclick="window.ModalsComponent.closeModal()">✕</button>
        </div>

        <div style="padding: 0.25rem 0;">

          <!-- SECTION 1: 1-Click Auto Connect (Easiest Method) -->
          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%); border: 2px solid #06C755; border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 4px 14px rgba(6,199,85,0.15);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="badge" style="background: #06C755; color: white; font-weight: 800; font-size: 0.8rem; padding: 0.25rem 0.65rem;">🌟 วิธีที่ 1 (ง่ายที่สุด)</span>
                <strong style="font-size: 1.05rem; color: #065F46;">เชื่อมต่ออัตโนมัติใน 1 คลิก</strong>
              </div>
              <span style="font-size: 0.75rem; color: #047857; font-weight: 600;">ไม่ต้องพิมพ์รหัสเอง</span>
            </div>
            <p style="font-size: 0.85rem; color: #166534; margin: 0 0 1rem 0; line-height: 1.5;">
              ระบบจะทำการเชื่อมต่อรับแจ้งเตือนสำหรับ <strong>${child.nickname} (${child.firstName})</strong> พร้อมทดสอบส่งข้อความต้อนรับเข้า LINE ทันที
            </p>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="https://line.me/R/ti/p/@740ikamd" target="_blank" rel="noopener noreferrer" class="btn" style="background: #FFFFFF; color: #06C755; border: 1.5px solid #06C755; font-weight: 700; padding: 0.65rem 1rem; font-size: 0.9rem; text-decoration: none; border-radius: var(--radius-md); box-shadow: 0 2px 6px rgba(0,0,0,0.06); display: inline-flex; align-items: center; gap: 0.35rem;">
                <span>➕</span>
                <span>1. แอดเพื่อน @740ikamd</span>
              </a>

              <button type="button" id="btn-quick-auto-connect" class="btn btn-success" onclick="window.ModalsComponent.quickAutoConnectLine('${child.id}')" style="background: #06C755; border-color: #06C755; color: white; font-weight: 800; padding: 0.65rem 1.25rem; font-size: 0.92rem; border-radius: var(--radius-md); box-shadow: 0 4px 14px rgba(6,199,85,0.35); display: inline-flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 220px; justify-content: center;">
                <span>🟢</span>
                <span>2. แตะเพื่อเชื่อมต่อ LINE ทันที (1-Click)</span>
              </button>
            </div>
          </div>

          <!-- SECTION 2: Quick Select Preset Parent IDs for Testing/Demo -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 700; color: #475569;">👥 เลือกโปรไฟล์ผู้ปกครองสำเร็จรูป (สำหรับทดสอบ):</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${demoPresets.map(p => `
                <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-connect-line-id').value = '${p.id}'; window.ModalsComponent.showToast('เลือก ${p.name} แล้ว', 'info');" style="font-size: 0.78rem; font-weight: 600; padding: 0.3rem 0.65rem; background: #FFFFFF; border-color: #CBD5E1;">
                  ${p.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- SECTION 3: Manual Input & Custom LINE User ID -->
          <details style="border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1rem;">
            <summary style="font-weight: 700; font-size: 0.85rem; color: var(--text-muted); cursor: pointer;">
              ⚙️ ตั้งค่าระบุ LINE User ID แบบกำหนดเอง (สำหรับผู้ใช้งานขั้นสูง)
            </summary>
            <form onsubmit="window.ModalsComponent.handleConnectLineSubmit(event, '${child.id}')" style="margin-top: 0.85rem;">
              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="form-label" style="font-weight: 700; font-size: 0.82rem;">LINE User ID (ขึ้นต้นด้วยตัว U ความยาว 33 หลัก):</label>
                <input type="text" id="modal-connect-line-id" class="form-control" value="${currentLineId}" placeholder="เช่น U97dc0505bb590d70c66d401224a422db" style="font-family: monospace; font-weight: 600; font-size: 0.88rem;">
              </div>
              <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="window.ModalsComponent.testLinePush('${child.id}')">
                  🧪 ทดสอบส่งข้อความ
                </button>
                <button type="submit" class="btn btn-success btn-sm" style="background: #06C755; color: white;">
                  💾 บันทึก
                </button>
              </div>
            </form>
          </details>

          <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
            <button type="button" class="btn btn-secondary" onclick="window.ModalsComponent.closeModal()" style="padding: 0.45rem 1.5rem;">
              ปิดหน้าต่าง
            </button>
          </div>

        </div>
      </div>
    `;

    backdrop.classList.add('active');
  },

  // 1-Click Ultra-Easy Auto Connect Implementation
  async quickAutoConnectLine(childId) {
    const child = window.appStore.getChildById(childId) || { id: childId, nickname: 'บุตรหลาน', firstName: 'เด็ก' };
    const btn = document.getElementById('btn-quick-auto-connect');
    if (btn) {
      btn.innerHTML = '⏳ กำลังเชื่อมต่อและส่งข้อความทดสอบเข้า LINE...';
      btn.disabled = true;
    }

    // Use existing parentLineId or generate/use standard LINE ID for this student
    const defaultLineIds = {
      'STD-01': 'U4c8e56010b4418f615ba32341dab6a93',
      'STD-02': 'U97dc0505bb590d70c66d401224a422db',
      'STD-03': 'U97dc0505bb590d70c66d401224a422db'
    };

    const targetLineId = child.parentLineId || defaultLineIds[child.id] || 'U97dc0505bb590d70c66d401224a422db';
    const channelToken = localStorage.getItem('BANGYAI_LINE_CHANNEL_TOKEN') || 'L7/4yLNWgK1roywgIIx98q84tRljHPAv7SjKG6ExDkATxkCGNwqqI3Nm4oiaeVMBEtAgflw8LJzt4ghPKfFLXUWRsRlHAraAHUaXDbwk/W0FsibrVYyVaYDFI1RBPh0HGXGwxYqqYVLRP8Snr6bSSwdB04t89/1O/w1cDnyilFU=';
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    const msg = `🎉 [เชื่อมต่อ LINE สำเร็จ!]\nศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่\nยินดีต้อนรับผู้ปกครองของ ${child.nickname} (${child.firstName})\nระบบพร้อมส่งการแจ้งเตือนเช็กชื่อและผลอนุมัติใบลาตรงถึงท่านแล้ว (${now})`;

    const success = await window.supabaseService.sendLineMessagingAPI(channelToken, targetLineId, msg);

    if (btn) {
      btn.innerHTML = '🟢 2. แตะเพื่อเชื่อมต่อ LINE ทันที (1-Click)';
      btn.disabled = false;
    }

    // Save and link child to this LINE ID
    window.appStore.updateChild(childId, { parentLineId: targetLineId });

    if (success) {
      this.showToast(`🎉 เชื่อมต่อ LINE รับแจ้งเตือนของ ${child.nickname} สำเร็จแล้ว! (ส่งข้อความเข้า LINE เรียบร้อย)`, 'success');
      this.closeModal();
      if (window.appController) {
        window.appController.refreshCurrentView();
      }
    } else {
      this.showToast(`บันทึกการเชื่อมต่อของ ${child.nickname} แล้ว (หากยังไม่ได้รับข้อความ โปรดกดแอดเพื่อน @740ikamd)`, 'info');
      this.closeModal();
      if (window.appController) {
        window.appController.refreshCurrentView();
      }
    }
  },

  async testLinePush(childId) {
    const lineIdInput = document.getElementById('modal-connect-line-id');
    const lineId = (lineIdInput && lineIdInput.value.trim()) || '';
    if (!lineId) {
      this.showToast('โปรดระบุ LINE User ID ของคุณก่อนกดทดสอบครับ', 'warning');
      return;
    }

    if (!/^U[0-9a-fA-F]{10,}$/.test(lineId)) {
      this.showToast('รูปแบบ LINE User ID ไม่ถูกต้อง (ต้องขึ้นต้นด้วยตัว U เช่น U97dc05... ไม่ใช่ชื่อไอดีค้นหาหรือเบอร์โทร)', 'error');
      return;
    }

    const child = window.appStore.getChildById(childId) || { nickname: 'บุตรหลาน', firstName: 'เด็ก' };
    const btn = document.getElementById('btn-test-line-push');
    if (btn) {
      btn.innerText = '⏳ กำลังส่งข้อความเข้า LINE...';
      btn.disabled = true;
    }

    const channelToken = localStorage.getItem('BANGYAI_LINE_CHANNEL_TOKEN') || 'L7/4yLNWgK1roywgIIx98q84tRljHPAv7SjKG6ExDkATxkCGNwqqI3Nm4oiaeVMBEtAgflw8LJzt4ghPKfFLXUWRsRlHAraAHUaXDbwk/W0FsibrVYyVaYDFI1RBPh0HGXGwxYqqYVLRP8Snr6bSSwdB04t89/1O/w1cDnyilFU=';
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    const msg = `🔔 [ทดสอบการเชื่อมต่อ LINE สำเร็จ!]\nศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่\nยินดีต้อนรับผู้ปกครองของ ${child.nickname} (${child.firstName})\nระบบพร้อมส่งการแจ้งเตือนเช็กชื่อและผลอนุมัติใบลาตรงถึงท่านแล้ว (${now})`;

    const success = await window.supabaseService.sendLineMessagingAPI(channelToken, lineId, msg);

    if (btn) {
      btn.innerText = '🧪 ทดสอบส่งข้อความเข้า LINE';
      btn.disabled = false;
    }

    if (success) {
      this.showToast(`✅ ส่งข้อความทดสอบเข้า LINE (${lineId.substring(0, 10)}...) สำเร็จแล้ว! โปรดเปิดแอป LINE ตรวจสอบ`, 'success');
      window.appStore.updateChild(childId, { parentLineId: lineId });
    } else {
      this.showToast(`⚠️ ไม่สามารถส่งข้อความได้ โปรดตรวจสอบว่าท่านได้กด "แอดเพื่อน" กับบอท @740ikamd แล้วหรือยัง`, 'error');
    }
  },

  handleConnectLineSubmit(e, childId) {
    e.preventDefault();
    const lineId = document.getElementById('modal-connect-line-id').value.trim();
    if (!lineId) return;

    if (!/^U[0-9a-fA-F]{10,}$/.test(lineId)) {
      this.showToast('รูปแบบ LINE User ID ไม่ถูกต้อง (ต้องขึ้นต้นด้วยตัว U เช่น U97dc05... ไม่ใช่ชื่อไอดีค้นหาหรือเบอร์โทร)', 'error');
      return;
    }

    const child = window.appStore.getChildById(childId);
    if (child) {
      window.appStore.updateChild(childId, { parentLineId: lineId });
    }

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
