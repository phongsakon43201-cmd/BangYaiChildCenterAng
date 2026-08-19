/* ==========================================================================
   Bang Yai Child Development Center MIS - Executive View Component
   Executive Interface: KPI Dashboard (Filter by Year, Term, Month), Registry, Audit Logs
   ========================================================================== */

const ExecutiveView = {
  currentTab: 'DASHBOARD',
  showFullNationalId: false,
  selectedYear: '2569',
  selectedTerm: '1',
  selectedMonth: 'ALL',

  onFilterChange(type, value, containerId = 'main-view-root') {
    if (type === 'year') {
      this.selectedYear = value;
    } else if (type === 'term') {
      this.selectedTerm = value;
      // Auto adjust month options if month doesn't belong to term
      if (this.selectedTerm === '1' && ['11', '12', '1', '2', '3'].includes(this.selectedMonth)) {
        this.selectedMonth = 'ALL';
      } else if (this.selectedTerm === '2' && ['5', '6', '7', '8', '9', '10'].includes(this.selectedMonth)) {
        this.selectedMonth = 'ALL';
      }
    } else if (type === 'month') {
      this.selectedMonth = value;
    }
    this.render(containerId);
  },

  resetFilter(containerId = 'main-view-root') {
    this.selectedYear = '2569';
    this.selectedTerm = '1';
    this.selectedMonth = 'ALL';
    this.render(containerId);
  },

  getPeriodData() {
    const year = this.selectedYear;
    const term = this.selectedTerm;
    const month = this.selectedMonth;

    const monthNames = {
      'ALL': 'ทุกเดือนในภาคเรียน',
      '5': 'พฤษภาคม',
      '6': 'มิถุนายน',
      '7': 'กรกฎาคม',
      '8': 'สิงหาคม',
      '9': 'กันยายน',
      '10': 'ตุลาคม',
      '11': 'พฤศจิกายน',
      '12': 'ธันวาคม',
      '1': 'มกราคม',
      '2': 'กุมภาพันธ์',
      '3': 'มีนาคม'
    };

    const termNames = {
      'ALL': 'ทั้งปีการศึกษา',
      '1': 'ภาคเรียนที่ 1 (พ.ค. - ต.ค.)',
      '2': 'ภาคเรียนที่ 2 (พ.ย. - มี.ค.)'
    };

    // Base mock & real configuration by Year
    const yearConfig = {
      '2569': {
        studentCount: 20,
        capacity: 20,
        teacher: 'นางสาวกานดา ใจดี (ครูแก้ว)',
        classroomsCount: 1,
        baseRate: 96,
        devScores: { physical: 3.9, emotional: 3.9, social: 3.7, intellectual: 3.8 },
        growth: { normal: 17, overweight: 2, obese: 0, underweight: 1 },
        leavesPending: 1,
        leavesTotal: 4
      },
      '2568': {
        studentCount: 18,
        capacity: 20,
        teacher: 'นางสาวกานดา ใจดี & นางสาวรัตนา สุขใจ',
        classroomsCount: 1,
        baseRate: 94,
        devScores: { physical: 3.8, emotional: 3.9, social: 3.8, intellectual: 3.7 },
        growth: { normal: 15, overweight: 2, obese: 0, underweight: 1 },
        leavesPending: 0,
        leavesTotal: 12
      },
      '2567': {
        studentCount: 19,
        capacity: 20,
        teacher: 'นางสาวกานดา ใจดี & นางพิมพา จันทร์เพ็ญ',
        classroomsCount: 1,
        baseRate: 93,
        devScores: { physical: 3.7, emotional: 3.8, social: 3.6, intellectual: 3.7 },
        growth: { normal: 15, overweight: 2, obese: 1, underweight: 1 },
        leavesPending: 0,
        leavesTotal: 16
      }
    }[year] || {
      studentCount: 20, capacity: 20, teacher: 'ครูผู้ดูแลเด็ก', classroomsCount: 1, baseRate: 95,
      devScores: { physical: 3.8, emotional: 3.8, social: 3.7, intellectual: 3.8 },
      growth: { normal: 17, overweight: 2, obese: 0, underweight: 1 }, leavesPending: 0, leavesTotal: 5
    };

    // Calculate Operating Days & Budget
    let operatingDays = 22;
    let periodLabel = '';
    let trendData = [];

    if (month !== 'ALL') {
      operatingDays = 22;
      periodLabel = `ประจำเดือน${monthNames[month]} ปี ${year} (${term === 'ALL' ? 'ตลอดปีการศึกษา' : `ภาคเรียนที่ ${term}`})`;
      trendData = [
        { day: 'สัปดาห์ 1', rate: Math.min(100, yearConfig.baseRate + 2) },
        { day: 'สัปดาห์ 2', rate: Math.max(80, yearConfig.baseRate - 1) },
        { day: 'สัปดาห์ 3', rate: Math.min(100, yearConfig.baseRate + 1) },
        { day: 'สัปดาห์ 4', rate: yearConfig.baseRate }
      ];
    } else if (term === '1') {
      operatingDays = 100; // 5 months
      periodLabel = `ภาคเรียนที่ 1/${year} (พฤษภาคม - ตุลาคม ${year})`;
      trendData = [
        { day: 'พ.ค.', rate: 96 },
        { day: 'มิ.ย.', rate: 94 },
        { day: 'ก.ค.', rate: 92 },
        { day: 'ส.ค.', rate: Math.min(100, yearConfig.baseRate) },
        { day: 'ก.ย.', rate: 95 },
        { day: 'ต.ค.', rate: 97 }
      ];
    } else if (term === '2') {
      operatingDays = 100; // 5 months
      periodLabel = `ภาคเรียนที่ 2/${year} (พฤศจิกายน - มีนาคม ${parseInt(year, 10) + 1})`;
      trendData = [
        { day: 'พ.ย.', rate: 95 },
        { day: 'ธ.ค.', rate: 93 },
        { day: 'ม.ค.', rate: 96 },
        { day: 'ก.พ.', rate: 94 },
        { day: 'มี.ค.', rate: 98 }
      ];
    } else {
      operatingDays = 200; // 10 months
      periodLabel = `ภาพรวมทั้งปีการศึกษา ${year}`;
      trendData = [
        { day: 'พ.ค.', rate: 96 },
        { day: 'ก.ค.', rate: 93 },
        { day: 'ก.ย.', rate: 95 },
        { day: 'พ.ย.', rate: 94 },
        { day: 'ม.ค.', rate: 96 },
        { day: 'มี.ค.', rate: 98 }
      ];
    }

    const students = yearConfig.studentCount;
    const mealRatePerDay = 40; // 40 THB/day/child
    const totalBudget = students * operatingDays * mealRatePerDay;

    const presentRate = yearConfig.baseRate;
    const presentStudents = Math.round((presentRate / 100) * students);
    const leaveStudents = Math.max(0, students - presentStudents > 1 ? 1 : (students - presentStudents));
    const absentStudents = Math.max(0, students - presentStudents - leaveStudents);

    return {
      year,
      term,
      month,
      termName: termNames[term],
      monthName: monthNames[month],
      periodLabel,
      students,
      capacity: yearConfig.capacity,
      teacher: yearConfig.teacher,
      classroomsCount: yearConfig.classroomsCount,
      operatingDays,
      mealRatePerDay,
      totalBudget,
      presentRate,
      presentStudents,
      leaveStudents,
      absentStudents,
      devScores: yearConfig.devScores,
      growth: yearConfig.growth,
      leavesPending: yearConfig.leavesPending,
      leavesTotal: yearConfig.leavesTotal,
      trendData
    };
  },

  render(containerId = 'main-view-root') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const children = window.appStore.getChildren() || [];
    const auditLogs = window.appStore.getAuditLogs() || [];
    const centerInfo = window.appStore.getCenterInfo() || {};

    const periodData = this.getPeriodData();

    container.innerHTML = `
      <div class="animate-fade-in">
        <!-- Top Executive Header Banner -->
        <div class="glass-card" style="margin-bottom: 1.25rem; background: linear-gradient(135deg, rgba(255, 251, 235, 0.95), rgba(254, 243, 199, 0.95)); border-color: rgba(217, 119, 6, 0.25);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-executive" style="margin-bottom: 0.25rem;">👨‍💼 มุมมองผู้บริหาร / เทศบาล</span>
              <h2 style="font-size: 1.35rem; font-weight: 800; margin: 0; color: #78350F;">${centerInfo.name}</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                อ.${centerInfo.district} จ.${centerInfo.province} | <strong>${periodData.periodLabel}</strong>
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary btn-sm" onclick="window.ExportUtils.printExecutiveReport()" style="font-weight: 700; box-shadow: 0 2px 8px rgba(79,70,229,0.25);">
                🖨️ พิมพ์รายงานสรุปผล
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.ExecutiveView.exportDataCSV()" style="font-weight: 600; background: #FFF;">
                📥 ส่งออก Excel (CSV)
              </button>
            </div>
          </div>
        </div>

        <!-- Sub Tabs -->
        <div class="view-tabs">
          <button type="button" class="tab-link ${this.currentTab === 'DASHBOARD' ? 'active' : ''}" onclick="window.ExecutiveView.currentTab = 'DASHBOARD'; window.ExecutiveView.render('${containerId}');">
            📊 Dashboard สถิติภาพรวม
          </button>
          <button type="button" class="tab-link ${this.currentTab === 'REGISTRY' ? 'active' : ''}" onclick="window.ExecutiveView.currentTab = 'REGISTRY'; window.ExecutiveView.render('${containerId}');">
            📋 ทะเบียนนักเรียน (${children.length} คน)
          </button>
          <button type="button" class="tab-link ${this.currentTab === 'AUDIT_LOGS' ? 'active' : ''}" onclick="window.ExecutiveView.currentTab = 'AUDIT_LOGS'; window.ExecutiveView.render('${containerId}');">
            🔐 Audit Logs (${auditLogs.length})
          </button>
        </div>

        <div id="exec-tab-content">
          ${this.renderTabContent(this.currentTab, children, auditLogs, centerInfo, containerId, periodData)}
        </div>
      </div>
    `;

    if (this.currentTab === 'DASHBOARD') {
      setTimeout(() => {
        if (window.ChartUtils) {
          window.ChartUtils.renderDonutChart('exec-attendance-donut', periodData.presentRate, 'อัตรามาเรียน', '#10B981');
          window.ChartUtils.renderAttendanceTrend('exec-att-trend', periodData.trendData);
        }
      }, 50);
    }
  },

  renderTabContent(tab, children, auditLogs, centerInfo, containerId, periodData) {
    if (tab === 'DASHBOARD') {
      const monthOptions = [
        { value: 'ALL', label: 'ทุกเดือนในภาคเรียน' },
        ...(this.selectedTerm === '1' || this.selectedTerm === 'ALL' ? [
          { value: '5', label: 'พฤษภาคม' },
          { value: '6', label: 'มิถุนายน' },
          { value: '7', label: 'กรกฎาคม' },
          { value: '8', label: 'สิงหาคม' },
          { value: '9', label: 'กันยายน' },
          { value: '10', label: 'ตุลาคม' }
        ] : []),
        ...(this.selectedTerm === '2' || this.selectedTerm === 'ALL' ? [
          { value: '11', label: 'พฤศจิกายน' },
          { value: '12', label: 'ธันวาคม' },
          { value: '1', label: 'มกราคม' },
          { value: '2', label: 'กุมภาพันธ์' },
          { value: '3', label: 'มีนาคม' }
        ] : [])
      ];

      return `
        <!-- Smart Period Filter Bar -->
        <div class="glass-card" style="margin-bottom: 1.5rem; background: #FFFFFF; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); padding: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.25rem;">📅</span>
                <strong style="font-size: 0.95rem; color: var(--text-main);">เลือกช่วงเวลาประเมิน:</strong>
              </div>

              <!-- Filter 1: Academic Year -->
              <div>
                <label style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: 600;">ปีการศึกษา</label>
                <select class="form-control btn-sm" style="font-weight: 700; min-width: 120px; background: #F8FAFC;" onchange="window.ExecutiveView.onFilterChange('year', this.value, '${containerId}')">
                  <option value="2569" ${this.selectedYear === '2569' ? 'selected' : ''}>ปีการศึกษา 2569 (ปัจจุบัน)</option>
                  <option value="2568" ${this.selectedYear === '2568' ? 'selected' : ''}>ปีการศึกษา 2568</option>
                  <option value="2567" ${this.selectedYear === '2567' ? 'selected' : ''}>ปีการศึกษา 2567</option>
                </select>
              </div>

              <!-- Filter 2: Term -->
              <div>
                <label style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: 600;">ภาคเรียน / เทอม</label>
                <select class="form-control btn-sm" style="font-weight: 700; min-width: 140px; background: #F8FAFC;" onchange="window.ExecutiveView.onFilterChange('term', this.value, '${containerId}')">
                  <option value="1" ${this.selectedTerm === '1' ? 'selected' : ''}>ภาคเรียนที่ 1</option>
                  <option value="2" ${this.selectedTerm === '2' ? 'selected' : ''}>ภาคเรียนที่ 2</option>
                  <option value="ALL" ${this.selectedTerm === 'ALL' ? 'selected' : ''}>ทั้งปีการศึกษา</option>
                </select>
              </div>

              <!-- Filter 3: Month -->
              <div>
                <label style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: 600;">ประจำเดือน</label>
                <select class="form-control btn-sm" style="font-weight: 700; min-width: 140px; background: #F8FAFC;" onchange="window.ExecutiveView.onFilterChange('month', this.value, '${containerId}')">
                  ${monthOptions.map(opt => `<option value="${opt.value}" ${this.selectedMonth === opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Reset Button & Status Badge -->
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge" style="background: #EFF6FF; color: #1D4ED8; font-weight: 700; font-size: 0.8rem; padding: 4px 10px;">
                🔍 ${periodData.periodLabel}
              </span>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.ExecutiveView.resetFilter('${containerId}')" title="รีเซ็ตกลับสู่ข้อมูลปัจจุบัน">
                🔄 ข้อมูลปัจจุบัน
              </button>
            </div>

          </div>
        </div>

        <!-- 4 Top KPI Cards -->
        <div class="grid-4" style="margin-bottom: 1.5rem;">
          <div class="glass-card stat-card">
            <div class="stat-icon indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="stat-label">จำนวนนักเรียนที่ลงทะเบียน</div>
              <div class="stat-value">${periodData.students} คน</div>
              <div class="stat-label" style="font-size: 0.75rem;">ความจุรองรับ: ${periodData.capacity} คน (${Math.round((periodData.students/periodData.capacity)*100)}%)</div>
            </div>
          </div>

          <div class="glass-card stat-card">
            <div class="stat-icon emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <div class="stat-label">อัตราการมาเรียนเฉลี่ย</div>
              <div class="stat-value" style="color: var(--success-500);">${periodData.presentRate}%</div>
              <div class="stat-label" style="font-size: 0.75rem;">เฉลี่ยมาเรียน ${periodData.presentStudents} | ลา ${periodData.leaveStudents} | ขาด ${periodData.absentStudents}</div>
            </div>
          </div>

          <div class="glass-card stat-card">
            <div class="stat-icon amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <div class="stat-label">สถิติคำขอแจ้งลา</div>
              <div class="stat-value">${periodData.leavesTotal} รายการ</div>
              <div class="stat-label" style="font-size: 0.75rem;">รอดำเนินการ: <strong style="color: #D97706;">${periodData.leavesPending}</strong> | อนุมัติแล้ว ${periodData.leavesTotal - periodData.leavesPending}</div>
            </div>
          </div>

          <div class="glass-card stat-card">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div>
              <div class="stat-label">บันทึกพัฒนาการ 4 ด้าน</div>
              <div class="stat-value">${periodData.students}/${periodData.students} คน</div>
              <div class="stat-label" style="font-size: 0.75rem;">ประเมินครบ 100% (ปี ${periodData.year})</div>
            </div>
          </div>
        </div>

        <!-- 2 Visual Charts: Donut + Trend -->
        <div class="grid-2" style="margin-bottom: 1.5rem;">
          <div class="glass-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">📊 อัตราการมาเรียน (${periodData.monthName !== 'ทุกเดือนในภาคเรียน' ? periodData.monthName : periodData.termName})</h3>
              <span class="badge badge-success">${periodData.presentRate}%</span>
            </div>
            <div id="exec-attendance-donut"></div>
          </div>

          <div class="glass-card">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">📈 สถิติแนวโน้มการมาเรียน (${periodData.trendData.length > 5 ? 'รายเดือน' : 'รายสัปดาห์'})</h3>
              <span class="badge badge-info">${periodData.year}</span>
            </div>
            <div id="exec-att-trend"></div>
          </div>
        </div>

        <!-- 3 Summary Breakdown Cards: Budget, Nutrition, Classroom -->
        <div class="grid-3" style="margin-bottom: 1.5rem;">
          
          <!-- Card 1: Budget Analysis -->
          <div class="glass-card">
            <h4 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
              <span>💰</span> งบประมาณอาหารกลางวัน (${periodData.periodLabel})
            </h4>
            <div style="background: white; border-radius: var(--radius-md); padding: 1.1rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">ยอดงบประมาณจัดสรร (${periodData.operatingDays} วันทำการ)</div>
              <div style="font-size: 1.45rem; font-weight: 800; color: #1D4ED8; margin-top: 3px;">
                ${periodData.totalBudget.toLocaleString()} บาท
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px; padding-top: 6px; border-top: 1px dashed var(--border-color);">
                สูตร: <strong>${periodData.students} คน x ${periodData.operatingDays} วัน x 40 บ.</strong>
              </div>
            </div>
          </div>

          <!-- Card 2: Growth & Nutrition Breakdown -->
          <div class="glass-card">
            <h4 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
              <span>📏</span> ภาวะโภชนาการและการเจริญเติบโต
            </h4>
            <div style="background: white; border-radius: var(--radius-md); padding: 1.1rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
                <span>🟢 สมส่วนตามเกณฑ์:</span>
                <strong style="color: #059669;">${periodData.growth.normal} คน (${Math.round((periodData.growth.normal/periodData.students)*100)}%)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
                <span>🟡 ท้วม / เริ่มอ้วน:</span>
                <strong style="color: #D97706;">${periodData.growth.overweight} คน</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span>🔵 ค่อนข้างผอม:</span>
                <strong style="color: #2563EB;">${periodData.growth.underweight} คน</strong>
              </div>
            </div>
          </div>

          <!-- Card 3: Development 4 Aspects Summary -->
          <div class="glass-card">
            <h4 style="font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
              <span>🧠</span> ภาพรวมพัฒนาการ 4 ด้าน (เต็ม 4.0)
            </h4>
            <div style="background: white; border-radius: var(--radius-md); padding: 1.1rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                <span>1. ร่างกาย:</span>
                <strong style="color: #059669;">${periodData.devScores.physical} / 4.0</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                <span>2. อารมณ์-จิตใจ:</span>
                <strong style="color: #3B82F6;">${periodData.devScores.emotional} / 4.0</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                <span>3. สังคม:</span>
                <strong style="color: #8B5CF6;">${periodData.devScores.social} / 4.0</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                <span>4. สติปัญญา:</span>
                <strong style="color: #F59E0B;">${periodData.devScores.intellectual} / 4.0</strong>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    if (tab === 'REGISTRY') {
      const showFullId = this.showFullNationalId || false;
      const maskId = (idStr) => {
        if (!idStr) return '-';
        if (showFullId) return idStr;
        return idStr.replace(/^(\d-\d{4}-)\d{5}(-\d{2}-\d)$/, '$1XXXXX$2');
      };
      const classrooms = window.appStore.getClassrooms();
      const getClassName = (classId) => {
        const cls = classrooms.find(c => c.id === classId);
        return cls ? cls.name : classId || '-';
      };

      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">ทะเบียนนักเรียนศูนย์พัฒนาเด็กเล็ก (${periodData.students} คน)</h3>
              <span class="badge badge-success" style="font-size: 0.75rem; margin-top: 4px;">ปฏิบัติตามหลัก PDPA (Data Minimization)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.ExecutiveView.showFullNationalId = !window.ExecutiveView.showFullNationalId; window.ExecutiveView.render('${containerId}');">
                ${showFullId ? '🔒 ซ่อน เลขบัตรประชาชน (PDPA)' : '👁️ แสดง เลขบัตรประชาชนเต็ม'}
              </button>
              <input type="text" placeholder="ค้นหาชื่อนักเรียน / ผู้ปกครอง..." class="form-control btn-sm" style="max-width: 240px;" onkeyup="window.ExecutiveView.filterRegistry(this.value)">
            </div>
          </div>

          <div class="data-table-container">
            <table class="data-table" id="registry-table">
              <thead>
                <tr>
                  <th>เลขประจำตัวประชาชน (PDPA)</th>
                  <th>ชื่อ - นามสกุล (ชื่อเล่น)</th>
                  <th>เพศ</th>
                  <th>อายุ</th>
                  <th>ห้องเรียน</th>
                  <th>ผู้ปกครอง</th>
                  <th>เบอร์โทรศัพท์ติดต่อ</th>
                  <th>สิ่งที่แพ้อาหาร</th>
                </tr>
              </thead>
              <tbody>
                ${children.slice(0, periodData.students).map(c => `
                  <tr>
                    <td style="font-family: monospace;">${maskId(c.nationalId)}</td>
                    <td><strong>${c.firstName} ${c.lastName} (${c.nickname})</strong></td>
                    <td>${c.gender}</td>
                    <td>${c.ageString}</td>
                    <td><span class="badge badge-teacher" style="font-size: 0.75rem; white-space: nowrap;">${getClassName(c.classId)}</span></td>
                    <td>${c.parentName} (${c.parentRelation || 'ผู้ปกครอง'})</td>
                    <td>${c.parentPhone}</td>
                    <td><strong style="color: ${c.allergy !== 'ไม่มี' ? 'var(--danger-500)' : 'var(--text-muted)'};">${c.allergy}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'AUDIT_LOGS') {
      return `
        <div class="glass-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.1rem; margin: 0;">บันทึกการเข้าถึงระบบ Audit Log ฉบับเต็ม</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">ตามข้อกำหนด พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) & OWASP ASVS</p>
            </div>
            <span class="badge badge-success">บันทึกอัตโนมัติ Real-Time</span>
          </div>

          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>วัน-เวลา (Timestamp)</th>
                  <th>ผู้ดำเนินการ (User & Role)</th>
                  <th>การกระทำ (Action Code)</th>
                  <th>รายละเอียด (Log Details)</th>
                </tr>
              </thead>
              <tbody>
                ${auditLogs.map(l => `
                  <tr>
                    <td style="font-family: monospace; font-size: 0.85rem;">${l.timestamp}</td>
                    <td><strong>${l.user}</strong></td>
                    <td><span class="badge badge-info">${l.action}</span></td>
                    <td>${l.details}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    return '';
  },

  filterRegistry(query) {
    const table = document.getElementById('registry-table');
    if (!table) return;
    const trs = table.getElementsByTagName('tr');
    const q = query.toLowerCase();

    for (let i = 1; i < trs.length; i++) {
      const text = trs[i].textContent.toLowerCase();
      trs[i].style.display = text.includes(q) ? '' : 'none';
    }
  },

  exportDataCSV() {
    const periodData = this.getPeriodData();
    const children = window.appStore.getChildren() || [];
    const showFullId = this.showFullNationalId || false;
    const maskId = (idStr) => (showFullId ? idStr : (idStr || '').replace(/^(\d-\d{4}-)\d{5}(-\d{2}-\d)$/, '$1XXXXX$2'));
    const rows = [
      ['ศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่ จังหวัดนนทบุรี'],
      [`รายงานสรุปข้อมูล: ${periodData.periodLabel}`],
      [''],
      ['เลขประจำตัวประชาชน (PDPA)', 'ชื่อ', 'นามสกุล', 'ชื่อเล่น', 'เพศ', 'อายุ', 'ผู้ปกครอง', 'เบอร์โทรศัพท์ติดต่อ', 'สิ่งที่แพ้อาหาร'],
      ...children.slice(0, periodData.students).map(c => [maskId(c.nationalId), c.firstName, c.lastName, c.nickname, c.gender, c.ageString, c.parentName, c.parentPhone, c.allergy])
    ];
    window.ExportUtils.exportToCSV(`รายงานผู้บริหาร_${periodData.year}_${periodData.term}.csv`, rows);
    if (window.ModalsComponent) {
      window.ModalsComponent.showToast(`ส่งออกไฟล์ Excel (${periodData.periodLabel}) เรียบร้อยแล้ว`, 'success');
    }
  }
};

window.ExecutiveView = ExecutiveView;