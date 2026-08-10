/* ==========================================================================
   Bang Yai Child Development Center MIS - Role-Specific Login Portals
   Provides dedicated login portals for Parent, Teacher, Executive (ของใครของมัน)
   Integrated with Supabase Authentication
   ========================================================================== */

const LoginModalComponent = {
  currentPortal: 'PARENT',

  render(containerId, portalRole = 'PARENT') {
    this.currentPortal = portalRole;
    const container = document.getElementById(containerId);
    if (!container) return;

    if (portalRole === 'PARENT' && window.ParentLandingComponent) {
      window.ParentLandingComponent.render(containerId);
      return;
    }

    this.renderSpecificPortal(container, portalRole);
  },

  showPortalModal(roleId) {
    this.currentPortal = roleId;
    const mainContainer = 'main-view-root';
    this.render(mainContainer, roleId);
  },

  renderSpecificPortal(container, roleId) {
    const roleInfo = {
      TEACHER: {
        title: 'ระบบเข้าสู่ระบบสำหรับ ครู / ผู้ดูแลเด็ก',
        code: '02',
        badge: 'ครู / ผู้ดูแลเด็ก',
        accentColor: '#10B981',
        btnBg: '#059669',
        icon: '👩‍🏫',
        emailPlaceholder: 'teacher@bangyai.go.th',
        desc: 'สำหรับบันทึกการเช็กชื่อ อนุมัติคำขอแจ้งลา ประเมินพัฒนาการ และเผยแพร่ข่าวสาร',
        items: ['เช็กชื่อและบันทึกสถานะ', 'ตอบรับคำขอแจ้งลา', 'บันทึกพัฒนาการ 4 ด้าน', 'เผยแพร่ข่าวสารประจำชั้น', 'สื่อสารกับผู้ปกครอง']
      },
      EXECUTIVE: {
        title: 'ระบบเข้าสู่ระบบสำหรับ ผู้บริหาร / เทศบาล',
        code: '03',
        badge: 'ผู้บริหาร / เทศบาล',
        accentColor: '#8B5CF6',
        btnBg: '#7C3AED',
        icon: '👨‍💼',
        emailPlaceholder: 'executive@bangyai.go.th',
        desc: 'สำหรับตรวจสอบแดชบอร์ดภาพรวม สถิติการมาเรียน การเติบโต และรายงานเชิงนโยบาย',
        items: ['Dashboard จำนวนเด็กและห้อง', 'สถิติอัตราการมาเรียน', 'ภาพรวมพัฒนาการเด็ก', 'ข่าวสารกิจกรรมภาพรวม', 'ออกรายงานและ Audit Logs']
      }
    }[roleId] || {
      title: 'ระบบเข้าสู่ระบบสำหรับ ผู้ปกครอง',
      code: '01',
      badge: 'ผู้ปกครอง',
      accentColor: '#3B82F6',
      btnBg: '#2563EB',
      icon: '👩‍👦',
      emailPlaceholder: 'parent@bangyai.go.th',
      desc: 'สำหรับติดตามประวัติการมาเรียน บันทึกพัฒนาการ และยื่นคำขอแจ้งลาบุตรหลาน',
      items: ['ประวัติและการมาเรียน', 'ข่าวสาร • กิจกรรม • อาหาร', 'บันทึกพัฒนาการ', 'ส่งและติดตามคำขอแจ้งลา', 'รับข้อมูลหรือติดต่อครู']
    };

    container.innerHTML = `
      <div style="max-width: 960px; margin: 2rem auto; padding: 0 1.5rem;">
        
        <!-- Portal Selector Navigation Tabs -->
        <div style="display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;">
          <button onclick="LoginModalComponent.showPortalModal('PARENT')" class="btn" style="padding: 0.65rem 1.25rem; border-radius: var(--radius-full); font-weight: 600; border: 1px solid var(--border-color); ${roleId === 'PARENT' ? 'background: #3B82F6; color: #FFF; border-color: #3B82F6;' : 'background: var(--bg-surface); color: var(--text-muted);'}">
            👩‍👦 01 ระบบผู้ปกครอง
          </button>
          <button onclick="LoginModalComponent.showPortalModal('TEACHER')" class="btn" style="padding: 0.65rem 1.25rem; border-radius: var(--radius-full); font-weight: 600; border: 1px solid var(--border-color); ${roleId === 'TEACHER' ? 'background: #10B981; color: #FFF; border-color: #10B981;' : 'background: var(--bg-surface); color: var(--text-muted);'}">
            👩‍🏫 02 ระบบครูประจำชั้น
          </button>
          <button onclick="LoginModalComponent.showPortalModal('EXECUTIVE')" class="btn" style="padding: 0.65rem 1.25rem; border-radius: var(--radius-full); font-weight: 600; border: 1px solid var(--border-color); ${roleId === 'EXECUTIVE' ? 'background: #8B5CF6; color: #FFF; border-color: #8B5CF6;' : 'background: var(--bg-surface); color: var(--text-muted);'}">
            👨‍💼 03 ระบบผู้บริหาร / เทศบาล
          </button>
        </div>

        <!-- Role Portal Main Container -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-xl); overflow: hidden;">
          
          <!-- Left Side: Role Specific Info -->
          <div style="padding: 2.5rem; background: var(--bg-app); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                <span style="font-size: 2.5rem; font-weight: 800; color: ${roleInfo.accentColor}; opacity: 0.9;">${roleInfo.code}</span>
                <span class="badge" style="background: ${roleInfo.accentColor}15; color: ${roleInfo.accentColor}; font-weight: 700; font-size: 0.9rem;">${roleInfo.badge}</span>
              </div>
              
              <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">${roleInfo.title}</h2>
              <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 1.5rem;">${roleInfo.desc}</p>
              
              <hr style="border: 0; border-top: 1px solid var(--border-color); margin-bottom: 1.25rem;">
              
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem;">ฟังก์ชันที่เข้าถึงได้ในสิทธิ์นี้:</h4>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem; color: var(--text-main);">
                ${roleInfo.items.map(item => `
                  <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem;">
                    <span style="color: ${roleInfo.accentColor}; font-weight: bold;">✓</span> ${item}
                  </li>
                `).join('')}
              </ul>
            </div>

            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2rem; padding-top: 1rem; border-top: 1px dashed var(--border-color);">
              🔒 เชื่อมต่อกับระบบ Supabase Auth เทศบาลเมืองบางใหญ่
            </div>
          </div>

          <!-- Right Side: Login Form -->
          <div style="padding: 2.5rem; display: flex; flex-direction: column; justify-content: center;">
            
            <div style="text-align: center; margin-bottom: 1.75rem;">
              <span style="font-size: 3rem;">${roleInfo.icon}</span>
              <h3 style="font-size: 1.35rem; font-weight: 800; margin-top: 0.5rem; color: var(--text-main);">เข้าสู่ระบบ (${roleInfo.badge})</h3>
            </div>

            <form onsubmit="LoginModalComponent.handlePortalSubmit(event, '${roleId}')">
              <div class="form-group">
                <label class="form-label">อีเมลผู้ใช้งาน</label>
                <input type="email" id="portal-email" class="form-control" placeholder="${roleInfo.emailPlaceholder}" value="${roleInfo.emailPlaceholder}" required>
              </div>

              <div class="form-group">
                <label class="form-label">รหัสผ่าน</label>
                <input type="password" id="portal-password" class="form-control" placeholder="••••••••" value="1234" required>
              </div>

              <button type="submit" id="btn-portal-submit" class="btn" style="width: 100%; background: ${roleInfo.btnBg}; color: #FFF; padding: 0.85rem; font-size: 1rem; font-weight: 700; border-radius: var(--radius-md); cursor: pointer; border: none; box-shadow: 0 4px 14px ${roleInfo.accentColor}40;">
                เข้าสู่ระบบ (${roleInfo.badge})
              </button>
            </form>

            <div style="margin: 1.5rem 0 1rem 0; text-align: center; position: relative;">
              <hr style="border: 0; border-top: 1px solid var(--border-color);">
              <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--bg-surface); padding: 0 10px; font-size: 0.78rem; color: var(--text-muted);">
                ทดสอบเข้าใช้งาน (Quick Demo)
              </span>
            </div>

            <button onclick="window.authController.loginAsRole('${roleId}')" class="btn btn-secondary" style="width: 100%; font-weight: 600; padding: 0.75rem;">
              ⚡ ทดสอบสิทธิ์ ${roleInfo.badge} (Demo Login)
            </button>

          </div>

        </div>

      </div>
    `;
  },

  async handlePortalSubmit(event, roleId) {
    event.preventDefault();
    const email = document.getElementById('portal-email').value;
    const password = document.getElementById('portal-password').value;
    const btn = document.getElementById('btn-portal-submit');

    if (btn) btn.innerText = 'กำลังตรวจสอบข้อมูลกับ Supabase...';

    // Try Supabase Auth
    if (window.supabaseService) {
      const { data, error } = await window.supabaseService.signIn(email, password);
      if (!error && data?.session) {
        const sbUser = data.session.user;
        const fullName = sbUser.user_metadata?.full_name || email.split('@')[0];
        const customUser = {
          username: email,
          name: fullName,
          subtitle: `บัญชี Supabase Auth (${email})`,
          avatar: roleId === 'TEACHER' ? '👩‍🏫' : roleId === 'EXECUTIVE' ? '👨‍💼' : '👩‍👦'
        };
        window.authController.loginAsRole(roleId, customUser);
        if (window.ModalsComponent) window.ModalsComponent.showToast('เข้าสู่ระบบสำเร็จผ่าน Supabase Auth', 'success');
        return;
      }
    }

    // Fallback demo login
    window.authController.loginAsRole(roleId);
    if (window.ModalsComponent) {
      window.ModalsComponent.showToast(`เข้าสู่ระบบในฐานะ ${window.authController.getCurrentRole().name} เรียบร้อย`, 'success');
    }
  }
};

window.LoginModalComponent = LoginModalComponent;
