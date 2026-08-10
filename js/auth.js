/* ==========================================================================
   Bang Yai Child Development Center MIS - Auth & RBAC Controller
   Role Management (PARENT, TEACHER, EXECUTIVE) & Security Audit Logger
   ========================================================================== */

const ROLES = {
  PARENT: {
    id: 'PARENT',
    name: 'ผู้ปกครอง',
    description: 'ดูข้อมูลบุตรหลาน เช็กชื่อ เมนูอาหาร บันทึกพัฒนาการ และส่งคำขอแจ้งลา',
    badgeClass: 'badge-parent',
    defaultChildId: 'child-101'
  },
  TEACHER: {
    id: 'TEACHER',
    name: 'ครู / ผู้ดูแลเด็ก',
    description: 'เช็กชื่อเข้าเรียน อนุมัติคำขอแจ้งลา บันทึกพัฒนาการ และประกาศข่าวสาร',
    badgeClass: 'badge-teacher',
    defaultClassId: 'class-2'
  },
  EXECUTIVE: {
    id: 'EXECUTIVE',
    name: 'ผู้บริหาร / เทศบาล',
    description: 'ดูแดชบอร์ดสถิติ ภาพรวมพัฒนาการ จัดการทะเบียน และตรวจสอบ Audit Logs',
    badgeClass: 'badge-executive'
  }
};

class AuthController {
  constructor() {
    this.currentRole = localStorage.getItem('BANGYAI_CURRENT_ROLE') || 'TEACHER';
    this.listeners = [];
  }

  getCurrentRole() {
    return ROLES[this.currentRole] || ROLES.TEACHER;
  }

  setRole(roleId) {
    if (ROLES[roleId]) {
      this.currentRole = roleId;
      localStorage.setItem('BANGYAI_CURRENT_ROLE', roleId);
      
      // Audit log the role switch
      window.appStore.addAuditLog(
        `ผู้ใช้ระบบ (${ROLES[roleId].name})`,
        'SWITCH_ROLE',
        `สลับบทบาทการทำงานเข้าสู่ ${ROLES[roleId].name}`
      );

      this.notifyListeners();
    }
  }

  onRoleChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    const roleInfo = this.getCurrentRole();
    this.listeners.forEach(fn => fn(roleInfo));
  }

  // Permission check helper
  canAccess(permissionKey) {
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
