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

  openConnectLineModal(childId) {
    const backdrop = document.getElementById('app-modal-backdrop');
    const content = document.getElementById('app-modal-content');
    if (!backdrop || !content) return;

    const child = window.appStore.getChildById(childId) || window.appStore.getChildren()[0] || { id: 'STD-01', nickname: 'น้องโต้', firstName: 'ณัฐธีร์', lastName: 'แสนเจริญ' };
    const currentLineId = child.parentLineId || localStorage.getItem('BANGYAI_LINE_PERSONAL_USER_ID') || 'U97dc0505bb590d70c66d401224a422db';

    content.innerHTML = `
      <div>
        <div class="modal-header" style="background: linear-gradient(135deg, #06C755, #05B34C); color: white; margin: -1.75rem -1.75rem 1.25rem -1.75rem; padding: 1.25rem 1.75rem; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span style="font-size: 1.5rem;">💬</span>
            <div>
              <h3 class="modal-title" style="color: white; margin: 0; font-size: 1.15rem;">เชื่อมต่อ LINE แจ้งเตือนส่วนบุคคล (Real-Time)</h3>
              <p style="font-size: 0.75rem; color: rgba(255,255,255,0.85); margin: 2px 0 0 0;">BangYai Child Center Official LINE Bot (@740ikamd)</p>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="color: white; background: transparent; border-color: rgba(255,255,255,0.4);" onclick="window.ModalsComponent.closeModal()">✕</button>
        </div>

        <div style="padding: 0.25rem 0;">
          <div style="text-align: center; margin-bottom: 1.25rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.75rem; background: var(--bg-app); border: 1px solid var(--border-color); padding: 0.6rem 1.25rem; border-radius: var(--radius-full); margin-bottom: 0.65rem;">
              <img src="https://profile.line-scdn.net/0hLg6dcuRPE0gLHQ9TovVsHzdYHSV8MxUAc35UKntIS3AuLAQaNHwOJyofHXlyLgEeYnkOey5PSn5x" alt="LINE Bot" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" onerror="this.src='./assets/images/logo.png'">
              <div style="text-align: left;">
                <strong style="font-size: 0.88rem; color: var(--text-main); display: block;">BangYai Child Center</strong>
                <span style="font-size: 0.75rem; color: #059669; font-weight: 700;">ID: @740ikamd</span>
              </div>
            </div>

            <h4 style="font-weight: 700; margin-bottom: 0.25rem; font-size: 1.1rem; color: var(--text-main);">
              รับการแจ้งเตือนของ ${child.nickname} (${child.firstName} ${child.lastName || ''})
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0; max-width: 500px; margin: 0 auto;">
              แจ้งเตือนอัตโนมัติเมื่อครูเช็กชื่อ (มา/สาย/ลา), อนุมัติใบลา, หรือส่งข่าวสารตรงเข้า LINE มือถือของคุณทันที 24 ชม.
            </p>
          </div>

          <!-- Step 1: Add Friend -->
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <span class="badge" style="background: #06C755; color: white; font-weight: 700; font-size: 0.75rem; margin-bottom: 0.35rem;">ขั้นตอนที่ 1</span>
              <strong style="display: block; font-size: 0.92rem; color: #166534;">เพิ่มเพื่อนกับ LINE Official Account</strong>
              <p style="font-size: 0.8rem; color: #15803D; margin: 2px 0 0 0;">ค้นหาไอดี <strong>@740ikamd</strong> หรือกดปุ่มด้านขวาเพื่อเพิ่มเพื่อน</p>
            </div>
            <a href="https://line.me/R/ti/p/@740ikamd" target="_blank" rel="noopener noreferrer" class="btn" style="background: #06C755; color: white; font-weight: 700; padding: 0.45rem 1rem; font-size: 0.85rem; text-decoration: none; border-radius: var(--radius-md); box-shadow: 0 2px 8px rgba(6,199,85,0.3);">
              ➕ เพิ่มเพื่อน LINE Bot
            </a>
          </div>

          <!-- Step 2: Input User ID & Test Push -->
          <form onsubmit="window.ModalsComponent.handleConnectLineSubmit(event, '${child.id}')">
            <div class="form-group" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="form-label" style="font-weight: 700; margin: 0;">ขั้นตอนที่ 2: ระบุ LINE User ID ของคุณ</label>
                <span class="badge badge-info" style="font-size: 0.7rem;">(ขึ้นต้นด้วย U เช่น U97dc05...)</span>
              </div>
              <input type="text" id="modal-connect-line-id" class="form-control" value="${currentLineId}" placeholder="เช่น U97dc0505bb590d70c66d401224a422db" required style="font-family: monospace; font-weight: 600; font-size: 0.92rem; padding: 0.6rem 0.85rem;">
              <small style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.35rem;">
                * ดูรหัส User ID ได้จากเมนู Basic settings หรือบัญชี LINE Developers ของผู้ใช้งาน
              </small>
            </div>

            <!-- Action Button Bar: Test Button + Save Button -->
            <div style="display: flex; gap: 0.65rem; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-top: 1.5rem; border-top: 1px dashed var(--border-color); padding-top: 1rem;">
              <button type="button" id="btn-test-line-push" class="btn btn-secondary" onclick="window.ModalsComponent.testLinePush('${child.id}')" style="font-weight: 700; color: #065F46; border-color: #06C755; background: #ECFDF5;">
                🧪 ทดสอบส่งข้อความเข้า LINE
              </button>

              <div style="display: flex; gap: 0.5rem;">
                <button type="button" class="btn btn-secondary" onclick="window.ModalsComponent.closeModal()">ยกเลิก</button>
                <button type="submit" class="btn btn-success" style="background: #06C755; border-color: #06C755; color: white; font-weight: 700; box-shadow: 0 4px 12px rgba(6,199,85,0.3);">
                  💾 บันทึกการเชื่อมต่อ LINE
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
  },

  async testLinePush(childId) {
    const lineIdInput = document.getElementById('modal-connect-line-id');
    const lineId = (lineIdInput && lineIdInput.value.trim()) || '';
    if (!lineId) {
      this.showToast('โปรดระบุ LINE User ID ของคุณก่อนกดทดสอบครับ', 'warning');
      return;
    }

    const child = window.appStore.getChildById(childId) || { nickname: 'บุตรหลาน', firstName: 'เด็ก' };
    const btn = document.getElementById('btn-test-line-push');
    if (btn) btn.innerText = '⏳ กำลังส่งข้อความเข้า LINE...';

    const channelToken = localStorage.getItem('BANGYAI_LINE_CHANNEL_TOKEN') || 'L7/4yLNWgK1roywgIIx98q84tRljHPAv7SjKG6ExDkATxkCGNwqqI3Nm4oiaeVMBEtAgflw8LJzt4ghPKfFLXUWRsRlHAraAHUaXDbwk/W0FsibrVYyVaYDFI1RBPh0HGXGwxYqqYVLRP8Snr6bSSwdB04t89/1O/w1cDnyilFU=';
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    const msg = `🔔 [ทดสอบการเชื่อมต่อ LINE สำเร็จ!]\nศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่\nยินดีต้อนรับผู้ปกครองของ ${child.nickname} (${child.firstName})\nระบบพร้อมส่งการแจ้งเตือนเช็กชื่อและผลอนุมัติใบลาตรงถึงท่านแล้ว (${now})`;

    const success = await window.supabaseService.sendLineMessagingAPI(channelToken, lineId, msg);

    if (btn) btn.innerText = '🧪 ทดสอบส่งข้อความเข้า LINE';

    if (success) {
      this.showToast(`✅ ส่งข้อความทดสอบเข้า LINE (${lineId}) สำเร็จแล้ว! โปรดเปิดแอป LINE ตรวจสอบ`, 'success');
      window.appStore.updateChild(childId, { parentLineId: lineId });
      localStorage.setItem('BANGYAI_LINE_PERSONAL_USER_ID', lineId);
    } else {
      this.showToast(`⚠️ ไม่สามารถส่งข้อความได้ โปรดตรวจสอบว่าท่านได้กด "แอดเพื่อน" กับบอท @740ikamd แล้วหรือยัง`, 'error');
    }
  },

  handleConnectLineSubmit(e, childId) {
    e.preventDefault();
    const lineId = document.getElementById('modal-connect-line-id').value.trim();
    if (!lineId) return;

    const child = window.appStore.getChildById(childId);
    if (child) {
      window.appStore.updateChild(childId, { parentLineId: lineId });
    }

    localStorage.setItem('BANGYAI_LINE_PERSONAL_USER_ID', lineId);

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
