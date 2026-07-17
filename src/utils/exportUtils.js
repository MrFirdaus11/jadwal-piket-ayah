import html2canvas from 'html2canvas';

export async function exportToImage(scrollEl, filename) {
  if (!scrollEl) return;

  // scrollEl adalah div.schedule-scroll yang punya overflow-x:auto
  // Kita perlu capture tabel di dalamnya secara penuh
  const tableEl = scrollEl.querySelector('table') || scrollEl;

  // Simpan style asli
  const prevOverflow = scrollEl.style.overflow;
  const prevWidth    = scrollEl.style.width;
  const prevMaxWidth = scrollEl.style.maxWidth;

  // Hapus batasan overflow agar html2canvas bisa mengukur lebar penuh
  scrollEl.style.overflow  = 'visible';
  scrollEl.style.width     = tableEl.scrollWidth + 'px';
  scrollEl.style.maxWidth  = 'none';

  try {
    const canvas = await html2canvas(scrollEl, {
      scale: 2,                              // resolusi tinggi
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,             // kompensasi posisi scroll halaman
      width:  tableEl.scrollWidth,          // lebar penuh tabel
      height: scrollEl.scrollHeight,
      windowWidth:  tableEl.scrollWidth,
      windowHeight: scrollEl.scrollHeight,
    });

    const link      = document.createElement('a');
    link.download   = filename + '.png';
    link.href       = canvas.toDataURL('image/png');
    link.click();
  } finally {
    // Kembalikan style asli
    scrollEl.style.overflow  = prevOverflow;
    scrollEl.style.width     = prevWidth;
    scrollEl.style.maxWidth  = prevMaxWidth;
  }
}
