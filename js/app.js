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

      // 3. Listen to Role / Auth State Changes
      window.authController.onRoleChange((role, isAuthenticated) => {
        window.NavbarComponent.render('navbar-root');
        this.updateView();
      });

      // 4. Initial Render based on current auth state
      this.updateView();

      // 5. Initial Cloud Hydration & Realtime Multi-Device Sync
      if (window.appStore && typeof window.appStore.syncWithCloud === 'function') {
        window.appStore.syncWithCloud();
      }

      // 6. Connect Realtime Supabase Database Sync Listener
      if (window.supabaseService && typeof window.supabaseService.subscribeRealtimeDB === 'function') {
        window.supabaseService.subscribeRealtimeDB(() => {
          if (window.appStore && typeof window.appStore.syncWithCloud === 'function') {
            window.appStore.syncWithCloud(true);
          } else {
            this.updateView();
          }
        });
      }

      // 7. Background Auto-Sync every 4 seconds for seamless phone <-> PC sync
      setInterval(() => {
        if (window.appStore && typeof window.appStore.syncWithCloud === 'function') {
          window.appStore.syncWithCloud();
        }
      }, 4000);

      // 8. Instant Sync when user switches back to tab or device screen
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && window.appStore) {
          window.appStore.syncWithCloud(true);
        }
      });
      window.addEventListener('focus', () => {
        if (window.appStore) {
          window.appStore.syncWithCloud(true);
        }
      });
    });
  }

  updateView() {
    const mainContainer = 'main-view-root';
    const mobileNav = document.getElementById('mobile-nav-root');

    if (!window.authController.isAuthenticated) {
      if (mobileNav) mobileNav.style.display = 'none';
      if (window.ParentLandingComponent) {
        window.ParentLandingComponent.render(mainContainer);
      } else if (window.LoginModalComponent) {
        window.LoginModalComponent.render(mainContainer, 'PARENT');
      }
      return;
    }

    if (mobileNav) mobileNav.style.display = '';
    const roleId = window.authController.currentRole;
    this.renderViewForRole(roleId);
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
    this.updateView();
  }
}

window.appController = new AppController();

