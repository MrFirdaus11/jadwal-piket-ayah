import html2canvas from 'html2canvas';

export async function exportToImage(elementRef, filename) {
  if (!elementRef) return;
  
  const canvas = await html2canvas(elementRef, {
    scale: 2, // high resolution
    useCORS: true,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    windowWidth: elementRef.scrollWidth,
    windowHeight: elementRef.scrollHeight,
  });
  
  const link = document.createElement('a');
  link.download = filename + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
