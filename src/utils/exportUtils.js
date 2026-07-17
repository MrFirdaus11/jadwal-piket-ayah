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

  // ── 2. Wrapper di pojok kiri-atas layar (koordinat 0,0) ────────────────────
  // opacity 0.001 = tidak terlihat tapi tetap di-render browser untuk layout
  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'opacity:0.001',
    'pointer-events:none',
    'overflow:visible',
    'background:#ffffff',
    'z-index:-1',
    'white-space:nowrap',
  ].join(';');
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Tunggu dua frame agar browser selesai menghitung layout
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  // Ukur lebar & tinggi PENUH tabel setelah layout selesai
  const W = clone.scrollWidth;
  const H = clone.scrollHeight;

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
      width:        W,
      height:       H,
      // windowWidth lebih besar dari tabel → bypass semua @media (max-width: ...)
      windowWidth:  W + 500,
      windowHeight: H,
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
