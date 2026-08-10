/* ==========================================================================
   Bang Yai Child Development Center MIS - Navbar & Header Component
   ========================================================================== */

const NavbarComponent = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentRole = window.authController.getCurrentRole();
    const centerInfo = window.appStore.getCenterInfo();

    container.innerHTML = `
      <nav class="top-navbar">
        <div class="navbar-content">
          <!-- Brand Info -->
          <div class="brand-section">
            <img src="./assets/images/logo.png" alt="Logo" class="brand-logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234F46E5\' stroke-width=\'2\'><path d=\'M12 2L2 7l10 5 10-5-10-5z\'/><path d=\'M2 17l10 5 10-5\'/><path d=\'M2 12l10 5 10-5\'/></svg>'">
            <div>
              <h1 class="brand-title">${centerInfo.name}</h1>
              <p class="brand-subtitle">เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี | ปีการศึกษา ${centerInfo.academicYear}</p>
            </div>
          </div>

          <!-- Role Switcher -->
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="role-switcher-container" title="สลับบทบาทการใช้งานเพื่อทดสอบระบบ">
              <button class="role-tab-btn role-parent ${currentRole.id === 'PARENT' ? 'active' : ''}" onclick="window.authController.setRole('PARENT')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>ผู้ปกครอง</span>
              </button>
              
              <button class="role-tab-btn role-teacher ${currentRole.id === 'TEACHER' ? 'active' : ''}" onclick="window.authController.setRole('TEACHER')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <span>ครู / ผู้ดูแล</span>
              </button>

              <button class="role-tab-btn role-executive ${currentRole.id === 'EXECUTIVE' ? 'active' : ''}" onclick="window.authController.setRole('EXECUTIVE')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <span>ผู้บริหาร</span>
              </button>
            </div>

            <!-- Dark Mode Toggle -->
            <button class="btn btn-secondary btn-sm" onclick="document.body.classList.toggle('dark-mode')" title="สลับโหมดมืด/สว่าง">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </nav>
    `;
  }
};

window.NavbarComponent = NavbarComponent;
