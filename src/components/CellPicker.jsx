import { useEffect, useRef } from 'react';
import './CellPicker.css';

export default function CellPicker({ codes, currentValue, position, onSelect, onClose }) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onCloseRef.current();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Adjust position to keep popup visible
  const style = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    zIndex: 2000,
  };

  return (
    <div className="cell-picker" style={style} ref={ref}>
      <div className="cell-picker-grid">
        {codes.map(code => (
          <button
            key={code}
            className={`cell-picker-btn ${currentValue === code ? 'active' : ''}`}
            onClick={() => onSelect(code)}
          >
            {code}
          </button>
        ))}
      </div>
      {currentValue && (
        <button className="cell-picker-clear" onClick={() => onSelect('')}>
          ✕ Kosongkan
        </button>
      )}
    </div>
  );
}
