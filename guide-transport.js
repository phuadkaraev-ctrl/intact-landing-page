(function () {
  const config = window.INTACT_CONFIG || {};
  const base = new URL('.', document.baseURI);
  let origin = '';
  try {
    const value = new URL(config.guideApiOrigin);
    if (value.protocol === 'https:' && value.href === value.origin + '/') origin = value.origin;
  } catch { /* The public preview remains available before backend configuration. */ }
  const storageKey = 'intact-guide:' + origin + ':' + base.pathname;
  let token = '';
  try { const saved = sessionStorage.getItem(storageKey) || ''; token = /^[0-9a-f]{64}$/.test(saved) ? saved : ''; } catch {}
  const pages = new Map();
  let pdfURL = null;
  function clearAssets() {
    pages.forEach(promise => promise.then(url => URL.revokeObjectURL(url)).catch(() => {}));
    pages.clear();
    if (pdfURL) URL.revokeObjectURL(pdfURL);
    pdfURL = null;
  }
  function setToken(value) {
    if (value !== token) clearAssets();
    token = /^[0-9a-f]{64}$/.test(value) ? value : '';
    try { token ? sessionStorage.setItem(storageKey, token) : sessionStorage.removeItem(storageKey); } catch {}
  }
  async function api(path, init = {}) {
    if (!origin) return Response.json({ error: 'The guide backend needs to be connected before the full guide can be unlocked.' }, { status: 503 });
    if (!path.startsWith('/api/guide/')) throw new Error('Unexpected guide path');
    const headers = new Headers(init.headers);
    if (token) headers.set('Authorization', 'Bearer ' + token);
    const response = await fetch(origin + path, { ...init, headers, credentials: 'omit', mode: 'cors', cache: 'no-store' });
    if (path === '/api/guide/unlock' && response.ok) {
      const data = await response.clone().json();
      if (data.unlocked && data.accessToken) setToken(data.accessToken);
    }
    if (path === '/api/guide/access' && response.ok && !(await response.clone().json()).unlocked) setToken('');
    if (response.status === 401) setToken('');
    return response;
  }
  async function protectedBlob(path) {
    const response = await api(path);
    if (!response.ok) throw new Error('Guide access is unavailable');
    return URL.createObjectURL(await response.blob());
  }
  async function pageSrc(page) {
    if (page <= 3) return new URL('assets/guide-pages/page-' + String(page).padStart(2, '0') + '.webp', base).href;
    if (!pages.has(page)) pages.set(page, protectedBlob('/api/guide/pages/' + page).catch(error => { pages.delete(page); throw error; }));
    return pages.get(page);
  }
  async function openPDF() {
    if (!pdfURL) pdfURL = await protectedBlob('/api/guide/pdf?download=1');
    const link = document.createElement('a');
    link.href = pdfURL;
    link.download = 'The-Real-Cost-of-Building-It-Yourself.pdf';
    document.body.append(link);
    link.click();
    link.remove();
  }
  window.IntactGuideTransport = { fetch: api, pageSrc, openPDF };
  window.addEventListener('pagehide', clearAssets);
})();
