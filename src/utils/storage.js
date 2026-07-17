const PREFIX = 'jadwalPiket_';

// Schedule key: jadwalPiket_schedule_2026-07
export function getSchedule(yearMonth) {
  const data = localStorage.getItem(PREFIX + 'schedule_' + yearMonth);
  return data ? JSON.parse(data) : {};
}

export function setSchedule(yearMonth, data) {
  localStorage.setItem(PREFIX + 'schedule_' + yearMonth, JSON.stringify(data));
}

// Red dates key: jadwalPiket_redDates_2026-07
export function getRedDates(yearMonth) {
  const data = localStorage.getItem(PREFIX + 'redDates_' + yearMonth);
  return data ? JSON.parse(data) : [];
}

export function setRedDates(yearMonth, list) {
  localStorage.setItem(PREFIX + 'redDates_' + yearMonth, JSON.stringify(list));
}
