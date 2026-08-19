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
    { id: 'STD-01', classId: 'class-bm', nationalId: '1-1002-00101-01-1', firstName: 'ณัฐธีร์', lastName: 'แสนเจริญ', nickname: 'น้องโต้', gender: 'ชาย', birthDate: '2567-02-10', ageString: '2 ขวบ 6 เดือน', parentName: 'นายพัชรพล แสนเจริญ', parentPhone: '081-001-0001', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#4F46E5', heightCm: 92.0, weightKg: 13.5, bmi: 15.9, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'คอกรน-บาดพยัก-โปลิโอ', 'MMR', 'ไข้หวัดใหญ่'], username: 'BY-PAR01', parentLineId: 'U4c8e56010b4418f615ba32341dab6a93' },
    { id: 'STD-02', classId: 'class-bm', nationalId: '1-1002-00101-02-2', firstName: 'กัญญารัตน์', lastName: 'โพธิ์ทอง', nickname: 'น้องแก้ม', gender: 'หญิง', birthDate: '2567-01-15', ageString: '2 ขวบ 7 เดือน', parentName: 'นางสมพร โพธิ์ทอง', parentPhone: '081-001-0002', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#EC4899', heightCm: 90.5, weightKg: 12.8, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'คอกรน-บาดพยัก-โปลิโอ', 'MMR'], username: 'BY-PAR02', parentLineId: 'U97dc0505bb590d70c66d401224a422db' },
    { id: 'STD-03', classId: 'class-bm', nationalId: '1-1002-00101-03-3', firstName: 'ชยพล', lastName: 'มงคลดี', nickname: 'น้องพอล', gender: 'ชาย', birthDate: '2567-03-20', ageString: '2 ขวบ 5 เดือน', parentName: 'นายชาญชัย มงคลดี', parentPhone: '081-001-0003', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#10B981', heightCm: 91.0, weightKg: 13.2, bmi: 15.9, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR03' },
    { id: 'STD-04', classId: 'class-bm', nationalId: '1-1002-00101-04-4', firstName: 'ณิชาภัทร', lastName: 'วงศ์สว่าง', nickname: 'น้องณิชา', gender: 'หญิง', birthDate: '2567-04-12', ageString: '2 ขวบ 4 เดือน', parentName: 'นางสาวนภา วงศ์สว่าง', parentPhone: '081-001-0004', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'AB', avatarColor: '#F59E0B', heightCm: 89.5, weightKg: 12.5, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR04' },
    { id: 'STD-05', classId: 'class-bm', nationalId: '1-1002-00101-05-5', firstName: 'ธนกฤต', lastName: 'รัตนอุบล', nickname: 'น้องคุณ', gender: 'ชาย', birthDate: '2567-02-28', ageString: '2 ขวบ 6 เดือน', parentName: 'นายธนากร รัตนอุบล', parentPhone: '081-001-0005', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#6366F1', heightCm: 93.0, weightKg: 14.0, bmi: 16.2, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR', 'ไข้หวัดใหญ่'], username: 'BY-PAR05' },
    { id: 'STD-06', classId: 'class-bm', nationalId: '1-1002-00101-06-6', firstName: 'ธันย์ชนก', lastName: 'เพิ่มพูน', nickname: 'น้องวาฬ', gender: 'หญิง', birthDate: '2567-05-18', ageString: '2 ขวบ 3 เดือน', parentName: 'นางวิไล เพิ่มพูน', parentPhone: '081-001-0006', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#8B5CF6', heightCm: 88.5, weightKg: 12.0, bmi: 15.3, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR06' },
    { id: 'STD-07', classId: 'class-bm', nationalId: '1-1002-00101-07-7', firstName: 'นพณัฐ', lastName: 'แก้วมณี', nickname: 'น้องนัท', gender: 'ชาย', birthDate: '2567-01-30', ageString: '2 ขวบ 7 เดือน', parentName: 'นายณัฐพล แก้วมณี', parentPhone: '081-001-0007', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#3B82F6', heightCm: 92.5, weightKg: 13.8, bmi: 16.1, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR07' },
    { id: 'STD-08', classId: 'class-bm', nationalId: '1-1002-00101-08-8', firstName: 'ปรินดา', lastName: 'บุญมี', nickname: 'น้องปาน', gender: 'หญิง', birthDate: '2567-03-05', ageString: '2 ขวบ 5 เดือน', parentName: 'นางปรียา บุญมี', parentPhone: '081-001-0008', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'AB', avatarColor: '#EC4899', heightCm: 90.0, weightKg: 12.6, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR08' },
    { id: 'STD-09', classId: 'class-bm', nationalId: '1-1002-00101-09-9', firstName: 'พงศกร', lastName: 'แจ่มใส', nickname: 'น้องป๋อ', gender: 'ชาย', birthDate: '2567-04-22', ageString: '2 ขวบ 4 เดือน', parentName: 'นายพงษ์เทพ แจ่มใส', parentPhone: '081-001-0009', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#10B981', heightCm: 91.5, weightKg: 13.4, bmi: 16.0, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR09' },
    { id: 'STD-10', classId: 'class-bm', nationalId: '1-1002-00101-10-0', firstName: 'พิชญา', lastName: 'เจริญสุข', nickname: 'น้องพาย', gender: 'หญิง', birthDate: '2567-02-14', ageString: '2 ขวบ 6 เดือน', parentName: 'นางพิศมัย เจริญสุข', parentPhone: '081-001-0010', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#F59E0B', heightCm: 89.0, weightKg: 12.3, bmi: 15.5, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR10' },
    { id: 'STD-11', classId: 'class-bm', nationalId: '1-1002-00101-11-1', firstName: 'ภัทรดนัย', lastName: 'สายชล', nickname: 'น้องภีม', gender: 'ชาย', birthDate: '2567-01-10', ageString: '2 ขวบ 7 เดือน', parentName: 'นายภานุ สายชล', parentPhone: '081-001-0011', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#6366F1', heightCm: 93.5, weightKg: 14.2, bmi: 16.2, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR11' },
    { id: 'STD-12', classId: 'class-bm', nationalId: '1-1002-00101-12-2', firstName: 'มลนภัส', lastName: 'ศรีสมบูรณ์', nickname: 'น้องโมเม', gender: 'หญิง', birthDate: '2567-03-25', ageString: '2 ขวบ 5 เดือน', parentName: 'นางมณีศรี สมบูรณ์', parentPhone: '081-001-0012', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#8B5CF6', heightCm: 90.2, weightKg: 12.7, bmi: 15.6, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR12' },
    { id: 'STD-13', classId: 'class-bm', nationalId: '1-1002-00101-13-3', firstName: 'วรภพ', lastName: 'เผ่าทอง', nickname: 'น้องภพ', gender: 'ชาย', birthDate: '2567-05-02', ageString: '2 ขวบ 3 เดือน', parentName: 'นายวรวุฒิ เผ่าทอง', parentPhone: '081-001-0013', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#3B82F6', heightCm: 91.0, weightKg: 13.0, bmi: 15.7, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR13' },
    { id: 'STD-14', classId: 'class-bm', nationalId: '1-1002-00101-14-4', firstName: 'ศุภิสรา', lastName: 'รุ่งเรือง', nickname: 'น้องมายด์', gender: 'หญิง', birthDate: '2567-04-08', ageString: '2 ขวบ 4 เดือน', parentName: 'นางศิริพร รุ่งเรือง', parentPhone: '081-001-0014', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#EC4899', heightCm: 89.8, weightKg: 12.4, bmi: 15.4, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR14' },
    { id: 'STD-15', classId: 'class-bm', nationalId: '1-1002-00101-15-5', firstName: 'อัครวินท์', lastName: 'ประเสริฐ', nickname: 'น้องอ๋อง', gender: 'ชาย', birthDate: '2567-02-20', ageString: '2 ขวบ 6 เดือน', parentName: 'นายอนุชา ประเสริฐ', parentPhone: '081-001-0015', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#10B981', heightCm: 92.8, weightKg: 13.9, bmi: 16.1, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR15' },
    { id: 'STD-16', classId: 'class-bm', nationalId: '1-1002-00101-16-6', firstName: 'อัญชิสา', lastName: 'มิ่งขวัญ', nickname: 'น้องเอม', gender: 'หญิง', birthDate: '2567-03-14', ageString: '2 ขวบ 5 เดือน', parentName: 'นางอุมาพร มิ่งขวัญ', parentPhone: '081-001-0016', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#F59E0B', heightCm: 89.2, weightKg: 12.2, bmi: 15.3, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR16' },
    { id: 'STD-17', classId: 'class-bm', nationalId: '1-1002-00101-17-7', firstName: 'กิตติภพ', lastName: 'แสงสว่าง', nickname: 'น้องกิต', gender: 'ชาย', birthDate: '2567-01-25', ageString: '2 ขวบ 7 เดือน', parentName: 'นายกิตติ แสงสว่าง', parentPhone: '081-001-0017', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'B', avatarColor: '#6366F1', heightCm: 93.2, weightKg: 14.1, bmi: 16.2, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR17' },
    { id: 'STD-18', classId: 'class-bm', nationalId: '1-1002-00101-18-8', firstName: 'ชนกนันท์', lastName: 'วงษ์ไทย', nickname: 'น้องชาเนล', gender: 'หญิง', birthDate: '2567-04-30', ageString: '2 ขวบ 4 เดือน', parentName: 'นางชลธิชา วงษ์ไทย', parentPhone: '081-001-0018', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'AB', avatarColor: '#8B5CF6', heightCm: 88.8, weightKg: 12.1, bmi: 15.3, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR18' },
    { id: 'STD-19', classId: 'class-bm', nationalId: '1-1002-00101-19-9', firstName: 'ณัฐดนัย', lastName: 'สมบูรณ์', nickname: 'น้องดนัย', gender: 'ชาย', birthDate: '2567-02-05', ageString: '2 ขวบ 6 เดือน', parentName: 'นายณรงค์ สมบูรณ์', parentPhone: '081-001-0019', parentRelation: 'บิดา', allergy: 'ไม่มี', bloodType: 'O', avatarColor: '#3B82F6', heightCm: 92.1, weightKg: 13.6, bmi: 16.0, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR19' },
    { id: 'STD-20', classId: 'class-bm', nationalId: '1-1002-00101-20-0', firstName: 'ปัณฑน์รี', lastName: 'สุวรรณ', nickname: 'น้องปันปัน', gender: 'หญิง', birthDate: '2567-03-01', ageString: '2 ขวบ 5 เดือน', parentName: 'นางปานทิพย์ สุวรรณ', parentPhone: '081-001-0020', parentRelation: 'มารดา', allergy: 'ไม่มี', bloodType: 'A', avatarColor: '#EC4899', heightCm: 90.6, weightKg: 12.9, bmi: 15.7, growthStatus: 'สมส่วนตามเกณฑ์', vaccines: ['BCG', 'MMR'], username: 'BY-PAR20' }
  ],

  attendance: [
    { id: 'att-3', childId: 'STD-03', date: '2569-08-10', status: 'LEAVE', checkTime: '08:00 น.', checkedBy: 'ระบบ (ผู้ปกครองแจ้งลา)' }
  ],

  leaveRequests: [
    {
      id: 'leave-1',
      childId: 'STD-03',
      childName: 'น้องพอล (ด.ช. ชยพล มงคลดี)',
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
      description: 'เด็กๆ ห้องลูกหมีน่ารัก ร่วมกันใช้นิ้วมือและสีน้ำระบายสีอย่างสนุกสนาน ช่วยฝึกกล้ามเนื้อมัดเล็กและจินตนาการ',
      image: './assets/images/banner.png'
    }
  ],

  developmentRecords: [
    {
      id: 'dev-1',
      childId: 'STD-01',
      childName: 'น้องโต้ (ด.ช. ณัฐธีร์ แสนเจริญ)',
      term: '1/2569',
      evalDate: '2569-08-05',
      physicalScore: 4,
      emotionalScore: 4,
      socialScore: 3,
      intellectualScore: 4,
      evaluator: 'นางสาวกานดา ใจดี (ครูแก้ว)',
      notes: 'เด็กมีความคล่องแคล่วในการเคลื่อนไหว ร่าเริงแจ่มใส มีมนุษยสัมพันธ์ดี'
    }
  ],

  lineNotifications: [
    {
      id: 'line-1',
      timestamp: '07:45 น.',
      title: '🟢 เช็กชื่อเข้าเรียนเรียบร้อย',
      message: 'น้องโต้ (ด.ช. ณัฐธีร์) ได้มาถึงศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่ แล้ว เวลา 07:45 น. (เช็กชื่อโดย ครูแก้ว)'
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

  getTodayBEString() {
    const today = new Date();
    const beYear = today.getFullYear() + 543;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${beYear}-${month}-${day}`;
  }

  getTodayThaiFormatted() {
    const today = new Date();
    const ThaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const day = today.getDate();
    const month = ThaiMonths[today.getMonth()];
    const beYear = today.getFullYear() + 543;
    return `${day} ${month} ${beYear}`;
  }

  loadData() {
    let data = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        data = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error, fallback to seed data', e);
    }
    if (!data) {
      data = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    }

    // Merge latest seed changes for children so code edits take effect immediately
    if (data.children && INITIAL_SEED_DATA.children) {
      INITIAL_SEED_DATA.children.forEach(seedChild => {
        const existingChild = data.children.find(c => c.id === seedChild.id);
        if (existingChild) {
          existingChild.firstName = seedChild.firstName;
          existingChild.lastName = seedChild.lastName;
          existingChild.nickname = seedChild.nickname;
          existingChild.parentName = seedChild.parentName;
          if (seedChild.parentLineId) existingChild.parentLineId = seedChild.parentLineId;
        } else {
          data.children.push(seedChild);
        }
      });
    }

    // Ensure every child's nickname always starts with 'น้อง'
    if (data.children) {
      data.children.forEach(c => {
        if (c.nickname && !c.nickname.trim().startsWith('น้อง')) {
          c.nickname = 'น้อง' + c.nickname.trim();
        }
      });
    }

    // Auto-update sample dates to today's date dynamically for smooth demo
    const todayStr = this.getTodayBEString();
    if (data.attendance) {
      data.attendance.forEach(a => {
        if (!a.date || a.date === '2569-08-10') a.date = todayStr;
      });
    }
    if (data.mealPlan) {
      data.mealPlan.forEach(m => {
        if (!m.date || m.date === '2569-08-10') m.date = todayStr;
      });
    }
    if (data.activities) {
      data.activities.forEach(act => {
        if (!act.date || act.date === '2569-08-10') act.date = todayStr;
      });
    }

    this.saveData(data);
    return data;
  }

  saveData(newData) {
    this.data = newData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  async syncWithCloud(forceRerender = false) {
    if (!window.supabaseService || typeof window.supabaseService.fetchAllCloudData !== 'function') return;
    try {
      const cloudData = await window.supabaseService.fetchAllCloudData();
      if (!cloudData) return;

      let hasChanges = false;

      // 1. Sync Leave Requests from cloud
      if (cloudData.leaveRequests && Array.isArray(cloudData.leaveRequests) && cloudData.leaveRequests.length > 0) {
        cloudData.leaveRequests.forEach(cl => {
          const child = this.getChildById(cl.child_id);
          const childName = cl.child_name || (child ? `${child.nickname} (${child.firstName} ${child.lastName})` : 'บุตรหลาน');
          const parentName = cl.parent_name || (child ? child.parentName : 'ผู้ปกครอง');
          const mappedLeave = {
            id: cl.id,
            childId: cl.child_id,
            childName: childName,
            parentName: parentName,
            leaveType: cl.leave_type,
            startDate: this.formatToBEDate(cl.start_date),
            endDate: this.formatToBEDate(cl.end_date),
            reason: cl.reason,
            status: cl.status,
            remark: cl.remark,
            approvedBy: cl.approved_by,
            submittedAt: cl.submitted_at ? new Date(cl.submitted_at).toLocaleDateString('th-TH') + ' ' + new Date(cl.submitted_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' : '-'
          };

          const localIdx = this.data.leaveRequests.findIndex(l => l.id === cl.id || (l.childId === cl.child_id && (l.startDate === cl.start_date || l.startDate === mappedLeave.startDate)));
          if (localIdx >= 0) {
            if (this.data.leaveRequests[localIdx].status !== cl.status || this.data.leaveRequests[localIdx].remark !== cl.remark) {
              this.data.leaveRequests[localIdx].status = cl.status;
              this.data.leaveRequests[localIdx].remark = cl.remark;
              this.data.leaveRequests[localIdx].approvedBy = cl.approved_by;
              hasChanges = true;
            }
          } else {
            this.data.leaveRequests.unshift(mappedLeave);
            hasChanges = true;
          }
        });
      }

      // 2. Sync Attendance from cloud
      if (cloudData.attendance && Array.isArray(cloudData.attendance) && cloudData.attendance.length > 0) {
        cloudData.attendance.forEach(ca => {
          const beDate = this.formatToBEDate(ca.date);
          const localIdx = this.data.attendance.findIndex(a => a.childId === ca.child_id && (a.date === ca.date || a.date === beDate));
          if (localIdx >= 0) {
            if (this.data.attendance[localIdx].status !== ca.status || this.data.attendance[localIdx].checkTime !== ca.check_time) {
              this.data.attendance[localIdx].status = ca.status;
              this.data.attendance[localIdx].checkTime = ca.check_time;
              this.data.attendance[localIdx].checkedBy = ca.checked_by;
              this.data.attendance[localIdx].date = beDate; // Keep BE format normalized
              hasChanges = true;
            }
          } else {
            this.data.attendance.push({
              id: ca.id,
              childId: ca.child_id,
              date: beDate,
              status: ca.status,
              checkTime: ca.check_time,
              checkedBy: ca.checked_by
            });
            hasChanges = true;
          }
        });
      }

      // 3. Sync Children profiles
      if (cloudData.children && Array.isArray(cloudData.children) && cloudData.children.length > 0) {
        cloudData.children.forEach(cc => {
          const localC = this.data.children.find(c => c.id === cc.id);
          if (localC) {
            if (cc.parent_name && (localC.parentName || '').trim() !== (cc.parent_name || '').trim()) { localC.parentName = cc.parent_name.trim(); hasChanges = true; }
            if (cc.parent_phone && (localC.parentPhone || '').trim() !== (cc.parent_phone || '').trim()) { localC.parentPhone = cc.parent_phone.trim(); hasChanges = true; }
            if (cc.height_cm && Math.abs(Number(localC.heightCm || 0) - Number(cc.height_cm)) > 0.01) { localC.heightCm = Number(cc.height_cm); hasChanges = true; }
            if (cc.weight_kg && Math.abs(Number(localC.weightKg || 0) - Number(cc.weight_kg)) > 0.01) { localC.weightKg = Number(cc.weight_kg); hasChanges = true; }
            if (cc.growth_status && localC.growthStatus !== cc.growth_status) { localC.growthStatus = cc.growth_status; hasChanges = true; }
            if (cc.parent_line_id && localC.parentLineId !== cc.parent_line_id) { localC.parentLineId = cc.parent_line_id; hasChanges = true; }
          }
        });
      }

      // 4. Sync Development Records from cloud
      if (cloudData.developmentRecords && Array.isArray(cloudData.developmentRecords) && cloudData.developmentRecords.length > 0) {
        cloudData.developmentRecords.forEach(cdr => {
          const child = this.getChildById(cdr.child_id);
          const childName = cdr.child_name || (child ? `${child.nickname} (${child.firstName} ${child.lastName})` : 'เด็กในระบบ');
          const localIdx = this.data.developmentRecords.findIndex(d => d.childId === cdr.child_id && d.term === (cdr.term || '1/2569'));
          const mappedRec = {
            id: cdr.id,
            childId: cdr.child_id,
            childName: childName,
            term: cdr.term || '1/2569',
            evalDate: cdr.eval_date || this.getTodayBEString(),
            physicalScore: cdr.physical_score,
            emotionalScore: cdr.emotional_score,
            socialScore: cdr.social_score,
            intellectualScore: cdr.intellectual_score,
            evaluator: cdr.evaluator,
            notes: cdr.notes
          };
          if (localIdx >= 0) {
            const localRec = this.data.developmentRecords[localIdx];
            if (localRec.physicalScore !== cdr.physical_score || localRec.emotionalScore !== cdr.emotional_score || localRec.notes !== cdr.notes) {
              this.data.developmentRecords[localIdx] = { ...localRec, ...mappedRec };
              hasChanges = true;
            }
          } else {
            this.data.developmentRecords.push(mappedRec);
            hasChanges = true;
          }
        });
      }

      // 5. Sync Announcements from cloud
      if (cloudData.announcements && Array.isArray(cloudData.announcements) && cloudData.announcements.length > 0) {
        cloudData.announcements.forEach(cann => {
          const localIdx = this.data.announcements.findIndex(a => a.id === cann.id || a.title === cann.title);
          if (localIdx < 0) {
            this.data.announcements.unshift({
              id: cann.id,
              title: cann.title,
              content: cann.content,
              targetClass: cann.target_class || 'ALL',
              author: cann.author || 'กองการศึกษา เทศบาลบางใหญ่',
              createdAt: cann.created_at ? new Date(cann.created_at).toLocaleDateString('th-TH') : this.getTodayBEString(),
              pinned: cann.pinned || false
            });
            hasChanges = true;
          }
        });
      }

      // 6. Sync Activities from cloud
      if (cloudData.activities && Array.isArray(cloudData.activities) && cloudData.activities.length > 0) {
        cloudData.activities.forEach(cact => {
          const localIdx = this.data.activities.findIndex(a => a.id === cact.id || a.title === cact.title);
          if (localIdx < 0) {
            this.data.activities.unshift({
              id: cact.id,
              title: cact.title,
              description: cact.description,
              classId: cact.class_id || 'class-bm',
              date: cact.date || this.getTodayBEString(),
              image: cact.image || './assets/images/banner.png'
            });
            hasChanges = true;
          }
        });
      }

      if (hasChanges || forceRerender) {
        this.saveData(this.data);
        if (window.appController) {
          window.appController.refreshCurrentView();
        }
      }
    } catch (e) {
      console.warn('Background sync notice:', e);
    }
  }

  formatToBEDate(dateStr) {
    if (!dateStr) return this.getTodayBEString();
    if (dateStr.startsWith('25')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const beYear = year < 2400 ? year + 543 : year;
      return `${beYear}-${parts[1]}-${parts[2]}`;
    }
    return dateStr;
  }

  getCenterInfo() { return this.data.centerInfo; }
  getClassrooms() { return this.data.classrooms; }
  getChildren(classId = null) {
    if (!this.data.children) return [];
    if (!classId || classId === 'ALL') return this.data.children;
    return this.data.children.filter(c => c.classId === classId);
  }
  getChildById(id) {
    if (!this.data.children) return null;
    return this.data.children.find(c => c.id === id) || null;
  }

  updateChild(id, updates) {
    const child = this.getChildById(id);
    if (!child) return null;
    Object.assign(child, updates);
    this.saveData(this.data);

    // Async Supabase DB Sync
    if (window.supabaseService && typeof window.supabaseService.syncChildToDB === 'function') {
      window.supabaseService.syncChildToDB(child);
    }
    return child;
  }

  getChildrenForParent(parentUser) {
    if (!this.data.children || !this.data.children.length) {
      return INITIAL_SEED_DATA.children;
    }
    if (!parentUser) return [this.data.children[0]];
    if (parentUser.childId) {
      const child = this.getChildById(parentUser.childId);
      if (child) return [child];
    }
    const parentName = (parentUser.name || '').trim();
    const matched = this.data.children.filter(c =>
      (parentUser.username && c.username === parentUser.username) ||
      (parentName && c.parentName && c.parentName.includes(parentName))
    );
    return matched.length ? matched : [this.data.children[0]];
  }

  getAttendance(date) {
    if (!this.data.attendance) return [];
    const targetDate = date ? this.formatToBEDate(date) : this.getTodayBEString();
    return this.data.attendance.filter(a => {
      const aDate = this.formatToBEDate(a.date);
      return aDate === targetDate || a.date === targetDate;
    });
  }

  updateAttendance(childId, status, checkedBy = 'ครูผู้ดูแล', suppressNotification = false) {
    const today = this.getTodayBEString();

    if (status === 'RESET' || status === 'UNCHECKED') {
      this.data.attendance = this.data.attendance.filter(a => !(a.childId === childId && (a.date === today || this.formatToBEDate(a.date) === today)));
      this.saveData(this.data);
      return;
    }

    let record = this.data.attendance.find(a => a.childId === childId && (a.date === today || this.formatToBEDate(a.date) === today));
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    if (record) {
      record.status = status;
      record.checkTime = now;
      record.checkedBy = checkedBy;
      record.date = today;
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

    // Trigger LINE notification only if not suppressed (e.g. from leave approval)
    if (!suppressNotification) {
      const child = this.getChildById(childId);
      if (child) {
        let statusText = 'มาเรียน';
        let statusTitle = '🟢 เช็กชื่อเข้าเรียนเรียบร้อย (มาเรียน)';
        if (status === 'LATE') {
          statusText = 'มาสาย';
          statusTitle = '⏱ บันทึกสถานะการเข้าเรียน (มาสาย)';
        } else if (status === 'LEAVE') {
          statusText = 'แจ้งลา';
          statusTitle = '📄 บันทึกสถานะการเข้าเรียน (แจ้งลา)';
        } else if (status === 'ABSENT') {
          statusText = 'ขาดเรียน';
          statusTitle = '❌ บันทึกสถานะการเข้าเรียน (ขาดเรียน)';
        }

        const targetParentLineId = child.parentLineId || localStorage.getItem('BANGYAI_LINE_PERSONAL_USER_ID') || localStorage.getItem('BANGYAI_LINE_TARGET_ID') || 'U97dc0505bb590d70c66d401224a422db';
        this.sendLineNotification(
          statusTitle,
          `${child.nickname} (${child.firstName}) ได้บันทึกสถานะ "${statusText}" แล้ว เวลา ${now} (ผู้บันทึก: ${checkedBy})`,
          targetParentLineId
        );
      }
    }

    this.saveData(this.data);
  }

  getLeaveRequests() { return this.data.leaveRequests || []; }

  addLeaveRequest(req) {
    if (!this.data.leaveRequests) this.data.leaveRequests = [];

    const newReq = {
      id: 'leave-' + Date.now(),
      status: 'PENDING',
      submittedAt: new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      approvedBy: null,
      remark: null,
      ...req
    };
    this.data.leaveRequests.unshift(newReq);

    // Send LINE Notification specifically for Leave Request submission
    const child = this.getChildById(req.childId);
    const targetParentLineId = (child && child.parentLineId) || localStorage.getItem('BANGYAI_LINE_PERSONAL_USER_ID') || 'U97dc0505bb590d70c66d401224a422db';

    this.sendLineNotification(
      `📄 ยื่นคำขอแจ้งลา (${newReq.leaveType}) เรียบร้อย`,
      `คำขอแจ้งลาของ ${newReq.childName} (วันที่ ${newReq.startDate} ถึง ${newReq.endDate})\nเหตุผล: ${newReq.reason}\nสถานะ: ส่งถึงครูประจำชั้นแล้ว (รอครูอนุมัติ)`,
      targetParentLineId
    );

    // Async Supabase DB Sync
    if (window.supabaseService) {
      window.supabaseService.syncLeaveRequestToDB(newReq);
    }

    this.saveData(this.data);
    return newReq;
  }

  updateLeaveStatus(leaveId, status, approvedBy, remark) {
    if (!this.data.leaveRequests) return null;
    const req = this.data.leaveRequests.find(l => l.id === leaveId);
    if (req) {
      req.status = status;
      req.approvedBy = approvedBy;
      req.remark = remark;

      const child = this.getChildById(req.childId);
      const targetParentLineId = (child && child.parentLineId) || localStorage.getItem('BANGYAI_LINE_PERSONAL_USER_ID') || 'U97dc0505bb590d70c66d401224a422db';

      if (status === 'APPROVED') {
        // Teacher approved: update attendance to LEAVE for today
        this.updateAttendance(req.childId, 'LEAVE', approvedBy, true);

        this.sendLineNotification(
          `📩 ผลการอนุมัติคำขอแจ้งลา (อนุมัติแล้ว)`,
          `คำขอแจ้งลา (${req.leaveType}) ของ ${req.childName} วันที่ ${req.startDate} ถึง ${req.endDate} ได้รับการ "อนุมัติเรียบร้อยแล้ว" โดย ${approvedBy}${remark ? `\nหมายเหตุ: ${remark}` : ''}`,
          targetParentLineId
        );
      } else {
        this.sendLineNotification(
          `📩 ผลการอนุมัติคำขอแจ้งลา (ไม่อนุมัติ)`,
          `คำขอแจ้งลา (${req.leaveType}) ของ ${req.childName} "ไม่อนุมัติ" โดย ${approvedBy}${remark ? `\nหมายเหตุ: ${remark}` : ''}`,
          targetParentLineId
        );
      }

      // Async Supabase DB Sync
      if (window.supabaseService) {
        window.supabaseService.syncLeaveRequestToDB(req);
      }

      this.saveData(this.data);
    }
    return req;
  }

  getAnnouncements() { return this.data.announcements || []; }

  addAnnouncement(ann) {
    const newAnn = {
      id: 'news-' + Date.now(),
      createdAt: new Date().toLocaleDateString('th-TH'),
      pinned: false,
      ...ann
    };
    if (!this.data.announcements) this.data.announcements = [];
    this.data.announcements.unshift(newAnn);

    this.sendLineNotification(
      `📢 ประกาศข่าวสารใหม่จากศูนย์ฯ`,
      `${ann.title}`
    );

    // Async Supabase DB Sync
    if (window.supabaseService && typeof window.supabaseService.syncAnnouncementToDB === 'function') {
      window.supabaseService.syncAnnouncementToDB(newAnn);
    }

    this.saveData(this.data);
    return newAnn;
  }

  getMealPlan() { return this.data.mealPlan || []; }
  getActivities() { return this.data.activities || []; }

  addActivity(act) {
    const newAct = { id: 'act-' + Date.now(), date: this.getTodayBEString(), ...act };
    if (!this.data.activities) this.data.activities = [];
    this.data.activities.unshift(newAct);

    // Async Supabase DB Sync
    if (window.supabaseService && typeof window.supabaseService.syncActivityToDB === 'function') {
      window.supabaseService.syncActivityToDB(newAct);
    }

    this.saveData(this.data);
    return newAct;
  }

  getDevelopmentRecords() { return this.data.developmentRecords || []; }

  saveDevelopmentRecord(rec) {
    if (!this.data.developmentRecords) this.data.developmentRecords = [];
    const existing = this.data.developmentRecords.find(d => d.childId === rec.childId && d.term === (rec.term || '1/2569'));
    let savedRec;
    if (existing) {
      Object.assign(existing, rec);
      savedRec = existing;
    } else {
      savedRec = { id: 'dev-' + Date.now(), ...rec };
      this.data.developmentRecords.push(savedRec);
    }

    // Async Supabase DB Sync
    if (window.supabaseService && typeof window.supabaseService.syncDevelopmentRecordToDB === 'function') {
      window.supabaseService.syncDevelopmentRecordToDB(savedRec);
    }

    this.saveData(this.data);
  }

  // LINE Notification Simulation & API Sync
  getLineNotifications() {
    return this.data.lineNotifications || [];
  }

  sendLineNotification(title, message, targetIdOverride = null) {
    if (!this.data.lineNotifications) this.data.lineNotifications = [];
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    const notifItem = {
      id: 'line-' + Date.now(),
      timestamp: now,
      title,
      message
    };
    this.data.lineNotifications.unshift(notifItem);

    // Dual LINE Messaging API Integration (Both LINE Group AND Personal Parent User ID)
    const channelToken = localStorage.getItem('BANGYAI_LINE_CHANNEL_TOKEN') || 'L7/4yLNWgK1roywgIIx98q84tRljHPAv7SjKG6ExDkATxkCGNwqqI3Nm4oiaeVMBEtAgflw8LJzt4ghPKfFLXUWRsRlHAraAHUaXDbwk/W0FsibrVYyVaYDFI1RBPh0HGXGwxYqqYVLRP8Snr6bSSwdB04t89/1O/w1cDnyilFU=';
    const lineGroupId = localStorage.getItem('BANGYAI_LINE_GROUP_ID') || 'Cf41f004eb886e7c190b9d4d2e823055d';
    const personalUserId = targetIdOverride || localStorage.getItem('BANGYAI_LINE_PERSONAL_USER_ID') || 'U97dc0505bb590d70c66d401224a422db';

    if (channelToken && window.supabaseService) {
      // 1. Send to LINE Group
      if (lineGroupId) {
        window.supabaseService.sendLineMessagingAPI(channelToken, lineGroupId, `${title}\n${message}`);
      }
      // 2. Send to Personal Parent LINE
      if (personalUserId && personalUserId !== lineGroupId) {
        window.supabaseService.sendLineMessagingAPI(channelToken, personalUserId, `${title}\n[แจ้งเตือนส่วนตัวผู้ปกครอง]\n${message}`);
      }
    }
  }

  getAuditLogs() { return this.data.auditLogs || []; }

  addAuditLog(user, action, details) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog = { id: 'log-' + Date.now(), timestamp, user, action, details };
    if (!this.data.auditLogs) this.data.auditLogs = [];
    this.data.auditLogs.unshift(newLog);

    // Async Supabase DB Sync
    if (window.supabaseService) {
      window.supabaseService.syncAuditLogToDB(newLog);
    }

    this.saveData(this.data);
  }
}

window.appStore = new AppStore();
