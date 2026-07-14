import { useState } from 'react';
import './DutyCodeManager.css';

export default function DutyCodeManager({ isOpen, onClose, codes, onSave }) {
  const [newCode, setNewCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    const code = newCode.trim().toUpperCase();
    if (!code) {
      setError('Kode tidak boleh kosong');
      return;
    }
    if (codes.includes(code)) {
      setError('Kode sudah ada');
      return;
    }
    onSave([...codes, code]);
    setNewCode('');
    setError('');
  };

  const handleDelete = (code) => {
    onSave(codes.filter(c => c !== code));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Kelola Kode Piket</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="code-form" onSubmit={handleAdd}>
          <div className="code-input-group">
            <input
              type="text"
              value={newCode}
              onChange={e => { setNewCode(e.target.value); setError(''); }}
              placeholder="Ketik kode baru, misal: P3"
              maxLength={10}
            />
            <button type="submit" className="btn btn-primary">Tambah</button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>
        <div className="code-list">
          {codes.map(code => (
            <div key={code} className="code-item">
              <span className="code-badge">{code}</span>
              <button className="btn-sm btn-delete" onClick={() => handleDelete(code)}>Hapus</button>
            </div>
          ))}
          {codes.length === 0 && (
            <p className="code-empty">Belum ada kode piket.</p>
          )}
        </div>
      </div>
    </div>
  );
}
