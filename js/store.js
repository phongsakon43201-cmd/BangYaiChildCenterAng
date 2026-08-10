/* ==========================================================================
   Bang Yai Child Development Center MIS - Centralized Data Store
   LocalStorage Persistence with Full Seed Dataset for Bang Yai Municipality
   ========================================================================== */

const STORAGE_KEY = 'BANGYAI_CHILD_CENTER_MIS_V2';

const INITIAL_SEED_DATA = {
  centerInfo: {
    name: 'ศูนย์พัฒนาเด็กเล็กเทศบาลเมืองบางใหญ่',
    subdistrict: 'บางใหญ่',
    district: 'บางใหญ่',
    province: 'นนทบุรี',
    academicYear: '2569',
    term: '1/2569',
    totalCapacity: 60
  },

  classrooms: [
    { id: 'class-1', name: 'ห้องเตรียมอนุบาล (2-3 ขวบ)', teacherName: 'ครูพิมลวรรณ สุขเสริฐ', studentCount: 15 },
    { id: 'class-2', name: 'ห้องอนุบาล 1/1 (3-4 ขวบ)', teacherName: 'ครูวิภาดา ศรีมงคล', studentCount: 18 },
    { id: 'class-3', name: 'ห้องอนุบาล 1/2 (3-4 ขวบ)', teacherName: 'ครูพงศกร ฤกษ์รูจี', studentCount: 17 }
  ],

  children: [
    {
      id: 'child-101',
      classId: 'class-2',
      nationalId: '1-1002-00345-67-8',
      firstName: 'ปัณณธร',
      lastName: 'วิสุทธิ์อัมพร',
      nickname: 'น้องโปรด',
      gender: 'ชาย',
      birthDate: '2566-03-12',
      ageString: '3 ขวบ 5 เดือน',
      parentName: 'นาย ณัฐธีร์ วิสุทธิ์อัมพร',
      parentPhone: '081-234-5678',
      parentRelation: 'บิดา',
      allergy: 'ไม่มี',
      bloodType: 'O',
      avatarColor: '#4F46E5',
      heightCm: 98.5,
      weightKg: 15.2,
      bmi: 15.6,
      growthStatus: 'สมส่วนตามเกณฑ์',
      vaccines: ['BCG', 'คอกรน-บาดพยัก-โปลิโอ', 'หัด-หัดเยอรมัน-คางทูม (MMR)', 'ไข้หวัดใหญ่ประจำปี']
    },
    {
      id: 'child-102',
      classId: 'class-2',
      nationalId: '1-1002-00345-99-1',
      firstName: 'มนสิชา',
      lastName: 'ฤกษ์รูจี',
      nickname: 'น้องมิริน',
      gender: 'หญิง',
      birthDate: '2566-01-20',
      ageString: '3 ขวบ 7 เดือน',
      parentName: 'นางสาว ปรียาพร ฤกษ์รูจี',
      parentPhone: '089-876-5432',
      parentRelation: 'มารดา',
      allergy: 'แพ้อาหารทะเล (กุ้ง)',
      bloodType: 'A',
      avatarColor: '#EC4899',
      heightCm: 96.0,
      weightKg: 14.0,
      bmi: 15.2,
      growthStatus: 'สมส่วนตามเกณฑ์',
      vaccines: ['BCG', 'คอกรน-บาดพยัก-โปลิโอ', 'MMR']
    },
    {
      id: 'child-103',
      classId: 'class-2',
      nationalId: '1-1002-00346-11-2',
      firstName: 'วรภพ',
      lastName: 'สมบูรณ์',
      nickname: 'น้องวาเลน',
      gender: 'ชาย',
      birthDate: '2566-05-15',
      ageString: '3 ขวบ 3 เดือน',
      parentName: 'นาย สุรเดช สมบูรณ์',
      parentPhone: '086-111-2233',
      parentRelation: 'บิดา',
      allergy: 'ไม่มี',
      bloodType: 'B',
      avatarColor: '#10B981',
      heightCm: 95.0,
      weightKg: 14.8,
      bmi: 16.4,
      growthStatus: 'สมส่วนตามเกณฑ์',
      vaccines: ['BCG', 'MMR', 'ไข้หวัดใหญ่ประจำปี']
    },
    {
      id: 'child-104',
      classId: 'class-2',
      nationalId: '1-1002-00346-44-5',
      firstName: 'ณิชารีย์',
      lastName: 'กิจเจริญ',
      nickname: 'น้องเฌอเอม',
      gender: 'หญิง',
      birthDate: '2566-04-10',
      ageString: '3 ขวบ 4 เดือน',
      parentName: 'นาง วนิดา กิจเจริญ',
      parentPhone: '084-555-6677',
      parentRelation: 'มารดา',
      allergy: 'ไม่มี',
      bloodType: 'AB',
      avatarColor: '#F59E0B',
      heightCm: 97.2,
      weightKg: 14.5,
      bmi: 15.3,
      growthStatus: 'สมส่วนตามเกณฑ์',
      vaccines: ['BCG', 'MMR']
    }
  ],

  attendance: [
    { id: 'att-1', childId: 'child-101', date: '2569-08-10', status: 'PRESENT', checkTime: '07:45 น.', checkedBy: 'ครูวิภาดา' },
    { id: 'att-2', childId: 'child-102', date: '2569-08-10', status: 'PRESENT', checkTime: '07:50 น.', checkedBy: 'ครูวิภาดา' },
    { id: 'att-3', childId: 'child-103', date: '2569-08-10', status: 'LEAVE', checkTime: '08:00 น.', checkedBy: 'ระบบ (ผู้ปกครองแจ้งลา)' },
    { id: 'att-4', childId: 'child-104', date: '2569-08-10', status: 'PRESENT', checkTime: '08:05 น.', checkedBy: 'ครูวิภาดา' }
  ],

  leaveRequests: [
    {
      id: 'leave-1',
      childId: 'child-103',
      childName: 'น้องวาเลน (ด.ช. วรภพ)',
      parentName: 'นาย สุรเดช สมบูรณ์',
      leaveType: 'ลาป่วย',
      startDate: '2569-08-10',
      endDate: '2569-08-11',
      reason: 'น้องมีอาการเป็นไข้สูงและตัวร้อน ต้องไปพบแพทย์ที่ รพ.บางใหญ่',
      status: 'APPROVED',
      submittedAt: '2569-08-09 19:30 น.',
      approvedBy: 'ครูวิภาดา ศรีมงคล',
      remark: 'รับทราบค่ะ ขอให้น้องหายไวๆ นะคะ'
    }
  ],

  announcements: [
    {
      id: 'news-1',
      title: 'แจ้งการให้บริการฉีดวัคซีนป้องกันไข้หวัดใหญ่ประจำปี',
      content: 'ศูนย์พัฒนาเด็กเล็กเทศบาลเมืองบางใหญ่ ร่วมกับ โรงพยาบาลส่งเสริมสุขภาพตำบลบางใหญ่ ขอเชิญชวนผู้ปกครองนำบุตรหลานเข้ารับการฉีดวัคซีนในวันศุกร์ที่ 15 สิงหาคม 2569 เวลา 09:00 - 12:00 น.',
      targetClass: 'ALL',
      author: 'กองการศึกษา เทศบาลเมืองบางใหญ่',
      createdAt: '2569-08-08',
      pinned: true
    }
  ],

  mealPlan: [
    {
      date: '2569-08-10',
      dayOfWeek: 'วันจันทร์',
      breakfast: 'ข้าวต้มหมูสับใส่กล่อง + นมพาสเจอร์ไรส์รสจืด',
      lunch: 'ข้าวสวย + ต้มจืดฟักใส่ไก่ + ผัดบล็อคโคลี่หมูสับ',
      afternoonSnack: 'กล้วยน้ำว้าสุก + นมถั่วเหลือง',
      nutritionNote: 'ได้รับสารอาหารครบ 5 หมู่ พลังงาน 1,200 Kcal'
    }
  ],

  activities: [
    {
      id: 'act-1',
      title: 'กิจกรรมศิลปะสร้างสรรค์ "ระบายสีภาพในฝัน"',
      classId: 'class-2',
      date: '2569-08-10',
      description: 'เด็กๆ ร่วมกันใช้นิ้วมือและสีน้ำระบายสีอย่างสนุกสนาน ส่งเสริมกล้ามเนื้อมัดเล็กและจินตนาการ',
      image: './assets/images/banner.png'
    }
  ],

  developmentRecords: [
    {
      id: 'dev-1',
      childId: 'child-101',
      childName: 'น้องโปรด (ด.ช. ปัณณธร)',
      term: '1/2569',
      evalDate: '2569-08-05',
      physicalScore: 4,      /* 4=ดีเยี่ยม, 3=ดี, 2=ผ่าน, 1=ควรส่งเสริม */
      emotionalScore: 4,
      socialScore: 3,
      intellectualScore: 4,
      evaluator: 'ครูวิภาดา ศรีมงคล',
      notes: 'เด็กมีความคล่องแคล่วในการเคลื่อนไหว ร่าเริงแจ่มใส และสื่อสารภาษาไทยได้ชัดเจนเป็นประโยคยาว'
    },
    {
      id: 'dev-2',
      childId: 'child-102',
      childName: 'น้องมิริน (ด.ญ. มนสิชา)',
      term: '1/2569',
      evalDate: '2569-08-05',
      physicalScore: 3,
      emotionalScore: 4,
      socialScore: 4,
      intellectualScore: 4,
      evaluator: 'ครูวิภาดา ศรีมงคล',
      notes: 'มีความตั้งใจฟัง เข้ากับเพื่อนร่วมห้องได้ดี มีน้ำใจแบ่งปันของเล่น'
    }
  ],

  lineNotifications: [
    {
      id: 'line-1',
      timestamp: '07:45 น.',
      title: '🟢 เช็กชื่อเข้าเรียนเรียบร้อย',
      message: 'น้องโปรด ได้มาถึงศูนย์พัฒนาเด็กเล็กเทศบาลเมืองบางใหญ่ แล้ว เวลา 07:45 น. (เช็กชื่อโดย ครูวิภาดา)'
    },
    {
      id: 'line-2',
      timestamp: '09:30 น.',
      title: '📢 ประกาศข่าวสารใหม่',
      message: 'แจ้งกำหนดการบริการฉีดวัคซีนป้องกันไข้หวัดใหญ่ประจำปี ณ ศูนย์พัฒนาเด็กเล็ก ในวันที่ 15 ส.ค. 2569'
    }
  ],

  auditLogs: [
    { id: 'log-1', timestamp: '2026-08-10 08:00:15', user: 'ครูวิภาดา (TEACHER)', action: 'CHECK_IN_ATTENDANCE', details: 'บันทึกการเข้าเรียนห้องอนุบาล 1/1 จำนวน 18 คน' },
    { id: 'log-2', timestamp: '2026-08-10 09:30:22', user: 'นาย สุรเดช (PARENT)', action: 'SUBMIT_LEAVE_REQUEST', details: 'ส่งคำขอแจ้งลาป่วยให้น้องวาเลน' },
    { id: 'log-3', timestamp: '2026-08-10 10:15:00', user: 'ครูวิภาดา (TEACHER)', action: 'APPROVE_LEAVE_REQUEST', details: 'อนุมัติคำขอแจ้งลาป่วย ของน้องวาเลน' },
    { id: 'log-4', timestamp: '2026-08-10 14:00:10', user: 'ผู้บริหารเทศบาล (EXECUTIVE)', action: 'GENERATE_EXECUTIVE_REPORT', details: 'เรียกดูแดชบอร์ดภาพรวมและส่งออกรายงานการมาเรียนประจำเดือน' }
  ]
};

