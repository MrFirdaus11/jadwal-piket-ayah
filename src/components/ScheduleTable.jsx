import { useState, forwardRef } from 'react';
import { generateMonthDays, formatDateKey } from '../utils/dateUtils';
import CellPicker from './CellPicker';
import './ScheduleTable.css';

const ScheduleTable = forwardRef(function ScheduleTable(
  { year, month, employees, dutyCodes, schedule, redDates, onCellChange, onToggleRedDate, getCellValue, isRedDate },
  ref
) {
  const days = generateMonthDays(year, month);
  const [picker, setPicker] = useState(null);

  const handleCellClick = (nik, day, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Position picker below and to the right of the cell
    let top = rect.bottom + 4;
    let left = rect.left;
    // Adjust if too close to right edge
    if (left + 180 > window.innerWidth) {
      left = window.innerWidth - 190;
    }
    // Adjust if too close to bottom
    if (top + 200 > window.innerHeight) {
      top = rect.top - 200;
    }
    setPicker({
      nik,
      dateStr: formatDateKey(year, month, day.date),
      position: { top, left },
    });
  };

  const handlePickerSelect = (code) => {
    if (picker) {
      onCellChange(picker.nik, picker.dateStr, code);
      setPicker(null);
    }
  };

  const getColumnClass = (day) => {
    const dateStr = formatDateKey(year, month, day.date);
    const classes = ['schedule-col'];
    if (isRedDate(dateStr) || day.isSunday) {
      classes.push('col-red');
    } else if (day.isFriday) {
      classes.push('col-friday');
    } else if (day.isSaturday) {
      classes.push('col-saturday');
    }
    return classes.join(' ');
  };

  const getHeaderClass = (day) => {
    const dateStr = formatDateKey(year, month, day.date);
    const classes = ['schedule-date-header'];
    if (isRedDate(dateStr) || day.isSunday) {
      classes.push('header-red');
    } else if (day.isFriday) {
      classes.push('header-friday');
    }
    return classes.join(' ');
  };

  return (
    <div className="schedule-wrapper">
      <div className="schedule-scroll" ref={ref}>
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="sticky-col sticky-col-no">No</th>
              <th className="sticky-col sticky-col-nik">NIK</th>
              <th className="sticky-col sticky-col-nama">Nama</th>
              <th className="sticky-col sticky-col-jabatan">Jabatan</th>
              {days.map(day => {
                const dateStr = formatDateKey(year, month, day.date);
                return (
                  <th
                    key={day.date}
                    className={getHeaderClass(day)}
                    onClick={() => onToggleRedDate(dateStr)}
                    title="Klik untuk tandai/batal tanggal merah"
                  >
                    <div className="date-num">{day.date}</div>
                    <div className="date-day">{day.dayName}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.nik}>
                <td className="sticky-col sticky-col-no">{index + 1}</td>
                <td className="sticky-col sticky-col-nik">{emp.nik}</td>
                <td className="sticky-col sticky-col-nama"><strong>{emp.nama}</strong></td>
                <td className="sticky-col sticky-col-jabatan">{emp.danru || emp.jabatan}</td>
                {days.map(day => {
                  const dateStr = formatDateKey(year, month, day.date);
                  const value = getCellValue(emp.nik, dateStr);
                  return (
                    <td
                      key={day.date}
                      className={`schedule-cell ${getColumnClass(day)}${value === 'C' ? ' cell-cuti' : ''}`}
                      onClick={(e) => handleCellClick(emp.nik, day, e)}
                      title={`${emp.nama} — ${day.date} ${day.dayName}`}
                    >
                      {value || <span className="cell-dot">·</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={4 + days.length} className="schedule-empty">
                  Belum ada pegawai. Klik "Kelola pegawai" untuk menambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="schedule-hint">
        Tanggal & nama hari otomatis mengikuti bulan/tahun yang dipilih. Klik sel untuk isi kode, klik header tanggal untuk tandai tanggal merah.
      </p>
      {picker && (
        <CellPicker
          codes={dutyCodes}
          currentValue={getCellValue(picker.nik, picker.dateStr)}
          position={picker.position}
          onSelect={handlePickerSelect}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
});

export default ScheduleTable;
