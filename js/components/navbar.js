/* ==========================================================================
   Bang Yai Child Development Center MIS - Navbar & Header Component
   With WCAG 2.2 AAA Accessibility Bar (Font Resizing & High Contrast)
   ========================================================================== */

const NavbarComponent = {
  fontScale: 1,

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentRole = window.authController.getCurrentRole();
    const currentUser = window.authController.getCurrentUser();
    const isAuthenticated = window.authController.isAuthenticated;
    const centerInfo = window.appStore.getCenterInfo();

    container.innerHTML = `
      <!-- Accessibility Control Strip for Elders / Accessibility -->
      <div style="background: #1E293B; color: #F8FAFC; padding: 0.25rem 1.5rem; font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span>♿ เครื่องมือช่วยเหลือการเข้าถึง (WCAG 2.2):</span>
          <button style="background: transparent; border: 1px solid #64748B; color: #FFF; border-radius: 4px; padding: 0 6px; cursor: pointer; min-height: auto;" onclick="NavbarComponent.changeFontSize(-0.1)" title="ลดขนาดตัวอักษร">A-</button>
          <button style="background: transparent; border: 1px solid #64748B; color: #FFF; border-radius: 4px; padding: 0 6px; cursor: pointer; min-height: auto;" onclick="NavbarComponent.resetFontSize()" title="ขนาดปกติ">A</button>
          <button style="background: transparent; border: 1px solid #64748B; color: #FFF; border-radius: 4px; padding: 0 6px; cursor: pointer; min-height: auto;" onclick="NavbarComponent.changeFontSize(0.15)" title="เพิ่มขนาดตัวอักษร">A+</button>
          <button style="background: transparent; border: 1px solid #64748B; color: #FFD700; border-radius: 4px; padding: 0 6px; cursor: pointer; min-height: auto;" onclick="document.body.classList.toggle('high-contrast')" title="โหมดความต่างสีสูง">⚡ ความต่างสีสูง</button>
        </div>
        <div style="font-size: 0.75rem; color: #94A3B8;">
          ศูนย์พัฒนาเด็กเล็กเทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี
        </div>
      </div>

      <nav class="top-navbar">
        <div class="navbar-content">
          <!-- Brand Info -->
          <div class="brand-section">
            <img src="./assets/images/logo.png" alt="Logo" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234F46E5\' stroke-width=\'2\'><path d=\'M12 2L2 7l10 5 10-5-10-5z\'/><path d=\'M2 17l10 5 10-5\'/><path d=\'M2 12l10 5 10-5\'/></svg>'">
            <div>
              <h1 class="brand-title">${centerInfo.name}</h1>
              <p class="brand-subtitle">เทศบาลเมืองบางใหญ่ | ปีการศึกษา ${centerInfo.academicYear}</p>
            </div>
          </div>

          <!-- Authentication Controls & User Profile Widget -->
          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            ${isAuthenticated ? `
              <!-- Logged In User Pill -->
              <div style="display: flex; align-items: center; gap: 0.65rem; background: var(--bg-app); border: 1px solid var(--border-color); padding: 0.35rem 0.85rem; border-radius: var(--radius-full);">
                <span style="font-size: 1.25rem;">${currentUser.avatar || '👤'}</span>
                <div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); leading: 1.1;">
                    ${currentUser.name}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">
                    <span class="badge ${currentRole.badgeClass}" style="padding: 1px 6px; font-size: 0.7rem;">${currentRole.name}</span>
                  </div>
                </div>
              </div>

              <!-- Quick Role Switcher Buttons -->
              <div class="role-switcher-container" title="สลับบทบาทผู้ใช้งานเพื่อทดสอบ">
                <button class="role-tab-btn role-parent ${currentRole.id === 'PARENT' ? 'active' : ''}" onclick="window.authController.setRole('PARENT')">
                  <span>01 ผู้ปกครอง</span>
                </button>
                
                <button class="role-tab-btn role-teacher ${currentRole.id === 'TEACHER' ? 'active' : ''}" onclick="window.authController.setRole('TEACHER')">
                  <span>02 ครู</span>
                </button>

                <button class="role-tab-btn role-executive ${currentRole.id === 'EXECUTIVE' ? 'active' : ''}" onclick="window.authController.setRole('EXECUTIVE')">
                  <span>03 ผู้บริหาร</span>
                </button>
              </div>

              <!-- Logout Button -->
              <button class="btn btn-secondary btn-sm" onclick="window.authController.logout()" title="ออกจากระบบ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>ออกจากระบบ</span>
              </button>
            ` : `
              <span class="badge badge-secondary">ยังไม่ได้ลงชื่อเข้าใช้</span>
            `}

            <!-- Dark Mode Toggle -->
            <button class="btn btn-secondary btn-sm" onclick="document.body.classList.toggle('dark-mode')" title="สลับโหมดมืด/สว่าง">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </nav>
    `;
  },

  changeFontSize(delta) {
    this.fontScale = Math.max(0.85, Math.min(1.4, this.fontScale + delta));
    document.documentElement.style.setProperty('--font-scale', this.fontScale);
  },

  resetFontSize() {
    this.fontScale = 1;
    document.documentElement.style.setProperty('--font-scale', '1');
  }
};

window.NavbarComponent = NavbarComponent;

