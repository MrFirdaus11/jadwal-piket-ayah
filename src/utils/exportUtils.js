import html2canvas from 'html2canvas';

export async function exportToImage(scrollEl, filename) {
  if (!scrollEl) return;
  const tableEl = scrollEl.querySelector('table');
  if (!tableEl) return;

  // ── 1. Clone tabel ─────────────────────────────────────────────────────────
  const clone = tableEl.cloneNode(true);

  // Lepas sticky positioning (ganggu kalkulasi lebar)
  clone.querySelectorAll('.sticky-col').forEach(el => {
    el.style.setProperty('position',   'static',     'important');
    el.style.setProperty('left',       'auto',        'important');
    el.style.setProperty('z-index',    'auto',        'important');
    el.style.setProperty('box-shadow', 'none',        'important');
  });

  // Tampilkan kolom NIK & Jabatan yang disembunyikan di HP
  clone.querySelectorAll('.sticky-col-nik, .sticky-col-jabatan').forEach(el => {
    el.style.setProperty('display', 'table-cell', 'important');
  });

  // ── 2. Wrapper di pojok kiri-atas (tidak terlihat) ────────────────────────
  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'opacity:0',
    'pointer-events:none',
    'background:#ffffff',
    'z-index:-1',
    'display:inline-block',
    'width:max-content',
    'height:max-content',
  ].join(';');
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Tunggu layout browser selesai (3 frame untuk memastikan)
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r))));

  try {
    const canvas = await html2canvas(clone, {
      scale:        2,
      useCORS:      true,
      allowTaint:   true,
      backgroundColor: '#ffffff',
      logging:      false,
      scrollX:      0,
      scrollY:      0,
      x:            0,
      y:            0,
      width:        clone.scrollWidth,
      height:       clone.scrollHeight,
    });

    const link    = document.createElement('a');
    link.download = filename + '.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  } finally {
    // Selalu hapus clone dari DOM
    document.body.removeChild(wrapper);
  }
}