// Store Class Definition
class AppStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error, fallback to seed data', e);
    }
    this.saveData(INITIAL_SEED_DATA);
    return INITIAL_SEED_DATA;
  }

  saveData(newData) {
    this.data = newData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  getCenterInfo() { return this.data.centerInfo; }
  getClassrooms() { return this.data.classrooms; }
  getChildren(classId = null) {
    if (!classId || classId === 'ALL') return this.data.children;
    return this.data.children.filter(c => c.classId === classId);
  }
  getChildById(id) { return this.data.children.find(c => c.id === id); }

  getAttendance(date = '2569-08-10') {
    return this.data.attendance.filter(a => a.date === date);
  }

  updateAttendance(childId, status, checkedBy = 'ครูผู้ดูแล') {
    const today = '2569-08-10';
    let record = this.data.attendance.find(a => a.childId === childId && a.date === today);
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    if (record) {
      record.status = status;
      record.checkTime = now;
      record.checkedBy = checkedBy;
    } else {
      this.data.attendance.push({
        id: 'att-' + Date.now(),
        childId,
        date: today,
        status,
        checkTime: now,
        checkedBy
      });
    }

    // Trigger simulated LINE notification
    const child = this.getChildById(childId);
    if (child) {
      const statusText = status === 'PRESENT' ? 'มาเรียน' : status === 'LATE' ? 'มาสาย' : status === 'LEAVE' ? 'แจ้งลา' : 'ขาดเรียน';
      this.sendLineNotification(
        `🟢 เช็กชื่อเข้าเรียนเรียบร้อย`,
        `${child.nickname} (${child.firstName}) ได้บันทึกสถานะ "${statusText}" แล้ว เวลา ${now}`
      );
    }

    this.saveData(this.data);
  }

  getLeaveRequests() { return this.data.leaveRequests; }

  addLeaveRequest(req) {
    const newReq = {
      id: 'leave-' + Date.now(),
      status: 'PENDING',
      submittedAt: new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      approvedBy: null,
      remark: null,
      ...req
    };
    this.data.leaveRequests.unshift(newReq);
    this.saveData(this.data);
    return newReq;
  }

  updateLeaveStatus(leaveId, status, approvedBy, remark) {
    const req = this.data.leaveRequests.find(l => l.id === leaveId);
    if (req) {
      req.status = status;
      req.approvedBy = approvedBy;
      req.remark = remark;

      this.sendLineNotification(
        `📩 ผลการอนุมัติคำขอแจ้งลา`,
        `คำขอแจ้งลาของ ${req.childName} ได้รับการ "${status === 'APPROVED' ? 'อนุมัติเรียบร้อยแล้ว' : 'ไม่อนุมัติ'}" โดย ${approvedBy}`
      );

      this.saveData(this.data);
    }
    return req;
  }

  getAnnouncements() { return this.data.announcements; }

  addAnnouncement(ann) {
    const newAnn = {
      id: 'news-' + Date.now(),
      createdAt: new Date().toLocaleDateString('th-TH'),
      pinned: false,
      ...ann
    };
    this.data.announcements.unshift(newAnn);

    this.sendLineNotification(
      `📢 ประกาศข่าวสารใหม่จากศูนย์ฯ`,
      `${ann.title}`
    );

    this.saveData(this.data);
    return newAnn;
  }

  getMealPlan() { return this.data.mealPlan; }
  getActivities() { return this.data.activities; }

  addActivity(act) {
    const newAct = { id: 'act-' + Date.now(), date: '2569-08-10', ...act };
    this.data.activities.unshift(newAct);
    this.saveData(this.data);
    return newAct;
  }

  getDevelopmentRecords() { return this.data.developmentRecords; }

  saveDevelopmentRecord(rec) {
    const existing = this.data.developmentRecords.find(d => d.childId === rec.childId);
    if (existing) {
      Object.assign(existing, rec);
    } else {
      this.data.developmentRecords.push({ id: 'dev-' + Date.now(), ...rec });
    }
    this.saveData(this.data);
  }

  // LINE Notification Simulation
  getLineNotifications() {
    return this.data.lineNotifications || [];
  }

  sendLineNotification(title, message) {
    if (!this.data.lineNotifications) this.data.lineNotifications = [];
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    this.data.lineNotifications.unshift({
      id: 'line-' + Date.now(),
      timestamp: now,
      title,
      message
    });
  }

  getAuditLogs() { return this.data.auditLogs; }

  addAuditLog(user, action, details) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog = { id: 'log-' + Date.now(), timestamp, user, action, details };
    this.data.auditLogs.unshift(newLog);
    this.saveData(this.data);
  }
}

window.appStore = new AppStore();
