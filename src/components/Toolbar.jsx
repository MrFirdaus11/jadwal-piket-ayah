import './Toolbar.css';

export default function Toolbar({ onManageEmployees, onManageCodes, onExport }) {
  return (
    <div className="toolbar">
      <div className="toolbar-actions">
        <div className="toolbar-left">
          <button className="toolbar-btn toolbar-btn-outline" onClick={onManageEmployees}>
            <span className="toolbar-btn-icon">+</span> Kelola pegawai
          </button>
          <button className="toolbar-btn toolbar-btn-outline" onClick={onManageCodes}>
            <span className="toolbar-btn-icon">⚙</span> Kelola kode piket
          </button>
        </div>
        <div className="toolbar-right">
          <button className="toolbar-btn toolbar-btn-export" onClick={onExport}>
            <span className="toolbar-btn-icon">📸</span> Export
          </button>
        </div>
      </div>
      <div className="toolbar-legend">
        <span className="legend-item">
          <span className="legend-dot legend-dot-red"></span>
          Tanggal merah (klik header untuk ubah)
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot-green"></span>
          Hari Jumat
        </span>
      </div>
    </div>
  );
}
