const transport = window.IntactGuideTransport;
const form = document.querySelector('#guide-access-form');
const submit = document.querySelector('#guide-submit');
const error = document.querySelector('#guide-form-error');
let busy = false;
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !form.reportValidity()) return;
  busy = true;
  submit.disabled = true;
  submit.querySelector('span').textContent = 'Unlocking…';
  error.hidden = true;
  form.setAttribute('aria-busy', 'true');
  try {
    const response = await transport.fetch('/api/guide/unlock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const data = await response.json();
    if (!response.ok || !data.unlocked) {
      error.textContent = data.error || 'We couldn’t unlock the guide. Please try again.';
      error.hidden = false;
      if (data.field) form.elements.namedItem(data.field)?.focus();
      return;
    }
    form.reset();
    error.textContent = 'The full guide is unlocked. Download your PDF below.';
    error.hidden = false;
    error.style.color = '#3b7345';
    const download = document.createElement('button');
    download.className = 'button primary';
    download.type = 'button';
    download.textContent = 'Download the full guide ↓';
    download.addEventListener('click', () => transport.openPDF().catch(() => { error.style.color = ''; error.textContent = 'The PDF could not download. Please try again.'; }));
    submit.replaceWith(download);
    await transport.openPDF();
  } catch {
    error.style.color = '';
    error.textContent = 'We couldn’t complete your request. Please check your connection and try again.';
    error.hidden = false;
  } finally {
    busy = false;
    submit.disabled = false;
    submit.querySelector('span').textContent = 'Unlock the full guide';
    form.removeAttribute('aria-busy');
  }
});
