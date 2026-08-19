/* ==========================================================================
   Bang Yai Child Development Center MIS - Report Generator & Exporter
   HTML Printable Report & CSV Data Export Engine
   ========================================================================== */

const ExportUtils = {
  // Trigger Browser Print Dialog with Styled Executive Summary
  printExecutiveReport() {
    const center = window.appStore.getCenterInfo();
    const children = window.appStore.getChildren();
    const leaveReqs = window.appStore.getLeaveRequests();
    const devRecs = window.appStore.getDevelopmentRecords();

    const periodData = (window.ExecutiveView && typeof window.ExecutiveView.getPeriodData === 'function')
      ? window.ExecutiveView.getPeriodData()
      : {
          year: center.academicYear,
          term: center.term,
          periodLabel: `ปีการศึกษา ${center.academicYear} ภาคเรียนที่ ${center.term}`,
          students: children.length,
          presentRate: 96,
          operatingDays: 22,
          totalBudget: children.length * 22 * 40,
          devScores: { physical: 3.9, emotional: 3.9, social: 3.7, intellectual: 3.8 }
        };

    const presentCount = Math.round((periodData.presentRate / 100) * periodData.students);
    const rate = periodData.presentRate;

    // Audit log
    const userName = (window.authController && window.authController.getCurrentUser()) ? window.authController.getCurrentUser().name : 'ผู้บริหารเทศบาล';
    window.appStore.addAuditLog(
      userName,
      'EXPORT_REPORT',
      `ส่งออกและพิมพ์รายงานสรุปผลการบริหารจัดการ (${periodData.periodLabel})`
    );

    const windowPrint = window.open('', '', 'width=900,height=700');
    windowPrint.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>รายงานสรุปผลการบริหารจัดการ - ${center.name}</title>
        <style>
          body { font-family: 'Sarabun', 'Prompt', sans-serif; padding: 2rem; color: #111827; }
          .header { text-align: center; border-bottom: 2px solid #374151; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .header h1 { margin: 0; font-size: 1.5rem; color: #1E3A8A; }
          .header p { margin: 0.25rem 0 0 0; color: #4B5563; font-size: 0.95rem; }
          .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; background: #F3F4F6; padding: 1rem; border-radius: 8px; }
          .meta-item label { display: block; font-size: 0.8rem; color: #6B7280; font-weight: 600; }
          .meta-item span { font-weight: bold; font-size: 1.05rem; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.9rem; }
          th, td { border: 1px solid #D1D5DB; padding: 8px 12px; text-align: left; }
          th { background-color: #E5E7EB; font-weight: bold; }
          .footer { margin-top: 3rem; text-align: right; font-size: 0.85rem; color: #6B7280; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>รายงานสรุปผลการบริหารจัดการและสื่อสารข้อมูล</h1>
          <p>${center.name} เทศบาลเมืองบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี</p>
          <p><strong>${periodData.periodLabel}</strong> (ออกรายงาน ณ วันที่ ${new Date().toLocaleDateString('th-TH')})</p>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <label>จำนวนนักเรียน</label>
            <span>${periodData.students} คน</span>
          </div>
          <div class="meta-item">
            <label>อัตราการมาเรียน</label>
            <span style="color: #059669;">${rate}% (${presentCount}/${periodData.students})</span>
          </div>
          <div class="meta-item">
            <label>งบประมาณค่าอาหาร</label>
            <span style="color: #1D4ED8;">${periodData.totalBudget.toLocaleString()} บาท</span>
          </div>
          <div class="meta-item">
            <label>คำขอแจ้งลา</label>
            <span>${leaveReqs.length} รายการ</span>
          </div>
        </div>

        <h3>1. สรุปการประเมินพัฒนาการเด็กรายบุคคล (4 ด้าน)</h3>
        <table>
          <thead>
            <tr>
              <th>ชื่อ - นามสกุล (ชื่อเล่น)</th>
              <th>ร่างกาย</th>
              <th>อารมณ์-จิตใจ</th>
              <th>สังคม</th>
              <th>สติปัญญา</th>
              <th>ผู้ประเมิน</th>
            </tr>
          </thead>
          <tbody>
            ${devRecs.map(d => `
              <tr>
                <td>${d.childName}</td>
                <td>${d.physicalScore}/4</td>
                <td>${d.emotionalScore}/4</td>
                <td>${d.socialScore}/4</td>
                <td>${d.intellectualScore}/4</td>
                <td>${d.evaluator}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3>2. สรุปประวัติคำขอแจ้งลาล่าสุด</h3>
        <table>
          <thead>
            <tr>
              <th>ชื่อเด็ก</th>
              <th>ประเภทการลา</th>
              <th>วันที่ลา</th>
              <th>เหตุผล</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            ${leaveReqs.map(l => `
              <tr>
                <td>${l.childName}</td>
                <td>${l.leaveType}</td>
                <td>${l.startDate} ถึง ${l.endDate}</td>
                <td>${l.reason}</td>
                <td>${l.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>ลงนาม..........................................................</p>
          <p>( หัวหน้าศูนย์พัฒนาเด็กเล็กเทศบาลเมืองบางใหญ่ )</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    windowPrint.document.close();
  },

  // Export Data Table to CSV File
  exportToCSV(filename, rows) {
    if (!rows || !rows.length) return;
    const processRow = function (row) {
      let finalVal = '';
      for (let j = 0; j < row.length; j++) {
        let innerValue = row[j] === null || row[j] === undefined ? '' : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        let result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ',';
        finalVal += result;
      }
      return finalVal + '\n';
    };

    let csvFile = '\uFEFF'; // UTF-8 BOM for Thai language support in Microsoft Excel
    for (let i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  // Print Attendance Sheet for Teacher
  printAttendanceSheet(attendance, children) {
    const center = window.appStore ? window.appStore.getCenterInfo() : { name: 'ศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่', academicYear: '2569' };
    const today = window.appStore ? window.appStore.getTodayBEString() : new Date().toLocaleDateString('th-TH');
    const todayFormatted = window.appStore ? window.appStore.getTodayThaiFormatted() : today;

    const statusText = (status) => {
      if (!status) return 'ยังไม่เช็กชื่อ';
      if (status === 'PRESENT') return 'มาเรียน';
      if (status === 'LATE') return 'มาสาย';
      if (status === 'LEAVE') return 'ลา';
      if (status === 'ABSENT') return 'ขาดเรียน';
      return status;
    };

    const windowPrint = window.open('', '', 'width=900,height=700');
    windowPrint.document.write(`
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <title>ใบเช็กชื่อ - ${center.name}</title>
        <style>
          body { font-family: 'Sarabun', 'Prompt', sans-serif; padding: 1.5rem; color: #111827; }
          .header { text-align: center; border-bottom: 2px solid #374151; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .header h1 { margin: 0; font-size: 1.4rem; color: #1E3A8A; }
          .header p { margin: 0.25rem 0 0 0; color: #4B5563; font-size: 0.9rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.9rem; }
          th, td { border: 1px solid #D1D5DB; padding: 8px 10px; text-align: left; }
          th { background-color: #DBEAFE; font-weight: bold; text-align: center; }
          td.center { text-align: center; }
          .status-present { color: #059669; font-weight: bold; }
          .status-late { color: #D97706; font-weight: bold; }
          .status-leave { color: #3B82F6; font-weight: bold; }
          .status-absent { color: #EF4444; font-weight: bold; }
          .status-unchecked { color: #6B7280; }
          .footer { margin-top: 2rem; display: flex; justify-content: flex-end; font-size: 0.85rem; color: #6B7280; }
          .sign-area { margin-top: 3rem; display: flex; justify-content: flex-end; }
          .sign-box { text-align: center; }
          .sign-line { border-top: 1px solid #374151; width: 200px; margin: 0.5rem auto; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>บันทึกการเช็กชื่อเข้าเรียนรายวัน</h1>
          <p>${center.name} เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี</p>
          <p>ปีการศึกษา ${center.academicYear} | วันที่: ${todayFormatted}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รหัสนักเรียน</th>
              <th>ชื่อ - นามสกุล</th>
              <th>ชื่อเล่น</th>
              <th>สถานะการมาเรียน</th>
              <th>เวลาเช็กชื่อ</th>
              <th>ผู้ปกครอง</th>
              <th>เบอร์โทร</th>
            </tr>
          </thead>
          <tbody>
            ${(children || []).map((c, idx) => {
              const att = (attendance || []).find(a => a.childId === c.id);
              const s = att ? att.status : null;
              const cls = !s ? 'status-unchecked' : s === 'PRESENT' ? 'status-present' : s === 'LATE' ? 'status-late' : s === 'LEAVE' ? 'status-leave' : 'status-absent';
              return `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td class="center">${c.id}</td>
                  <td>${c.firstName} ${c.lastName}</td>
                  <td class="center">${c.nickname}</td>
                  <td class="center ${cls}">${statusText(s)}</td>
                  <td class="center">${att ? att.checkTime : '-'}</td>
                  <td>${c.parentName}</td>
                  <td>${c.parentPhone}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="sign-area">
          <div class="sign-box">
            <div class="sign-line"></div>
            <p>( ครูประจำชั้น )</p>
            <p>วันที่ ......... / ......... / .........</p>
          </div>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    windowPrint.document.close();
  }
};

window.ExportUtils = ExportUtils;
window.ExportUtil = ExportUtils;
