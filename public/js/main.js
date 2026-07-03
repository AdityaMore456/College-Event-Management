// Shared client-side helpers for CEMS EJS pages.
// Each page progressively enhances itself by checking which elements exist.

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ---- Login ----
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(loginForm));
    try {
      await api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
      window.location.href = '/events';
    } catch (err) {
      alert(err.message);
    }
  });
}

// ---- Register ----
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(registerForm));
    try {
      await api('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });
      window.location.href = '/events';
    } catch (err) {
      alert(err.message);
    }
  });
}

// ---- Event registration ----
const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const eventId = registerBtn.dataset.eventId;
    const resultEl = document.getElementById('qr-result');
    try {
      const data = await api(`/api/events/${eventId}/register`, { method: 'POST' });
      resultEl.innerHTML = `
        <div class="card"><div class="card-body text-center">
          <p><strong>You're registered!</strong> Show this QR code at check-in.</p>
          <img src="${data.qrImage}" alt="QR Code" style="width:200px;" />
        </div></div>`;
    } catch (err) {
      resultEl.innerHTML = `<p style="color: var(--color-danger);">${err.message}</p>`;
    }
  });
}

// ---- Organizer: create/edit event ----
const eventForm = document.getElementById('event-form');
if (eventForm) {
  eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const eventId = eventForm.dataset.eventId;
    const body = Object.fromEntries(new FormData(eventForm));
    try {
      const url = eventId ? `/api/events/${eventId}` : '/api/events';
      const method = eventId ? 'PUT' : 'POST';
      await api(url, { method, body: JSON.stringify(body) });
      window.location.href = '/organizer/dashboard';
    } catch (err) {
      alert(err.message);
    }
  });
}

// ---- Organizer: generate certificates ----
const generateCertsBtn = document.getElementById('generate-certs-btn');
if (generateCertsBtn) {
  generateCertsBtn.addEventListener('click', async () => {
    const eventId = generateCertsBtn.dataset.eventId;
    try {
      const data = await api(`/api/certificates/events/${eventId}/generate`, { method: 'POST' });
      alert(`Generated ${data.count} certificate(s).`);
    } catch (err) {
      alert(err.message);
    }
  });
}

// ---- Manual check-in fallback ----
const manualBtn = document.getElementById('manual-checkin-btn');
if (manualBtn) {
  manualBtn.addEventListener('click', async () => {
    const registrationId = document.getElementById('manual-registration-id').value.trim();
    if (!registrationId) return;
    try {
      await api('/api/attendance/manual', { method: 'POST', body: JSON.stringify({ registrationId }) });
      alert('Attendance marked manually.');
    } catch (err) {
      alert(err.message);
    }
  });
}
