/* ==========================================================================
   Bang Yai Child Development Center MIS - Auth & RBAC Controller
   Role Management (PARENT, TEACHER, EXECUTIVE) & Security Audit Logger
   Official Account Authentication System (No Demo Mode)
   ========================================================================== */

const ROLES = {
  PARENT: {
    id: 'PARENT',
    name: 'ผู้ปกครอง',
    code: '01',
    description: 'ติดตามข้อมูลบุตรหลาน ประวัติการมาเรียน บันทึกพัฒนาการ และยื่นคำขอแจ้งลา',
    badgeClass: 'badge-parent',
    defaultChildId: 'STD-01'
  },
  TEACHER: {
    id: 'TEACHER',
    name: 'ครู / ผู้ดูแลเด็ก',
    code: '02',
    description: 'บันทึกและสื่อสารงานประจำ เช็กชื่อ อนุมัติคำขอแจ้งลา และประเมินพัฒนาการ',
    badgeClass: 'badge-teacher',
    defaultClassId: 'class-bm'
  },
  EXECUTIVE: {
    id: 'EXECUTIVE',
    name: 'ผู้บริหาร / เทศบาล',
    code: '03',
    description: 'มองภาพรวมเพื่อการตัดสินใจ แดชบอร์ดสถิติ ภาพรวมพัฒนาการ และออกรายงาน',
    badgeClass: 'badge-executive'
  }
};

