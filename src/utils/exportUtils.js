import html2canvas from 'html2canvas';

export async function exportToImage(scrollEl, filename) {
  if (!scrollEl) return;

  const tableEl = scrollEl.querySelector('table');
  if (!tableEl) return;

  // ── 1. Kumpulkan semua elemen yang perlu diubah sementara ──────────────────

  // Semua elemen dengan position sticky
  const stickyEls = tableEl.querySelectorAll('.sticky-col');
  // Semua elemen yang disembunyikan oleh media query HP
  const hiddenEls = tableEl.querySelectorAll('.sticky-col-nik, .sticky-col-jabatan');

  // Simpan style asli
  const origScrollOverflow  = scrollEl.style.overflow;
  const origScrollWidth     = scrollEl.style.width;
  const origScrollMaxWidth  = scrollEl.style.maxWidth;
  const origScrollMinWidth  = scrollEl.style.minWidth;

  const stickyOrigPos = [];
  stickyEls.forEach(el => {
    stickyOrigPos.push({ el, position: el.style.position });
    el.style.position = 'static';
  });

  const hiddenOrigDisplay = [];
  hiddenEls.forEach(el => {
    hiddenOrigDisplay.push({ el, display: el.style.display });
    el.style.display = 'table-cell';
  });

  // ── 2. Buka semua constraint overflow pada scroll wrapper ───────────────────
  scrollEl.style.overflow  = 'visible';
  scrollEl.style.width     = 'max-content';
  scrollEl.style.maxWidth  = 'none';
  scrollEl.style.minWidth  = 'none';

  // Tunggu browser selesai re-layout
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const fullWidth  = tableEl.offsetWidth;
  const fullHeight = tableEl.offsetHeight;

  try {
    const canvas = await html2canvas(tableEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width:        fullWidth,
      height:       fullHeight,
      windowWidth:  fullWidth,
      windowHeight: fullHeight,
    });

    const link    = document.createElement('a');
    link.download = filename + '.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  } finally {
    // ── 3. Kembalikan semua style ke aslinya ───────────────────────────────
    scrollEl.style.overflow  = origScrollOverflow;
    scrollEl.style.width     = origScrollWidth;
    scrollEl.style.maxWidth  = origScrollMaxWidth;
    scrollEl.style.minWidth  = origScrollMinWidth;

    stickyOrigPos.forEach(({ el, position }) => {
      el.style.position = position;
    });

    hiddenOrigDisplay.forEach(({ el, display }) => {
      el.style.display = display;
    });
  }
}
