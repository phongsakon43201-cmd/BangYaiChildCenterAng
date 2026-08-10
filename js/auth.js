/* ==========================================================================
   Bang Yai Child Development Center MIS - Auth & RBAC Controller
   Role Management (PARENT, TEACHER, EXECUTIVE) & Security Audit Logger
   ========================================================================== */

const ROLES = {
  PARENT: {
    id: 'PARENT',
    name: 'ผู้ปกครอง',
    code: '01',
    description: 'ติดตามข้อมูลบุตรหลาน ประวัติการมาเรียน บันทึกพัฒนาการ และยื่นคำขอแจ้งลา',
    badgeClass: 'badge-parent',
    defaultChildId: 'child-101',
    demoUser: {
      username: 'parent',
      name: 'คุณวรรณา สมบูรณ์',
      subtitle: 'ผู้ปกครอง ด.ช. กิตติภพ (น้องภพ)',
      avatar: '👩'
    }
  },
  TEACHER: {
    id: 'TEACHER',
    name: 'ครู / ผู้ดูแลเด็ก',
    code: '02',
    description: 'บันทึกและสื่อสารงานประจำ เช็กชื่อ อนุมัติคำขอแจ้งลา และประเมินพัฒนาการ',
    badgeClass: 'badge-teacher',
    defaultClassId: 'class-2',
    demoUser: {
      username: 'teacher',
      name: 'คุณครู สมศรี มีสุข',
      subtitle: 'ครูประจำชั้นห้อง อนุบาล 2/1',
      avatar: '👩‍🏫'
    }
  },
  EXECUTIVE: {
    id: 'EXECUTIVE',
    name: 'ผู้บริหาร / เทศบาล',
    code: '03',
    description: 'มองภาพรวมเพื่อการตัดสินใจ แดชบอร์ดสถิติ ภาพรวมพัฒนาการ และออกรายงาน',
    badgeClass: 'badge-executive',
    demoUser: {
      username: 'executive',
      name: 'นายสมชาย ใจดี',
      subtitle: 'ผู้อำนวยการกองการศึกษา เทศบาลเมืองบางใหญ่',
      avatar: '👨‍💼'
    }
  }
};

class AuthController {
  constructor() {
    this.isAuthenticated = localStorage.getItem('BANGYAI_IS_AUTHENTICATED') === 'true';
    this.currentRole = localStorage.getItem('BANGYAI_CURRENT_ROLE') || 'TEACHER';
    this.currentUser = JSON.parse(localStorage.getItem('BANGYAI_CURRENT_USER')) || ROLES[this.currentRole].demoUser;
    this.listeners = [];
  }

  getCurrentRole() {
    return ROLES[this.currentRole] || ROLES.TEACHER;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  loginAsRole(roleId) {
    if (ROLES[roleId]) {
      this.currentRole = roleId;
      this.currentUser = ROLES[roleId].demoUser;
      this.isAuthenticated = true;

      localStorage.setItem('BANGYAI_IS_AUTHENTICATED', 'true');
      localStorage.setItem('BANGYAI_CURRENT_ROLE', roleId);
      localStorage.setItem('BANGYAI_CURRENT_USER', JSON.stringify(this.currentUser));

      if (window.appStore && typeof window.appStore.addAuditLog === 'function') {
        window.appStore.addAuditLog(
          `${this.currentUser.name} (${ROLES[roleId].name})`,
          'LOGIN',
          `ลงชื่อเข้าสู่ระบบในบทบาท ${ROLES[roleId].name}`
        );
      }

      this.notifyListeners();
      return { success: true };
    }
    return { success: false, message: 'ไม่พบบทบาทผู้ใช้งาน' };
  }

  login(username, password) {
    const cleanUser = username.trim().toLowerCase();
    let targetRole = null;

    if (cleanUser === 'parent' || cleanUser.includes('ผู้ปกครอง')) {
      targetRole = 'PARENT';
    } else if (cleanUser === 'teacher' || cleanUser.includes('ครู')) {
      targetRole = 'TEACHER';
    } else if (cleanUser === 'executive' || cleanUser.includes('บริหาร')) {
      targetRole = 'EXECUTIVE';
    } else {
      // Default to teacher if generic login
      targetRole = 'TEACHER';
    }

    return this.loginAsRole(targetRole);
  }

  logout() {
    const prevUser = this.currentUser ? this.currentUser.name : 'ผู้ใช้';
    this.isAuthenticated = false;
    localStorage.setItem('BANGYAI_IS_AUTHENTICATED', 'false');
    localStorage.removeItem('BANGYAI_CURRENT_USER');

    if (window.appStore && typeof window.appStore.addAuditLog === 'function') {
      window.appStore.addAuditLog(
        prevUser,
        'LOGOUT',
        'ออกจากระบบเรียบร้อย'
      );
    }

    this.notifyListeners();
  }

  setRole(roleId) {
    this.loginAsRole(roleId);
  }

  onRoleChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    const roleInfo = this.getCurrentRole();
    this.listeners.forEach(fn => fn(roleInfo, this.isAuthenticated));
  }

  // Permission check helper
  canAccess(permissionKey) {
    if (!this.isAuthenticated) return false;
    const role = this.currentRole;
    const matrix = {
      PARENT: ['VIEW_CHILD', 'SUBMIT_LEAVE', 'VIEW_MEAL', 'VIEW_DEV', 'VIEW_NEWS'],
      TEACHER: ['VIEW_CHILD', 'CHECK_ATTENDANCE', 'APPROVE_LEAVE', 'EDIT_DEV', 'CREATE_NEWS', 'ADD_ACTIVITY', 'VIEW_MEAL'],
      EXECUTIVE: ['VIEW_ALL', 'EXECUTIVE_DASHBOARD', 'AUDIT_LOGS', 'EXPORT_REPORTS', 'MANAGE_USERS']
    };
    return matrix[role] && (matrix[role].includes('VIEW_ALL') || matrix[role].includes(permissionKey));
  }
}

window.authController = new AuthController();

