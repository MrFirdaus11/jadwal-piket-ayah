import { useState, useRef, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useScheduleData } from './hooks/useScheduleData';
import { getMonthName } from './utils/dateUtils';
import { exportToImage } from './utils/exportUtils';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import EmployeeManager from './components/EmployeeManager';
import DutyCodeManager from './components/DutyCodeManager';
import ScheduleTable from './components/ScheduleTable';
import './App.css';

const DEFAULT_CODES = ['P1', 'P2', 'P3', 'P4', 'S1', 'S2', 'S3', 'S4', 'B1', 'B2', 'B3', 'B4', 'OFF', 'C', 'L'];

function App() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [employees, setEmployees] = useLocalStorage('jadwalPiket_employees', []);
  const [dutyCodes, setDutyCodes] = useLocalStorage('jadwalPiket_dutyCodes', DEFAULT_CODES);

  const [showEmployeeManager, setShowEmployeeManager] = useState(false);
  const [showCodeManager, setShowCodeManager] = useState(false);

  const scheduleData = useScheduleData(year, month);
  const tableRef = useRef(null);

  const handleExport = useCallback(async () => {
    if (!tableRef.current) return;
    const filename = `Jadwal_Piket_${getMonthName(month)}_${year}`;
    await exportToImage(tableRef.current, filename);
  }, [month, year]);

  return (
    <div className="app">
      <Header
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      <div className="app-main">
        <Toolbar
          onManageEmployees={() => setShowEmployeeManager(true)}
          onManageCodes={() => setShowCodeManager(true)}
          onExport={handleExport}
        />

        <ScheduleTable
          ref={tableRef}
          year={year}
          month={month}
          employees={employees}
          dutyCodes={dutyCodes}
          schedule={scheduleData.schedule}
          redDates={scheduleData.redDates}
          onCellChange={scheduleData.setCellValue}
          onToggleRedDate={scheduleData.toggleRedDate}
          getCellValue={scheduleData.getCellValue}
          isRedDate={scheduleData.isRedDate}
        />
      </div>

      <EmployeeManager
        isOpen={showEmployeeManager}
        onClose={() => setShowEmployeeManager(false)}
        employees={employees}
        onSave={setEmployees}
      />

      <DutyCodeManager
        isOpen={showCodeManager}
        onClose={() => setShowCodeManager(false)}
        codes={dutyCodes}
        onSave={setDutyCodes}
      />
    </div>
  );
}

export default App;
