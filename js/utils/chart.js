/* ==========================================================================
   Bang Yai Child Development Center MIS - SVG Chart Rendering Utilities
   Zero Dependencies | High-Definition Vector Charts
   ========================================================================== */

const ChartUtils = {
  // Render Donut Chart for Attendance Percentages
  renderDonutChart(containerId, percentage, label, color = '#4F46E5') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    container.innerHTML = `
      <div style="position: relative; width: 140px; height: 140px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
        <svg width="140" height="140" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="${radius}" fill="none" stroke="#E2E8F0" stroke-width="10"/>
          <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${color}" stroke-width="10"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
                  stroke-linecap="round" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 1s ease;"/>
        </svg>
        <div style="position: absolute; text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); line-height: 1;">${percentage}%</span>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${label}</p>
        </div>
      </div>
    `;
  },

  // Render Horizontal Bar Chart for Development 4 Aspects
  renderDevelopmentBars(containerId, scores) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const aspects = [
      { name: '1. ด้านร่างกาย (Physical)', score: scores.physical || 4, color: '#10B981' },
      { name: '2. ด้านอารมณ์-จิตใจ (Emotional)', score: scores.emotional || 4, color: '#3B82F6' },
      { name: '3. ด้านสังคม (Social)', score: scores.social || 3, color: '#8B5CF6' },
      { name: '4. ด้านสติปัญญา (Intellectual)', score: scores.intellectual || 4, color: '#F59E0B' }
    ];

    const scoreLabels = { 4: 'ดีเยี่ยม (4.0)', 3: 'ดี (3.0)', 2: 'ผ่านเกณฑ์ (2.0)', 1: 'ควรส่งเสริม (1.0)' };

    let html = '<div style="display: flex; flex-direction: column; gap: 1rem;">';
    aspects.forEach(a => {
      const pct = (a.score / 4) * 100;
      html += `
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
            <span style="font-weight: 600; color: var(--text-main);">${a.name}</span>
            <span style="font-weight: 600; color: ${a.color};">${scoreLabels[a.score]}</span>
          </div>
          <div style="width: 100%; height: 10px; background: var(--border-color); border-radius: 999px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: ${a.color}; border-radius: 999px; transition: width 0.8s ease;"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  },

  // Render Attendance Comparison Trend Bar Chart
  renderAttendanceTrend(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const days = [
      { day: 'จ.', rate: 96, present: 48, leave: 2 },
      { day: 'อ.', rate: 94, present: 47, leave: 3 },
      { day: 'พ.', rate: 98, present: 49, leave: 1 },
      { day: 'พฤ.', rate: 92, present: 46, leave: 4 },
      { day: 'ศ.', rate: 95, present: 47, leave: 3 }
    ];

    let html = '<div style="display: flex; align-items: flex-end; justify-content: space-between; height: 160px; padding-top: 1.5rem; gap: 0.75rem;">';
    days.forEach(d => {
      const heightPx = (d.rate / 100) * 120;
      html += `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; height: 100%; justify-content: flex-end;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-600);">${d.rate}%</span>
          <div style="width: 100%; max-width: 36px; height: ${heightPx}px; background: linear-gradient(180deg, var(--primary-500), var(--primary-700)); border-radius: 6px 6px 0 0; transition: height 0.6s ease;"></div>
          <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">${d.day}</span>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }
};

window.ChartUtils = ChartUtils;
