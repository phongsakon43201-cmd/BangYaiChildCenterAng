/* ==========================================================================
   Bang Yai Child Development Center MIS - Report Generator & Exporter
   HTML Printable Report & CSV Data Export Engine
   ========================================================================== */

const ExportUtils = {
  // Trigger Browser Print Dialog with Styled Executive Summary
  printExecutiveReport() {
    const center = window.appStore.getCenterInfo();
    const children = window.appStore.getChildren();
    const attendance = window.appStore.getAttendance();
    const leaveReqs = window.appStore.getLeaveRequests();
    const devRecs = window.appStore.getDevelopmentRecords();

    const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
    const rate = Math.round((presentCount / (children.length || 1)) * 100);

    // Audit log
    window.appStore.addAuditLog(
      'ผู้บริหารเทศบาล',
      'EXPORT_REPORT',
      'ส่งออกและพิมพ์รายงานสรุปผลการบริหารจัดการประจำวัน'
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
          .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; background: #F3F4F6; padding: 1rem; border-radius: 8px; }
          .meta-item label { display: block; font-size: 0.8rem; color: #6B7280; }
          .meta-item span { font-weight: bold; font-size: 1.1rem; }
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
          <p>ปีการศึกษา ${center.academicYear} (ออกรายงาน ณ วันที่ ${new Date().toLocaleDateString('th-TH')})</p>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <label>จำนวนนักเรียนทั้งหมด</label>
            <span>${children.length} คน</span>
          </div>
          <div class="meta-item">
            <label>อัตราการมาเรียนวันนี้</label>
            <span>${rate}% (${presentCount}/${children.length})</span>
          </div>
          <div class="meta-item">
            <label>คำขอแจ้งลารออนุมัติ</label>
            <span>${leaveReqs.filter(l => l.status === 'PENDING').length} รายการ</span>
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
  }
};

window.ExportUtils = ExportUtils;