// 23 Official User Accounts from Official Document
const OFFICIAL_ACCOUNTS = {
  // Executives
  'BY-EXEC01': { username: 'BY-EXEC01', email: 'by-exec01@bangyai.go.th', pass: 'Exec01@2026', role: 'EXECUTIVE', name: 'นายสมศักดิ์ รักดี', title: 'ผู้อำนวยการกองการศึกษา (ผู้บริหารศูนย์ฯ)', avatar: '👨‍💼' },
  'BY-EXEC02': { username: 'BY-EXEC02', email: 'by-exec02@bangyai.go.th', pass: 'Exec02@2026', role: 'EXECUTIVE', name: 'นางสาววิภาดา พรหมณี', title: 'หัวหน้าศูนย์พัฒนาเด็กเล็ก', avatar: '👩‍💼' },

  // Teacher
  'BY-T01': { username: 'BY-T01', email: 'by-t01@bangyai.go.th', pass: 'Kanda@2026', role: 'TEACHER', name: 'นางสาวกานดา ใจดี (ครูแก้ว)', title: 'ครูประจำชั้น (ห้องลูกหมีน่ารัก)', avatar: '👩‍🏫' },

  // Parents (20 accounts)
  'BY-PAR01': { username: 'BY-PAR01', email: 'by-par01@bangyai.go.th', pass: 'Par01@2026', role: 'PARENT', name: 'นายพัชรพล  เเสนเจริญ', title: 'ผู้ปกครอง ด.ช.  ณัฐธีร์ เเสนเจริญ (น้องโต้)', avatar: '👨‍👦', childId: 'STD-01' },
  'BY-PAR02': { username: 'BY-PAR02', email: 'by-par02@bangyai.go.th', pass: 'Par02@2026', role: 'PARENT', name: 'นางสมพร โพธิ์ทอง', title: 'ผู้ปกครอง ด.ญ. กัญญารัตน์ โพธิ์ทอง (น้องแก้ม)', avatar: '👩‍👧', childId: 'STD-02' },
  'BY-PAR03': { username: 'BY-PAR03', email: 'by-par03@bangyai.go.th', pass: 'Par03@2026', role: 'PARENT', name: 'นายชาญชัย มงคลดี', title: 'ผู้ปกครอง ด.ช. ชยพล มงคลดี (น้องพอล)', avatar: '👨‍👦', childId: 'STD-03' },
  'BY-PAR04': { username: 'BY-PAR04', email: 'by-par04@bangyai.go.th', pass: 'Par04@2026', role: 'PARENT', name: 'นางสาวนภา วงศ์สว่าง', title: 'ผู้ปกครอง ด.ญ. ณิชาภัทร วงศ์สว่าง (น้องณิชา)', avatar: '👩‍👧', childId: 'STD-04' },
  'BY-PAR05': { username: 'BY-PAR05', email: 'by-par05@bangyai.go.th', pass: 'Par05@2026', role: 'PARENT', name: 'นายธนากร รัตนอุบล', title: 'ผู้ปกครอง ด.ช. ธนกฤต รัตนอุบล (น้องคุณ)', avatar: '👨‍👦', childId: 'STD-05' },
  'BY-PAR06': { username: 'BY-PAR06', email: 'by-par06@bangyai.go.th', pass: 'Par06@2026', role: 'PARENT', name: 'นางวิไล เพิ่มพูน', title: 'ผู้ปกครอง ด.ญ. ธันย์ชนก เพิ่มพูน (น้องวาฬ)', avatar: '👩‍👧', childId: 'STD-06' },
  'BY-PAR07': { username: 'BY-PAR07', email: 'by-par07@bangyai.go.th', pass: 'Par07@2026', role: 'PARENT', name: 'นายณัฐพล แก้วมณี', title: 'ผู้ปกครอง ด.ช. นพณัฐ แก้วมณี (น้องนัท)', avatar: '👨‍👦', childId: 'STD-07' },
  'BY-PAR08': { username: 'BY-PAR08', email: 'by-par08@bangyai.go.th', pass: 'Par08@2026', role: 'PARENT', name: 'นางปรียา บุญมี', title: 'ผู้ปกครอง ด.ญ. ปรินดา บุญมี (น้องปาน)', avatar: '👩‍👧', childId: 'STD-08' },
  'BY-PAR09': { username: 'BY-PAR09', email: 'by-par09@bangyai.go.th', pass: 'Par09@2026', role: 'PARENT', name: 'นายพงษ์เทพ แจ่มใส', title: 'ผู้ปกครอง ด.ช. พงศกร แจ่มใส (น้องป๋อ)', avatar: '👨‍👦', childId: 'STD-09' },
  'BY-PAR10': { username: 'BY-PAR10', email: 'by-par10@bangyai.go.th', pass: 'Par10@2026', role: 'PARENT', name: 'นางพิศมัย เจริญสุข', title: 'ผู้ปกครอง ด.ญ. พิชญา เจริญสุข (น้องพาย)', avatar: '👩‍👧', childId: 'STD-10' },
  'BY-PAR11': { username: 'BY-PAR11', email: 'by-par11@bangyai.go.th', pass: 'Par11@2026', role: 'PARENT', name: 'นายภานุ สายชล', title: 'ผู้ปกครอง ด.ช. ภัทรดนัย สายชล (น้องภีม)', avatar: '👨‍👦', childId: 'STD-11' },
  'BY-PAR12': { username: 'BY-PAR12', email: 'by-par12@bangyai.go.th', pass: 'Par12@2026', role: 'PARENT', name: 'นางมณีศรี สมบูรณ์', title: 'ผู้ปกครอง ด.ญ. มลนภัส ศรีสมบูรณ์ (น้องโมเม)', avatar: '👩‍👧', childId: 'STD-12' },
  'BY-PAR13': { username: 'BY-PAR13', email: 'by-par13@bangyai.go.th', pass: 'Par13@2026', role: 'PARENT', name: 'นายวรวุฒิ เผ่าทอง', title: 'ผู้ปกครอง ด.ช. วรภพ เผ่าทอง (น้องภพ)', avatar: '👨‍👦', childId: 'STD-13' },
  'BY-PAR14': { username: 'BY-PAR14', email: 'by-par14@bangyai.go.th', pass: 'Par14@2026', role: 'PARENT', name: 'นางศิริพร รุ่งเรือง', title: 'ผู้ปกครอง ด.ญ. ศุภิสรา รุ่งเรือง (น้องมายด์)', avatar: '👩‍👧', childId: 'STD-14' },
  'BY-PAR15': { username: 'BY-PAR15', email: 'by-par15@bangyai.go.th', pass: 'Par15@2026', role: 'PARENT', name: 'นายอนุชา ประเสริฐ', title: 'ผู้ปกครอง ด.ช. อัครวินท์ ประเสริฐ (น้องอ๋อง)', avatar: '👨‍👦', childId: 'STD-15' },
  'BY-PAR16': { username: 'BY-PAR16', email: 'by-par16@bangyai.go.th', pass: 'Par16@2026', role: 'PARENT', name: 'นางอุมาพร มิ่งขวัญ', title: 'ผู้ปกครอง ด.ญ. อัญชิสา มิ่งขวัญ (น้องเอม)', avatar: '👩‍👧', childId: 'STD-16' },
  'BY-PAR17': { username: 'BY-PAR17', email: 'by-par17@bangyai.go.th', pass: 'Par17@2026', role: 'PARENT', name: 'นายกิตติ แสงสว่าง', title: 'ผู้ปกครอง ด.ช. กิตติภพ แสงสว่าง (น้องกิต)', avatar: '👨‍👦', childId: 'STD-17' },
  'BY-PAR18': { username: 'BY-PAR18', email: 'by-par18@bangyai.go.th', pass: 'Par18@2026', role: 'PARENT', name: 'นางชลธิชา วงษ์ไทย', title: 'ผู้ปกครอง ด.ญ. ชนกนันท์ วงษ์ไทย (น้องชาเนล)', avatar: '👩‍👧', childId: 'STD-18' },
  'BY-PAR19': { username: 'BY-PAR19', email: 'by-par19@bangyai.go.th', pass: 'Par19@2026', role: 'PARENT', name: 'นายณรงค์ สมบูรณ์', title: 'ผู้ปกครอง ด.ช. ณัฐดนัย สมบูรณ์ (น้องดนัย)', avatar: '👨‍👦', childId: 'STD-19' },
  'BY-PAR20': { username: 'BY-PAR20', email: 'by-par20@bangyai.go.th', pass: 'Par20@2026', role: 'PARENT', name: 'นางปานทิพย์ สุวรรณ', title: 'ผู้ปกครอง ด.ญ. ปัณฑน์รี สุวรรณ (น้องปันปัน)', avatar: '👩‍👧', childId: 'STD-20' }
};

