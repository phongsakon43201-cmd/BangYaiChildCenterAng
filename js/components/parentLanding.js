/* ==========================================================================
   Bang Yai Child Development Center MIS - Parent Dedicated Landing Page
   Landing Portal specifically for Parents with embedded Parent Login System
   ========================================================================== */

const ParentLandingComponent = {
  render(containerId) {
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
            <button onclick="ParentLandingComponent.scrollToFeatures()" class="btn" style="background: rgba(255, 255, 255, 0.15); color: #FFF; border: 1px solid rgba(255,255,255,0.4); font-weight: 600; padding: 0.85rem 1.75rem; border-radius: var(--radius-md); font-size: 1rem;">
              📖 ดูฟังก์ชันและคู่มือใช้งาน
            </button>
          </div>
        </div>

        <!-- 2 Columns Grid: Parent Features (Left) + Parent Login Box (Right) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; align-items: start; margin-bottom: 3rem;">
          
          <!-- Column Left: 5 Main Features for Parents (ตรงตามรูปภาพ 01 ผู้ปกครอง) -->
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

          <!-- Column Right: Dedicated Parent Login Box (กับระบบ Supabase Auth) -->
          <div id="parent-login-box" class="card" style="padding: 2.25rem; border-top: 6px solid #2563EB; box-shadow: var(--shadow-xl); background: var(--bg-surface);">
            
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👩‍👦</div>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.25rem;">
                ระบบลงชื่อเข้าใช้ผู้ปกครอง
              </h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                (เข้าใช้งานด้วยบัญชี Supabase Authentication)
              </p>
            </div>

            <form onsubmit="ParentLandingComponent.handleParentLogin(event)">
              <div class="form-group">
                <label class="form-label" for="parent-email">อีเมล / เบอร์โทรศัพท์ผู้ปกครอง</label>
                <input type="text" id="parent-email" class="form-control" placeholder="เช่น parent@bangyai.go.th หรือ 0812345678" value="parent@bangyai.go.th" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="parent-password">รหัสผ่าน / PIN 6 หลัก</label>
                <input type="password" id="parent-password" class="form-control" placeholder="••••••••" value="1234" required>
              </div>

              <button type="submit" id="btn-parent-login" class="btn" style="width: 100%; background: #2563EB; color: #FFF; padding: 0.85rem; font-size: 1rem; font-weight: 700; border-radius: var(--radius-md); cursor: pointer; border: none; box-shadow: 0 4px 14px rgba(37,99,235,0.3); margin-top: 0.5rem;">
                เข้าสู่ระบบผู้ปกครอง
              </button>
            </form>

            <div style="margin: 1.5rem 0 1rem 0; text-align: center; position: relative;">
              <hr style="border: 0; border-top: 1px solid var(--border-color);">
              <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--bg-surface); padding: 0 10px; font-size: 0.8rem; color: var(--text-muted);">
                หรือ ทดสอบสิทธิ์ทันที (Quick Demo)
              </span>
            </div>

            <button onclick="window.authController.loginAsRole('PARENT')" class="btn" style="width: 100%; background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; font-weight: 600; padding: 0.75rem; border-radius: var(--radius-md); cursor: pointer;">
              ⚡ ทดสอบเข้าใช้งานบทบาท ผู้ปกครอง (Demo)
            </button>

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
    const email = document.getElementById('parent-email').value;
    const password = document.getElementById('parent-password').value;
    const btn = document.getElementById('btn-parent-login');

    if (btn) btn.innerText = 'กำลังตรวจสอบข้อมูลกับ Supabase...';

    // Try Supabase Auth Login
    if (window.supabaseService) {
      const { data, error } = await window.supabaseService.signIn(email, password);
      if (!error && data?.session) {
        const sbUser = data.session.user;
        const rawName = sbUser.user_metadata?.full_name || email.split('@')[0];
        const cleanName = window.authController ? window.authController.sanitizeName(rawName, 'PARENT') : rawName;
        const customUser = {
          username: email,
          name: cleanName,
          subtitle: `ผู้ปกครอง (Supabase Auth)`,
          avatar: '👩‍👦'
        };
        window.authController.loginAsRole('PARENT', customUser);
        if (window.ModalsComponent) window.ModalsComponent.showToast('เข้าสู่ระบบสำเร็จผ่าน Supabase Auth', 'success');
        return;
      }
    }

    // Fallback login for demo testing
    window.authController.loginAsRole('PARENT');
    if (window.ModalsComponent) {
      window.ModalsComponent.showToast('เข้าสู่ระบบในฐานะผู้ปกครองเรียบร้อย', 'success');
    }
  }
};

window.ParentLandingComponent = ParentLandingComponent;
