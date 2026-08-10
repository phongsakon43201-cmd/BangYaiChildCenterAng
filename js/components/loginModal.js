/* ==========================================================================
   Bang Yai Child Development Center MIS - Login & Role Selection Component
   Renders 3 Role Cards (Parent, Teacher, Executive) matching user image
   ========================================================================== */

const LoginModalComponent = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="login-page-container" style="max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem;">
        
        <!-- Header Banner -->
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.75rem; background: var(--primary-50); color: var(--primary-700); padding: 0.5rem 1.25rem; border-radius: var(--radius-full); font-weight: 600; font-size: 0.9rem; margin-bottom: 1rem;">
            🏫 ศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี
          </div>
          <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.02em;">
            ระบบลงชื่อเข้าใช้ และแยกสิทธิ์ผู้ใช้งาน 3 บทบาท
          </h1>
          <p style="font-size: 1.1rem; color: var(--text-muted); max-width: 700px; margin: 0 auto;">
            ผู้ใช้งานทั้ง 3 บทบาทจะเข้าถึงข้อมูลและฟังก์ชันที่ต่างกันตามหน้าที่ความรับผิดชอบ (RBAC)
          </p>
        </div>

        <!-- 3 Role Cards (Matching User Image Layout) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem; margin-bottom: 3rem;">
          
          <!-- Card 01: ผู้ปกครอง -->
          <div class="card role-select-card" style="border-top: 5px solid #3B82F6; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <span style="font-size: 2.5rem; font-weight: 800; color: #3B82F6; opacity: 0.85; line-height: 1;">01</span>
                <span class="badge" style="background: #EFF6FF; color: #1D4ED8; font-weight: 600;">ผู้ปกครอง</span>
              </div>
              <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">ผู้ปกครอง</h2>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">ติดตามข้อมูลบุตรหลาน</p>
              
              <hr style="border: 0; border-top: 1px solid var(--border-color); margin-bottom: 1.25rem;">
              
              <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.92rem; color: var(--text-main);">
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #3B82F6;">•</span> ประวัติและการมาเรียน
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #3B82F6;">•</span> ข่าวสาร • กิจกรรม • อาหาร
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #3B82F6;">•</span> บันทึกพัฒนาการ
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #3B82F6;">•</span> ส่งและติดตามคำขอแจ้งลา
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #3B82F6;">•</span> รับข้อมูลหรือติดต่อครู
                </li>
              </ul>
            </div>
            
            <button class="btn" style="width: 100%; background: #2563EB; color: #FFF; padding: 0.75rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);" onclick="LoginModalComponent.quickLogin('PARENT')">
              <span>👩‍👦 เข้าสู่ระบบในฐานะ ผู้ปกครอง</span>
            </button>
          </div>

          <!-- Card 02: ครู / ผู้ดูแลเด็ก -->
          <div class="card role-select-card" style="border-top: 5px solid #10B981; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <span style="font-size: 2.5rem; font-weight: 800; color: #10B981; opacity: 0.85; line-height: 1;">02</span>
                <span class="badge" style="background: #ECFDF5; color: #047857; font-weight: 600;">ครู / ผู้ดูแลเด็ก</span>
              </div>
              <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">ครู / ผู้ดูแลเด็ก</h2>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">บันทึกและสื่อสารงานประจำ</p>
              
              <hr style="border: 0; border-top: 1px solid var(--border-color); margin-bottom: 1.25rem;">
              
              <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.92rem; color: var(--text-main);">
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #10B981;">•</span> เช็กชื่อและบันทึกสถานะ
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #10B981;">•</span> ตอบรับคำขอแจ้งลา
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #10B981;">•</span> กิจกรรม • อาหาร • พัฒนาการ
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #10B981;">•</span> เผยแพร่ข่าวสาร
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #10B981;">•</span> สื่อสารกับผู้ปกครอง
                </li>
              </ul>
            </div>
            
            <button class="btn" style="width: 100%; background: #059669; color: #FFF; padding: 0.75rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);" onclick="LoginModalComponent.quickLogin('TEACHER')">
              <span>👩‍🏫 เข้าสู่ระบบในฐานะ ครูประจำชั้น</span>
            </button>
          </div>

          <!-- Card 03: ผู้บริหาร / เทศบาล -->
          <div class="card role-select-card" style="border-top: 5px solid #8B5CF6; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <span style="font-size: 2.5rem; font-weight: 800; color: #8B5CF6; opacity: 0.85; line-height: 1;">03</span>
                <span class="badge" style="background: #F5F3FF; color: #6D28D9; font-weight: 600;">ผู้บริหาร / เทศบาล</span>
              </div>
              <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">ผู้บริหาร / เทศบาล</h2>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">มองภาพรวมเพื่อการตัดสินใจ</p>
              
              <hr style="border: 0; border-top: 1px solid var(--border-color); margin-bottom: 1.25rem;">
              
              <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.92rem; color: var(--text-main);">
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #8B5CF6;">•</span> Dashboard จำนวนเด็กและห้อง
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #8B5CF6;">•</span> สถิติการมาเรียน
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #8B5CF6;">•</span> ภาพรวมพัฒนาการ
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #8B5CF6;">•</span> ข่าวสารและกิจกรรม
                </li>
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;">
                  <span style="color: #8B5CF6;">•</span> รายงานตามช่วงเวลา
                </li>
              </ul>
            </div>
            
            <button class="btn" style="width: 100%; background: #7C3AED; color: #FFF; padding: 0.75rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border: none; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);" onclick="LoginModalComponent.quickLogin('EXECUTIVE')">
              <span>👨‍💼 เข้าสู่ระบบในฐานะ ผู้บริหาร</span>
            </button>
          </div>

        </div>

        <!-- Credentials Form Modal / Card -->
        <div class="card" style="max-width: 540px; margin: 0 auto; padding: 2rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">
            🔑 หรือ เข้าสู่ระบบด้วยชื่อผู้ใช้ / PIN
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; margin-bottom: 1.5rem;">
            พิมพ์ชื่อบทบาท (เช่น parent, teacher, executive) หรือกรอกบัญชีผู้ใช้งาน
          </p>

          <form onsubmit="LoginModalComponent.handleManualSubmit(event)">
            <div class="form-group">
              <label class="form-label" for="login-username">ชื่อผู้ใช้งาน / เบอร์โทรศัพท์</label>
              <input type="text" id="login-username" class="form-control" placeholder="เช่น teacher, parent, executive" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">รหัสผ่าน / PIN 6 หลัก</label>
              <input type="password" id="login-password" class="form-control" placeholder="••••••••" value="1234" required>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem; font-size: 1rem; font-weight: 600; margin-top: 0.5rem;">
              เข้าสู่ระบบ (Sign In)
            </button>
          </form>
        </div>

      </div>
    `;
  },

  quickLogin(roleId) {
    window.authController.loginAsRole(roleId);
    if (window.ModalsComponent && typeof window.ModalsComponent.showToast === 'function') {
      window.ModalsComponent.showToast(`เข้าสู่ระบบสำเร็จในฐานะ ${window.authController.getCurrentRole().name}`, 'success');
    }
  },

  handleManualSubmit(event) {
    event.preventDefault();
    const userEl = document.getElementById('login-username');
    const passEl = document.getElementById('login-password');

    if (!userEl || !passEl) return;

    const username = userEl.value;
    const password = passEl.value;

    const result = window.authController.login(username, password);
    if (result.success) {
      if (window.ModalsComponent && typeof window.ModalsComponent.showToast === 'function') {
        window.ModalsComponent.showToast(`เข้าสู่ระบบสำเร็จในฐานะ ${window.authController.getCurrentRole().name}`, 'success');
      }
    } else {
      alert(result.message || 'ไม่สามารถเข้าสู่ระบบได้ โปรดตรวจสอบชื่อผู้ใช้');
    }
  }
};

window.LoginModalComponent = LoginModalComponent;
