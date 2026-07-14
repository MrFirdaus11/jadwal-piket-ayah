const PREFIX = 'jadwalPiket_';

export function getEmployees() {
  const data = localStorage.getItem(PREFIX + 'employees');
  return data ? JSON.parse(data) : [];
}

export function setEmployees(list) {
  localStorage.setItem(PREFIX + 'employees', JSON.stringify(list));
}

export function getDutyCodes() {
  const data = localStorage.getItem(PREFIX + 'dutyCodes');
  return data ? JSON.parse(data) : ['P1', 'P2', 'P3', 'P4', 'S1', 'S2', 'S3', 'S4', 'B1', 'B2', 'B3', 'B4', 'OFF', 'C', 'L'];
}

export function setDutyCodes(list) {
  localStorage.setItem(PREFIX + 'dutyCodes', JSON.stringify(list));
}

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
