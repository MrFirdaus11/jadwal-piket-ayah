const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function getDaysInMonth(year, month) {
  // month is 1-based (1=Jan, 12=Dec)
  return new Date(year, month, 0).getDate();
}

export function getDayName(year, month, date) {
  // month is 1-based
  const d = new Date(year, month - 1, date);
  return HARI[d.getDay()];
}

export function getDayIndex(year, month, date) {
  return new Date(year, month - 1, date).getDay(); // 0=Sun, 5=Fri, 6=Sat
}

export function isSunday(year, month, date) {
  return getDayIndex(year, month, date) === 0;
}

export function isFriday(year, month, date) {
  return getDayIndex(year, month, date) === 5;
}

export function isSaturday(year, month, date) {
  return getDayIndex(year, month, date) === 6;
}

export function generateMonthDays(year, month) {
  const count = getDaysInMonth(year, month);
  const days = [];
  for (let d = 1; d <= count; d++) {
    const dayIndex = getDayIndex(year, month, d);
    days.push({
      date: d,
      dayName: HARI[dayIndex],
      isSunday: dayIndex === 0,
      isFriday: dayIndex === 5,
      isSaturday: dayIndex === 6,
    });
  }
  return days;
}

export function getMonthName(month) {
  return BULAN[month - 1];
}

export function formatDateKey(year, month, date) {
  const mm = String(month).padStart(2, '0');
  const dd = String(date).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function getYearMonth(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export { BULAN };
