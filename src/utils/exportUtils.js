import html2canvas from 'html2canvas';

export async function exportToImage(scrollEl, filename) {
  if (!scrollEl) return;

  const tableEl = scrollEl.querySelector('table');
  if (!tableEl) return;

  // ── 1. Clone tabel & taruh di luar layar ──────────────────────────────────
  const clone = tableEl.cloneNode(true);

  // Hapus sticky + tampilkan kolom yang disembunyikan media query HP
  clone.querySelectorAll('.sticky-col').forEach(el => {
    el.style.position = 'static';
    el.style.left     = 'auto';
    el.style.zIndex   = 'auto';
    el.style.boxShadow = 'none';
  });
  clone.querySelectorAll('.sticky-col-nik, .sticky-col-jabatan').forEach(el => {
    el.style.display = 'table-cell';
  });

  // Wrapper off-screen: posisi absolute agar tidak ikut scroll
  const offscreen = document.createElement('div');
  offscreen.style.cssText = [
    'position:absolute',
    'top:0',
    'left:-99999px',
    'width:max-content',
    'background:#ffffff',
    'z-index:-9999',
    'pointer-events:none',
    'opacity:1',
  ].join(';');
  offscreen.appendChild(clone);
  document.body.appendChild(offscreen);

  // Tunggu browser selesai layout
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const fullWidth  = clone.scrollWidth;
  const fullHeight = clone.scrollHeight;

  try {
    // windowWidth 3000 → paksa html2canvas pakai desktop CSS (bypass media query HP)
    const canvas = await html2canvas(offscreen, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width:        fullWidth,
      height:       fullHeight,
      windowWidth:  3000,
      windowHeight: fullHeight,
      logging: false,
    });

    const link    = document.createElement('a');
    link.download = filename + '.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  } finally {
    document.body.removeChild(offscreen);
  }
}
