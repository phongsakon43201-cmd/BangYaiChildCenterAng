/* ==========================================================================
   Bang Yai Child Development Center MIS - Parent Dedicated Landing Page
   Landing Portal specifically for Parents with embedded Parent Login System
   ========================================================================== */

const ParentLandingComponent = {
  render(containerId = 'main-view-root') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="parent-landing-wrapper" style="max-width: 1240px; margin: 0 auto; padding: 1.5rem 1rem 3rem 1rem;">
        
        <!-- Hero Banner Header -->
        <div class="hero-banner" style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: #FFF; border-radius: var(--radius-lg); padding: 3rem 2rem; text-align: center; margin-bottom: 2.5rem; box-shadow: var(--shadow-lg); position: relative; overflow: hidden;">
          <div style="position: absolute; right: -20px; bottom: -20px; opacity: 0.15; font-size: 10rem; pointer-events: none;">👨‍👩‍👧</div>
          
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); padding: 0.4rem 1.25rem; border-radius: var(--radius-full); font-size: 0.88rem; font-weight: 600; margin-bottom: 1.25rem;">
            🏫 ศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี
          </div>

          <h1 style="font-size: 2.4rem; font-weight: 800; margin-bottom: 0.75rem; text-shadow: 0 2px 4px rgba(0,0,0,0.1); line-height: 1.25;">
            ยินดีต้อนรับผู้ปกครองทุกท่าน เข้าสู่ระบบสารสนเทศเพื่อการดูแลบุตรหลาน
          </h1>

          <p style="font-size: 1.15rem; color: #DBEAFE; max-width: 780px; margin: 0 auto 2rem auto; font-weight: 400; line-height: 1.6;">
            ติดตามพัฒนาการ ประวัติการมาเรียน รายการอาหารประจำวัน ข่าวสารกิจกรรม และส่งคำขอแจ้งลาบุตรหลานได้สะดวก รวดเร็ว ปลอดภัย ตลอด 24 ชั่วโมง
          </p>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="#parent-login-box" class="btn" style="background: #FFF; color: #1D4ED8; font-weight: 700; padding: 0.85rem 2rem; border-radius: var(--radius-md); font-size: 1rem; box-shadow: 0 4px 14px rgba(0,0,0,0.15); text-decoration: none;">
              🔑 เข้าสู่ระบบผู้ปกครอง
            </a>
            <button type="button" onclick="window.ParentLandingComponent.scrollToFeatures()" class="btn" style="background: rgba(255, 255, 255, 0.15); color: #FFF; border: 1px solid rgba(255,255,255,0.4); font-weight: 600; padding: 0.85rem 1.75rem; border-radius: var(--radius-md); font-size: 1rem;">
              📖 ดูฟังก์ชันและคู่มือใช้งาน
            </button>
          </div>
        </div>

        <!-- 2 Columns Grid: Parent Features (Left) + Parent Login Box (Right) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; align-items: start; margin-bottom: 3rem;">
          
          <!-- Column Left: 5 Main Features for Parents -->
          <div id="parent-features-section">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
              <span style="font-size: 1.8rem; font-weight: 800; color: #2563EB;">01</span>
              <div>
                <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0;">ผู้ปกครอง (Parent Services)</h2>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">ข้อมูลและบริการสำคัญเพื่อการติดตามดูแลบุตรหลาน</p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              
              <!-- Feature 1 -->
              <div class="card" style="padding: 1.25rem; border-left: 4px solid #3B82F6; transition: transform 0.2s ease;">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="font-size: 1.75rem; background: #EFF6FF; padding: 0.5rem; border-radius: var(--radius-md);">📅</div>
                  <div>
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">1. ประวัติและการมาเรียน</h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">เช็กเวลาเข้า-ออกโรงเรียนของบุตรหลานแบบ Real-time พร้อมประวัติย้อนหลัง</p>
                  </div>
                </div>
              </div>

              <!-- Feature 2 -->
              <div class="card" style="padding: 1.25rem; border-left: 4px solid #10B981; transition: transform 0.2s ease;">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="font-size: 1.75rem; background: #ECFDF5; padding: 0.5rem; border-radius: var(--radius-md);">📢</div>
                  <div>
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">2. ข่าวสาร • กิจกรรม • รายการอาหาร</h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">รับประกาศสำคัญ ตารางกิจกรรมการเรียนรู้ และโภชนาการรายการอาหารเช้า/กลางวันประจำวัน</p>
                  </div>
                </div>
              </div>

              <!-- Feature 3 -->
              <div class="card" style="padding: 1.25rem; border-left: 4px solid #8B5CF6; transition: transform 0.2s ease;">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="font-size: 1.75rem; background: #F5F3FF; padding: 0.5rem; border-radius: var(--radius-md);">📊</div>
                  <div>
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">3. บันทึกพัฒนาการ 4 ด้าน</h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">ติดตามพัฒนาการด้านร่างกาย อารมณ์ สังคม และสติปัญญาของลูกตามเกณฑ์ปฐมวัย</p>
                  </div>
                </div>
              </div>

              <!-- Feature 4 -->
              <div class="card" style="padding: 1.25rem; border-left: 4px solid #F59E0B; transition: transform 0.2s ease;">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="font-size: 1.75rem; background: #FEF3C7; padding: 0.5rem; border-radius: var(--radius-md);">📝</div>
                  <div>
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">4. ส่งและติดตามคำขอแจ้งลา</h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">ยื่นใบลาป่วย หรือลากิจผ่านมือถือได้ทันที พร้อมระบบแจ้งเตือนเมื่อครูตอบรับคำขอ</p>
                  </div>
                </div>
              </div>

              <!-- Feature 5 -->
              <div class="card" style="padding: 1.25rem; border-left: 4px solid #EC4899; transition: transform 0.2s ease;">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="font-size: 1.75rem; background: #FCE7F3; padding: 0.5rem; border-radius: var(--radius-md);">💬</div>
                  <div>
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">5. รับข้อมูลหรือติดต่อครูประจำชั้น</h3>
                    <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">ช่องทางรับการแจ้งเตือนส่วนตัวและสื่อสารข้อคิดเห็นถึงครูประจำชั้นอย่างปลอดภัย</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Column Right: Dedicated Parent Login Box -->
          <div id="parent-login-box" class="card" style="padding: 2.25rem; border-top: 6px solid #2563EB; box-shadow: var(--shadow-xl); background: var(--bg-surface);">
            
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👩‍👦</div>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.25rem;">
                ระบบลงชื่อเข้าใช้ผู้ปกครอง
              </h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                ศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่
              </p>
            </div>

            <form onsubmit="window.ParentLandingComponent.handleParentLogin(event)">
              <div class="form-group">
                <label class="form-label" for="parent-email">ชื่อผู้ใช้ (Username) หรือ อีเมล</label>
                <input type="text" id="parent-email" class="form-control" placeholder="เช่น BY-PAR01 หรือ by-par01@bangyai.go.th" required autocomplete="username">
              </div>

              <div class="form-group">
                <label class="form-label" for="parent-password">รหัสผ่าน (Password)</label>
                <input type="password" id="parent-password" class="form-control" placeholder="ระบุรหัสผ่าน..." required autocomplete="current-password">
              </div>

              <button type="submit" id="btn-parent-login" class="btn" style="width: 100%; background: #2563EB; color: #FFF; padding: 0.85rem; font-size: 1rem; font-weight: 700; border-radius: var(--radius-md); cursor: pointer; border: none; box-shadow: 0 4px 14px rgba(37,99,235,0.3); margin-top: 0.5rem;">
                เข้าสู่ระบบผู้ปกครอง
              </button>
            </form>

            <!-- Link to Portal Switcher for Staff/Exec -->
            <div style="margin-top: 1.75rem; text-align: center; font-size: 0.85rem; color: var(--text-muted); border-top: 1px dashed var(--border-color); padding-top: 1rem;">
              ท่านเป็นบุคลากรครู หรือผู้บริหารหรือไม่?<br>
              <a href="#" onclick="window.LoginModalComponent.showPortalModal('TEACHER'); return false;" style="color: #059669; font-weight: 700; text-decoration: none; margin-right: 0.5rem;">
                ➡️ เข้าสู่ระบบครูผู้ดูแล
              </a>
              |
              <a href="#" onclick="window.LoginModalComponent.showPortalModal('EXECUTIVE'); return false;" style="color: #7C3AED; font-weight: 700; text-decoration: none; margin-left: 0.5rem;">
                ➡️ เข้าสู่ระบบผู้บริหาร
              </a>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  scrollToFeatures() {
    const el = document.getElementById('parent-features-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },

  async handleParentLogin(event) {
    event.preventDefault();
    const userInput = document.getElementById('parent-email').value.trim();
    const password = document.getElementById('parent-password').value;
    const btn = document.getElementById('btn-parent-login');

    if (btn) btn.innerText = 'กำลังตรวจสอบสิทธิ์...';

    // Try Supabase Auth Login if email
    if (userInput.includes('@') && window.supabaseService) {
      const { data, error } = await window.supabaseService.signIn(userInput, password);
      if (!error && data?.session) {
        const sbUser = data.session.user;
        const rawName = sbUser.user_metadata?.full_name || userInput.split('@')[0];
        const cleanName = window.authController ? window.authController.sanitizeName(rawName, 'PARENT') : rawName;
        const customUser = {
          username: userInput,
          name: cleanName,
          subtitle: `ผู้ปกครอง (Supabase Auth)`,
          avatar: '👩‍👦'
        };
        window.authController.loginAsRole('PARENT', customUser);
        if (window.ModalsComponent) window.ModalsComponent.showToast('เข้าสู่ระบบสำเร็จผ่าน Supabase Auth', 'success');
        return;
      }
    }

    // Local Verification with Official Accounts
    const res = window.authController.login(userInput, password);
    if (res.success) {
      // Validate role is PARENT for this portal
      const loggedInRole = window.authController.currentRole;
      if (loggedInRole !== 'PARENT') {
        window.authController.logout();
        if (btn) btn.innerText = 'เข้าสู่ระบบผู้ปกครอง';
        const roleNames = { TEACHER: 'ครู / ผู้ดูแลเด็ก', EXECUTIVE: 'ผู้บริหาร / เทศบาล' };
        if (window.ModalsComponent) {
          window.ModalsComponent.showToast(`บัญชีนี้เป็นสิทธิ์ "${roleNames[loggedInRole] || loggedInRole}" โปรดกดปุ่ม "เข้าสู่ระบบ${roleNames[loggedInRole] || loggedInRole}" ด้านล่างแทน`, 'error');
        } else {
          alert(`บัญชีนี้เป็นสิทธิ์ "${roleNames[loggedInRole]}" ไม่ใช่ผู้ปกครอง`);
        }
        return;
      }
      if (window.ModalsComponent) {
        window.ModalsComponent.showToast(`ยินดีต้อนรับคุณ ${res.user.name} เข้าสู่ระบบ`, 'success');
      }
    } else {
      if (btn) btn.innerText = 'เข้าสู่ระบบผู้ปกครอง';
      if (window.ModalsComponent) {
        window.ModalsComponent.showToast(res.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
      } else {
        alert(res.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    }
  }
};

window.ParentLandingComponent = ParentLandingComponent;
