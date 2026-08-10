/* ==========================================================================
   Bang Yai Child Development Center MIS - Main App Controller
   Initialization & View Router
   ========================================================================== */

class AppController {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Render Top Navbar
      window.NavbarComponent.render('navbar-root');

      // 2. Render Modal Backdrop Container
      window.ModalsComponent.renderContainer('modal-root');

      // 3. Listen to Role Changes
      window.authController.onRoleChange((role) => {
        window.NavbarComponent.render('navbar-root');
        this.renderViewForRole(role.id);
      });

      // 4. Initial Render based on current role
      const initialRole = window.authController.getCurrentRole();
      this.renderViewForRole(initialRole.id);
    });
  }

  renderViewForRole(roleId) {
    const mainContainer = 'main-view-root';
    if (roleId === 'PARENT') {
      window.ParentView.render(mainContainer);
    } else if (roleId === 'TEACHER') {
      window.TeacherView.render(mainContainer);
    } else if (roleId === 'EXECUTIVE') {
      window.ExecutiveView.render(mainContainer);
    }
  }

  refreshCurrentView() {
    const roleId = window.authController.currentRole;
    this.renderViewForRole(roleId);
  }
}

window.appController = new AppController();
