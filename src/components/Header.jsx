import { BULAN } from '../utils/dateUtils';
import './Header.css';

const YEARS = [];
for (let y = 2024; y <= 2030; y++) YEARS.push(y);

export default function Header({ month, year, onMonthChange, onYearChange }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Jadwal Piket</h1>
        <p className="header-subtitle">Aplikasi jadwal piket bulanan</p>
      </div>
      <div className="header-right">
        <select
          className="header-select"
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
        >
          {BULAN.map((name, i) => (
            <option key={i + 1} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          className="header-select"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </header>
  );
}
