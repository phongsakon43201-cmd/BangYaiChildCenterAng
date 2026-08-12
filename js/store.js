/* ==========================================================================
   Bang Yai Child Development Center MIS - Centralized Data Store
   LocalStorage Persistence with Full Seed Dataset for Bang Yai Municipality
   ========================================================================== */

const STORAGE_KEY = 'BANGYAI_CHILD_CENTER_MIS_V3';

const INITIAL_SEED_DATA = {
  centerInfo: {
    name: 'ศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่',
    subdistrict: 'บางใหญ่',
    district: 'บางใหญ่',
    province: 'นนทบุรี',
    academicYear: '2569',
    term: '1/2569',
    totalCapacity: 20
  },

  classrooms: [
    { id: 'class-bm', name: 'ห้อง "ลูกหมีน่ารัก" (กลุ่มเตรียมความพร้อม อายุ 2-3 ขวบ)', teacherName: 'นางสาวกานดา ใจดี (ครูแก้ว)', studentCount: 20 }
  ],

  children: [
    { id: 'STD-01', classId: 'class-bm', nationalId: '1-1002-00101-01-1', firstName: 'กวินท์', lastName: 'สุขเสริฐ', nickname: 'วิน', gender: 'ชาย', birthDate: '2567-02-10', ageString: '2 ขวบ 6 เดือน', parentName: 'นายวิทวัส สุขเสริฐ', parentPhone: '081-001-0001', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#4F46E5', heightCm: 92.0, weightKg: 13.5, bmi: 15.9, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'คอกรน-บาดพยัก-โปลิโอ', 'MMR', 'ไข้หวัดใหญ่'], username: 'BY-PAR01' },
    { id: 'STD-02', classId: 'class-bm', nationalId: '1-1002-00101-02-2', firstName: 'กัญญารัตน์', lastName: 'โพธิ์ทอง', nickname: 'แก้ม', gender: 'หญิง', birthDate: '2567-01-15', ageString: '2 ขวบ 7 เดือน', parentName: 'นางสมพร โพธิ์ทอง', parentPhone: '081-001-0002', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#EC4899', heightCm: 90.5, weightKg: 12.8, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'คอกรน-บาดพยัก-โปลิโอ', 'MMR'], username: 'BY-PAR02' },
    { id: 'STD-03', classId: 'class-bm', nationalId: '1-1002-00101-03-3', firstName: 'ชยพล', lastName: 'มงคลดี', nickname: 'พอล', gender: 'ชาย', birthDate: '2567-03-20', ageString: '2 ขวบ 5 เดือน', parentName: 'นายชาญชัย มงคลดี', parentPhone: '081-001-0003', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#10B981', heightCm: 91.0, weightKg: 13.2, bmi: 15.9, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR03' },
    { id: 'STD-04', classId: 'class-bm', nationalId: '1-1002-00101-04-4', firstName: 'ณิชาภัทร', lastName: 'วงศ์สว่าง', nickname: 'ณิชา', gender: 'หญิง', birthDate: '2567-04-12', ageString: '2 ขวบ 4 เดือน', parentName: 'นางสาวนภา วงศ์สว่าง', parentPhone: '081-001-0004', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'AB', avatarColor: '#F59E0B', heightCm: 89.5, weightKg: 12.5, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR04' },
    { id: 'STD-05', classId: 'class-bm', nationalId: '1-1002-00101-05-5', firstName: 'ธนกฤต', lastName: 'รัตนอุบล', nickname: 'คุณ', gender: 'ชาย', birthDate: '2567-02-28', ageString: '2 ขวบ 6 เดือน', parentName: 'นายธนากร รัตนอุบล', parentPhone: '081-001-0005', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#6366F1', heightCm: 93.0, weightKg: 14.0, bmi: 16.2, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR', 'ไข้หวัดใหญ่'], username: 'BY-PAR05' },
    { id: 'STD-06', classId: 'class-bm', nationalId: '1-1002-00101-06-6', firstName: 'ธันย์ชนก', lastName: 'เพิ่มพูน', nickname: 'วาฬ', gender: 'หญิง', birthDate: '2567-05-18', ageString: '2 ขวบ 3 เดือน', parentName: 'นางวิไล เพิ่มพูน', parentPhone: '081-001-0006', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#8B5CF6', heightCm: 88.5, weightKg: 12.0, bmi: 15.3, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR06' },
    { id: 'STD-07', classId: 'class-bm', nationalId: '1-1002-00101-07-7', firstName: 'นพณัฐ', lastName: 'แก้วมณี', nickname: 'นัท', gender: 'ชาย', birthDate: '2567-01-30', ageString: '2 ขวบ 7 เดือน', parentName: 'นายณัฐพล แก้วมณี', parentPhone: '081-001-0007', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#3B82F6', heightCm: 92.5, weightKg: 13.8, bmi: 16.1, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR07' },
    { id: 'STD-08', classId: 'class-bm', nationalId: '1-1002-00101-08-8', firstName: 'ปรินดา', lastName: 'บุญมี', nickname: 'ปาน', gender: 'หญิง', birthDate: '2567-03-05', ageString: '2 ขวบ 5 เดือน', parentName: 'นางปรียา บุญมี', parentPhone: '081-001-0008', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'AB', avatarColor: '#EC4899', heightCm: 90.0, weightKg: 12.6, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR08' },
    { id: 'STD-09', classId: 'class-bm', nationalId: '1-1002-00101-09-9', firstName: 'พงศกร', lastName: 'แจ่มใส', nickname: 'ป๋อ', gender: 'ชาย', birthDate: '2567-04-22', ageString: '2 ขวบ 4 เดือน', parentName: 'นายพงษ์เทพ แจ่มใส', parentPhone: '081-001-0009', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#10B981', heightCm: 91.5, weightKg: 13.4, bmi: 16.0, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR09' },
    { id: 'STD-10', classId: 'class-bm', nationalId: '1-1002-00101-10-0', firstName: 'พิชญา', lastName: 'เจริญสุข', nickname: 'พาย', gender: 'หญิง', birthDate: '2567-02-14', ageString: '2 ขวบ 6 เดือน', parentName: 'นางพิศมัย เจริญสุข', parentPhone: '081-001-0010', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#F59E0B', heightCm: 89.0, weightKg: 12.3, bmi: 15.5, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR10' },
    { id: 'STD-11', classId: 'class-bm', nationalId: '1-1002-00101-11-1', firstName: 'ภัทรดนัย', lastName: 'สายชล', nickname: 'ภีม', gender: 'ชาย', birthDate: '2567-01-10', ageString: '2 ขวบ 7 เดือน', parentName: 'นายภานุ สายชล', parentPhone: '081-001-0011', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#6366F1', heightCm: 93.5, weightKg: 14.2, bmi: 16.2, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR11' },
    { id: 'STD-12', classId: 'class-bm', nationalId: '1-1002-00101-12-2', firstName: 'มลนภัส', lastName: 'ศรีสมบูรณ์', nickname: 'โมเม', gender: 'หญิง', birthDate: '2567-03-25', ageString: '2 ขวบ 5 เดือน', parentName: 'นางมณีศรี สมบูรณ์', parentPhone: '081-001-0012', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#8B5CF6', heightCm: 90.2, weightKg: 12.7, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR12' },
    { id: 'STD-13', classId: 'class-bm', nationalId: '1-1002-00101-13-3', firstName: 'วรภพ', lastName: 'เผ่าทอง', nickname: 'ภพ', gender: 'ชาย', birthDate: '2567-05-02', ageString: '2 ขวบ 3 เดือน', parentName: 'นายวรวุฒิ เผ่าทอง', parentPhone: '081-001-0013', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#3B82F6', heightCm: 91.0, weightKg: 13.0, bmi: 15.7, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR13' },
    { id: 'STD-14', classId: 'class-bm', nationalId: '1-1002-00101-14-4', firstName: 'ศุภิสรา', lastName: 'รุ่งเรือง', nickname: 'มายด์', gender: 'หญิง', birthDate: '2567-04-08', ageString: '2 ขวบ 4 เดือน', parentName: 'นางศิริพร รุ่งเรือง', parentPhone: '081-001-0014', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#EC4899', heightCm: 89.8, weightKg: 12.4, bmi: 15.4, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR14' },
    { id: 'STD-15', classId: 'class-bm', nationalId: '1-1002-00101-15-5', firstName: 'อัครวินท์', lastName: 'ประเสริฐ', nickname: 'อ๋อง', gender: 'ชาย', birthDate: '2567-02-20', ageString: '2 ขวบ 6 เดือน', parentName: 'นายอนุชา ประเสริฐ', parentPhone: '081-001-0015', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#10B981', heightCm: 92.8, weightKg: 13.9, bmi: 16.1, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR15' },
    { id: 'STD-16', classId: 'class-bm', nationalId: '1-1002-00101-16-6', firstName: 'อัญชิสา', lastName: 'มิ่งขวัญ', nickname: 'เอม', gender: 'หญิง', birthDate: '2567-03-14', ageString: '2 ขวบ 5 เดือน', parentName: 'นางอุมาพร มิ่งขวัญ', parentPhone: '081-001-0016', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#F59E0B', heightCm: 89.2, weightKg: 12.2, bmi: 15.3, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR16' },
    { id: 'STD-17', classId: 'class-bm', nationalId: '1-1002-00101-17-7', firstName: 'กิตติภพ', lastName: 'แสงสว่าง', nickname: 'กิต', gender: 'ชาย', birthDate: '2567-01-25', ageString: '2 ขวบ 7 เดือน', parentName: 'นายกิตติ แสงสว่าง', parentPhone: '081-001-0017', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#6366F1', heightCm: 93.2, weightKg: 14.1, bmi: 16.2, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR17' },
    { id: 'STD-18', classId: 'class-bm', nationalId: '1-1002-00101-18-8', firstName: 'ชนกนันท์', lastName: 'วงษ์ไทย', nickname: 'ชาเนล', gender: 'หญิง', birthDate: '2567-04-30', ageString: '2 ขวบ 4 เดือน', parentName: 'นางชลธิชา วงษ์ไทย', parentPhone: '081-001-0018', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'AB', avatarColor: '#8B5CF6', heightCm: 88.8, weightKg: 12.1, bmi: 15.3, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR18' },
    { id: 'STD-19', classId: 'class-bm', nationalId: '1-1002-00101-19-9', firstName: 'ณัฐดนัย', lastName: 'สมบูรณ์', nickname: 'ดนัย', gender: 'ชาย', birthDate: '2567-02-05', ageString: '2 ขวบ 6 เดือน', parentName: 'นายณรงค์ สมบูรณ์', parentPhone: '081-001-0019', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#3B82F6', heightCm: 92.1, weightKg: 13.6, bmi: 16.0, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR19' },
    { id: 'STD-20', classId: 'class-bm', nationalId: '1-1002-00101-20-0', firstName: 'ปัณฑน์รี', lastName: 'สุวรรณ', nickname: 'ปันปัน', gender: 'หญิง', birthDate: '2567-03-01', ageString: '2 ขวบ 5 เดือน', parentName: 'นางปานทิพย์ สุวรรณ', parentPhone: '081-001-0020', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#EC4899', heightCm: 90.6, weightKg: 12.9, bmi: 15.7, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR20' }
  ],

  attendance: [
    { id: 'att-1', childId: 'STD-01', date: '2569-08-10', status: 'PRESENT', checkTime: '07:45 น.', checkedBy: 'นางสาวกานดา ใจดี (ครูแก้ว)' },
    { id: 'att-2', childId: 'STD-02', date: '2569-08-10', status: 'PRESENT', checkTime: '07:50 น.', checkedBy: 'นางสาวกานดา ใจดี (ครูแก้ว)' },
    { id: 'att-3', childId: 'STD-03', date: '2569-08-10', status: 'LEAVE', checkTime: '08:00 น.', checkedBy: 'ระบบ (ผู้ปกครองแจ้งลา)' }
  ],

  leaveRequests: [
    {
      id: 'leave-1',
      childId: 'STD-03',
      childName: 'พอล (ด.ช. ชยพล มงคลดี)',
      parentName: 'นายชาญชัย มงคลดี',
      leaveType: 'ลาป่วย',
      startDate: '2569-08-10',
      endDate: '2569-08-11',
      reason: 'น้องมีอาการเป็นไข้สูง ต้องไปพบแพทย์ที่ รพ.บางใหญ่',
      status: 'APPROVED',
      submittedAt: '2569-08-09 19:30 น.',
      approvedBy: 'นางสาวกานดา ใจดี (ครูแก้ว)',
      remark: 'รับทราบค่ะ ขอให้น้องหายไวๆ นะคะ'
    }
  ],

  announcements: [
    {
      id: 'news-1',
      title: 'แจ้งการให้บริการฉีดวัคซีนป้องกันไข้หวัดใหญ่ประจำปี',
      content: 'ศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่ ขอเชิญชวนผู้ปกครองนำบุตรหลานเข้ารับการฉีดวัคซีนในวันศุกร์ที่ 15 สิงหาคม 2569 เวลา 09:00 - 12:00 น.',
      targetClass: 'ALL',
      author: 'กองการศึกษา เทศบาลบางใหญ่',
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
      classId: 'class-bm',
      date: '2569-08-10',
      description: 'เด็กๆ ห้องลูกหมีน่ารัก ร่วมกันใช้นิ้วมือและสีน้ำระบายสีอย่างสนุกสนาน',
      image: './assets/images/banner.png'
    }
  ],

  developmentRecords: [
    {
      id: 'dev-1',
      childId: 'STD-01',
      childName: 'น้องวิน (ด.ช. กวินท์ สุขเสริฐ)',
      term: '1/2569',
      evalDate: '2569-08-05',
      physicalScore: 4,
      emotionalScore: 4,
      socialScore: 3,
      intellectualScore: 4,
      evaluator: 'นางสาวกานดา ใจดี (ครูแก้ว)',
      notes: 'เด็กมีความคล่องแคล่วในการเคลื่อนไหว ร่าเริงแจ่มใส'
    }
  ],

  lineNotifications: [
    {
      id: 'line-1',
      timestamp: '07:45 น.',
      title: '🟢 เช็กชื่อเข้าเรียนเรียบร้อย',
      message: 'น้องวิน (ด.ช. กวินท์) ได้มาถึงศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่ แล้ว เวลา 07:45 น. (เช็กชื่อโดย ครูแก้ว)'
    }
  ],

  auditLogs: [
    { id: 'log-1', timestamp: '2026-08-10 08:00:15', user: 'นางสาวกานดา ใจดี (TEACHER)', action: 'CHECK_IN_ATTENDANCE', details: 'บันทึกการเข้าเรียนห้องลูกหมีน่ารัก' }
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

  getChildrenForParent(parentUser) {
    if (!parentUser) return [this.data.children[0]];
    const parentName = (parentUser.name || '').trim();
    const matched = this.data.children.filter(c => 
      c.parentName.includes(parentName) ||
      (parentUser.username && c.parentName.includes(parentUser.username))
    );
    return matched.length ? matched : [this.data.children[0]];
  }

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
      record = {
        id: 'att-' + Date.now(),
        childId,
        date: today,
        status,
        checkTime: now,
        checkedBy
      };
      this.data.attendance.push(record);
    }

    // Async Supabase DB Sync
    if (window.supabaseService) {
      window.supabaseService.syncAttendanceToDB(record);
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

    // Auto-update today's attendance status to 'LEAVE' so it instantly reflects in attendance stats and UI
    this.updateAttendance(req.childId, 'LEAVE', 'ระบบ (ผู้ปกครองแจ้งลา)');

    // Async Supabase DB Sync
    if (window.supabaseService) {
      window.supabaseService.syncLeaveRequestToDB(newReq);
    }

    this.saveData(this.data);
    return newReq;
  }

  updateLeaveStatus(leaveId, status, approvedBy, remark) {
    const req = this.data.leaveRequests.find(l => l.id === leaveId);
    if (req) {
      req.status = status;
      req.approvedBy = approvedBy;
      req.remark = remark;

      if (status === 'APPROVED') {
        this.updateAttendance(req.childId, 'LEAVE', approvedBy);
      }

      // Async Supabase DB Sync
      if (window.supabaseService) {
        window.supabaseService.syncLeaveRequestToDB(req);
      }

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

  // LINE Notification Simulation & API Sync
  getLineNotifications() {
    return this.data.lineNotifications || [];
  }

  sendLineNotification(title, message) {
    if (!this.data.lineNotifications) this.data.lineNotifications = [];
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    const notifItem = {
      id: 'line-' + Date.now(),
      timestamp: now,
      title,
      message
    };
    this.data.lineNotifications.unshift(notifItem);

    // Optional Real LINE Notify Integration (If LINE Token is set)
    const lineToken = localStorage.getItem('BANGYAI_LINE_NOTIFY_TOKEN');
    if (lineToken && window.supabaseService) {
      window.supabaseService.sendLineNotifyAPI(lineToken, `${title}\n${message}`);
    }
  }

  getAuditLogs() { return this.data.auditLogs; }

  addAuditLog(user, action, details) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog = { id: 'log-' + Date.now(), timestamp, user, action, details };
    this.data.auditLogs.unshift(newLog);

    // Async Supabase DB Sync
    if (window.supabaseService) {
      window.supabaseService.syncAuditLogToDB(newLog);
    }

    this.saveData(this.data);
  }
}

window.appStore = new AppStore();
