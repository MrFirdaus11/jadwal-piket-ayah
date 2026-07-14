import { useState } from 'react';
import './EmployeeManager.css';

const EMPTY_FORM = { nik: '', nama: '', jabatan: '', danru: '' };

export default function EmployeeManager({ isOpen, onClose, employees, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editIndex, setEditIndex] = useState(-1);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nik.trim() || !form.nama.trim() || !form.jabatan.trim()) {
      setError('NIK, Nama, dan Jabatan wajib diisi');
      return;
    }
    // Check NIK unique
    const duplicate = employees.findIndex((emp, i) => emp.nik === form.nik.trim() && i !== editIndex);
    if (duplicate !== -1) {
      setError('NIK sudah dipakai pegawai lain');
      return;
    }
    const trimmed = {
      nik: form.nik.trim(),
      nama: form.nama.trim().toUpperCase(),
      jabatan: form.jabatan.trim().toUpperCase(),
      danru: form.danru.trim().toUpperCase(),
    };
    let updated;
    if (editIndex >= 0) {
      updated = [...employees];
      updated[editIndex] = trimmed;
    } else {
      updated = [...employees, trimmed];
    }
    onSave(updated);
    setForm(EMPTY_FORM);
    setEditIndex(-1);
    setError('');
  };

  const handleEdit = (index) => {
    setForm({ ...employees[index] });
    setEditIndex(index);
    setError('');
  };

  const handleDelete = (index) => {
    const updated = employees.filter((_, i) => i !== index);
    onSave(updated);
    if (editIndex === index) {
      setForm(EMPTY_FORM);
      setEditIndex(-1);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditIndex(-1);
    setError('');
  };

  const moveEmployee = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= employees.length) return;
    const updated = [...employees];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onSave(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Kelola Pegawai</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="emp-form" onSubmit={handleSubmit}>
          <div className="emp-form-grid">
            <div className="form-group">
              <label>NIK</label>
              <input
                type="text"
                value={form.nik}
                onChange={e => handleChange('nik', e.target.value)}
                placeholder="Contoh: 1505902"
              />
            </div>
            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                value={form.nama}
                onChange={e => handleChange('nama', e.target.value)}
                placeholder="Contoh: SUTRISNO"
              />
            </div>
            <div className="form-group">
              <label>Jabatan</label>
              <input
                type="text"
                value={form.jabatan}
                onChange={e => handleChange('jabatan', e.target.value)}
                placeholder="Contoh: SATPAM"
              />
            </div>
            <div className="form-group">
              <label>Danru <span className="label-optional">(opsional)</span></label>
              <input
                type="text"
                value={form.danru}
                onChange={e => handleChange('danru', e.target.value)}
                placeholder="Contoh: DANRU"
              />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="emp-form-actions">
            <button type="submit" className="btn btn-primary">
              {editIndex >= 0 ? 'Simpan Perubahan' : 'Tambah Pegawai'}
            </button>
            {editIndex >= 0 && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Batal Edit
              </button>
            )}
          </div>
        </form>
        {employees.length > 0 && (
          <div className="emp-table-wrap">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>NIK</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Danru</th>
                  <th>Urut</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={emp.nik + i}>
                    <td>{i + 1}</td>
                    <td>{emp.nik}</td>
                    <td><strong>{emp.nama}</strong></td>
                    <td>{emp.jabatan}</td>
                    <td>{emp.danru || '-'}</td>
                    <td className="emp-order-btns">
                      <button
                        className="btn-icon"
                        onClick={() => moveEmployee(i, -1)}
                        disabled={i === 0}
                        title="Naik"
                      >↑</button>
                      <button
                        className="btn-icon"
                        onClick={() => moveEmployee(i, 1)}
                        disabled={i === employees.length - 1}
                        title="Turun"
                      >↓</button>
                    </td>
                    <td className="emp-action-btns">
                      <button className="btn-sm btn-edit" onClick={() => handleEdit(i)}>Edit</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(i)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {employees.length === 0 && (
          <p className="emp-empty">Belum ada pegawai. Tambahkan pegawai di form di atas.</p>
        )}
      </div>
    </div>
  );
}
