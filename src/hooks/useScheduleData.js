import { useState, useEffect, useCallback } from 'react';
import { getSchedule, setSchedule, getRedDates, setRedDates } from '../utils/storage';
import { getYearMonth } from '../utils/dateUtils';

export function useScheduleData(year, month) {
  const yearMonth = getYearMonth(year, month);
  
  const [schedule, setScheduleState] = useState({});
  const [redDates, setRedDatesState] = useState([]);

  // Load from storage when month/year changes
  useEffect(() => {
    setScheduleState(getSchedule(yearMonth));
    setRedDatesState(getRedDates(yearMonth));
  }, [yearMonth]);

  // Fetch holidays from API
  useEffect(() => {
    let cancelled = false;
    async function fetchHolidays() {
      try {
        const res = await fetch(`https://dayoffapi.vercel.app/api?year=${year}&month=${month}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          const dates = data.map(item => item.tanggal);
          
          // On first load for this month, seed red dates from API
          const stored = getRedDates(yearMonth);
          if (stored.length === 0 && dates.length > 0) {
            setRedDatesState(dates);
            setRedDates(yearMonth, dates);
          }
        }
      } catch (err) {
        console.warn('Gagal mengambil data tanggal merah:', err);
        // Fallback: just use stored data
      }
    }
    fetchHolidays();
    return () => { cancelled = true; };
  }, [year, month, yearMonth]);

  const setCellValue = useCallback((nik, dateStr, code) => {
    setScheduleState(prev => {
      const key = `${nik}_${dateStr}`;
      const next = { ...prev };
      if (code) {
        next[key] = code;
      } else {
        delete next[key];
      }
      setSchedule(yearMonth, next);
      return next;
    });
  }, [yearMonth]);

  const getCellValue = useCallback((nik, dateStr) => {
    const key = `${nik}_${dateStr}`;
    return schedule[key] || '';
  }, [schedule]);

  const toggleRedDate = useCallback((dateStr) => {
    setRedDatesState(prev => {
      let next;
      if (prev.includes(dateStr)) {
        next = prev.filter(d => d !== dateStr);
      } else {
        next = [...prev, dateStr];
      }
      setRedDates(yearMonth, next);
      return next;
    });
  }, [yearMonth]);

  const isRedDate = useCallback((dateStr) => {
    return redDates.includes(dateStr);
  }, [redDates]);

  return {
    schedule,
    redDates,
    setCellValue,
    getCellValue,
    toggleRedDate,
    isRedDate,
  };
}
