// Camera-based QR scanner for the organizer check-in page.
// Requires the html5-qrcode library (loaded via CDN in scanner.ejs).

document.addEventListener('DOMContentLoaded', () => {
  const scriptTag = document.querySelector('script[src="/js/scanner.js"]');
  const resultEl = document.getElementById('scan-result');

  if (typeof Html5Qrcode === 'undefined') {
    console.warn('html5-qrcode not loaded yet.');
    return;
  }

  const scanner = new Html5Qrcode('qr-reader');

  function showResult(message, isError) {
    resultEl.style.display = 'block';
    resultEl.className = `scan-result ${isError ? 'error' : 'success'}`;
    resultEl.textContent = message;
  }

  async function onScanSuccess(decodedText) {
    try {
      const res = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ qrCode: decodedText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Scan failed');
      showResult(`✔ Checked in: ${data.student?.name || 'Student'}`, false);
    } catch (err) {
      showResult(`✖ ${err.message}`, true);
    }
  }

  scanner
    .start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, onScanSuccess)
    .catch((err) => console.error('Unable to start scanner:', err));
});
