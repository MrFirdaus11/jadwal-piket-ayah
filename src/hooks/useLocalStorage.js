import { useState, useCallback } from 'react';

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    setValue((prev) => {
      const val = typeof newValue === 'function' ? newValue(prev) : newValue;
      localStorage.setItem(key, JSON.stringify(val));
      return val;
    });
  }, [key]);

  return [value, setStoredValue];
}