class AuthController {
  constructor() {
    this.isAuthenticated = localStorage.getItem('BANGYAI_IS_AUTHENTICATED') === 'true';
    this.currentRole = localStorage.getItem('BANGYAI_CURRENT_ROLE') || 'PARENT';

    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem('BANGYAI_CURRENT_USER'));
    } catch (e) {
      storedUser = null;
    }

    this.currentUser = storedUser;

    // If not authenticated, force clean state
    if (!this.isAuthenticated || !this.currentUser) {
      this.isAuthenticated = false;
      this.currentUser = null;
      localStorage.setItem('BANGYAI_IS_AUTHENTICATED', 'false');
      localStorage.removeItem('BANGYAI_CURRENT_USER');
    }

    this.listeners = [];
  }

  sanitizeName(name, roleId = 'TEACHER') {
    if (!name || typeof name !== 'string') return 'ผู้ใช้งานระบบ';
    const trimmed = name.trim();
    if (trimmed.includes('?') || /^[?\s\uFFFD]+$/.test(trimmed) || trimmed.length < 2) {
      return 'ผู้ใช้งานระบบ';
    }
    return trimmed;
  }

  getCurrentRole() {
    return ROLES[this.currentRole] || ROLES.PARENT;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Strict Login function with official accounts verification
  login(inputUsername, password) {
    if (!inputUsername || !password) {
      return { success: false, message: 'โปรดกรอกชื่อผู้ใช้และรหัสผ่าน' };
    }

    const cleanInput = inputUsername.trim().toUpperCase();
    const cleanEmail = inputUsername.trim().toLowerCase();

    let account = null;
    // Match by username (e.g. BY-EXEC01) or email (e.g. by-exec01@bangyai.go.th)
    for (const key in OFFICIAL_ACCOUNTS) {
      const acc = OFFICIAL_ACCOUNTS[key];
      if (acc.username.toUpperCase() === cleanInput || acc.email.toLowerCase() === cleanEmail) {
        account = acc;
        break;
      }
    }

    if (!account) {
      return { success: false, message: 'ไม่พบบัญชีผู้ใช้ที่ระบุ' };
    }

    if (account.pass !== password.trim()) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
    }

    // Login successful
    this.currentRole = account.role;
    this.currentUser = {
      username: account.username,
      name: account.name,
      subtitle: account.title,
      avatar: account.avatar,
      childId: account.childId || null
    };
    this.isAuthenticated = true;

    localStorage.setItem('BANGYAI_IS_AUTHENTICATED', 'true');
    localStorage.setItem('BANGYAI_CURRENT_ROLE', account.role);
    localStorage.setItem('BANGYAI_CURRENT_USER', JSON.stringify(this.currentUser));

    if (window.appStore && typeof window.appStore.addAuditLog === 'function') {
      window.appStore.addAuditLog(
        `${this.currentUser.name} (${ROLES[account.role].name})`,
        'LOGIN',
        `ลงชื่อเข้าสู่ระบบในบทบาท ${ROLES[account.role].name}`
      );
    }

    this.notifyListeners();
    return { success: true, user: this.currentUser };
  }

  loginAsRole(roleId, customUser = null) {
    if (customUser && ROLES[roleId]) {
      this.currentRole = roleId;
      this.currentUser = { ...customUser };
      this.isAuthenticated = true;

      localStorage.setItem('BANGYAI_IS_AUTHENTICATED', 'true');
      localStorage.setItem('BANGYAI_CURRENT_ROLE', roleId);
      localStorage.setItem('BANGYAI_CURRENT_USER', JSON.stringify(this.currentUser));

      if (window.appStore && typeof window.appStore.addAuditLog === 'function') {
        window.appStore.addAuditLog(
          `${this.currentUser.name} (${ROLES[roleId].name})`,
          'LOGIN',
          `ลงชื่อเข้าสู่ระบบผ่าน Supabase Auth`
        );
      }

      this.notifyListeners();
      return { success: true };
    }
    return { success: false, message: 'โปรดลงชื่อเข้าใช้ด้วยรหัสผ่านจริง' };
  }

  logout() {
    const prevUser = this.currentUser ? this.currentUser.name : 'ผู้ใช้';
    this.isAuthenticated = false;
    this.currentUser = null;
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
    if (this.isAuthenticated && roleId !== this.currentRole) {
      alert(`คุณกำลังอยู่ในระบบในฐานะ "${this.getCurrentRole().name}" หากต้องการเข้าใช้งานบทบาทอื่น โปรดกด "ออกจากระบบ" ก่อนครับ`);
      return;
    }
  }

  onRoleChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    const roleInfo = this.getCurrentRole();
    this.listeners.forEach(fn => fn(roleInfo, this.isAuthenticated));
  }

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
window.OFFICIAL_ACCOUNTS = OFFICIAL_ACCOUNTS;
