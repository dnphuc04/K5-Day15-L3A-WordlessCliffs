/* Kho yêu cầu dùng chung giữa trang khách và trang lễ tân.
   - Mở bằng serve.py (http://…): lưu trên máy chủ demo, điện thoại và máy tính cùng mạng thấy nhau.
   - Mở thẳng file (file://): lưu trong localStorage, đồng bộ giữa các tab của CÙNG trình duyệt (Chrome/Edge). */
(function () {
  const KEY = 'wc-demo-requests';
  const listeners = new Set();
  let cache = [];
  let mode = 'local';
  let lastJson = '';

  const emit = () => listeners.forEach((fn) => fn(cache));

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function writeLocal(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* bộ nhớ bị chặn: vẫn chạy trong tab này */ }
  }

  async function pull() {
    if (mode === 'remote') {
      try {
        const r = await fetch('api/requests', { cache: 'no-store' });
        const txt = await r.text();
        if (txt !== lastJson) { lastJson = txt; cache = JSON.parse(txt); emit(); }
      } catch (e) { /* mất kết nối tạm thời: giữ dữ liệu cũ */ }
    } else {
      const list = readLocal();
      const txt = JSON.stringify(list);
      if (txt !== lastJson) { lastJson = txt; cache = list; emit(); }
    }
  }

  async function init() {
    if (location.protocol.startsWith('http')) {
      try {
        const r = await fetch('api/ping', { cache: 'no-store' });
        if (r.ok) mode = 'remote';
      } catch (e) { /* không có serve.py */ }
    }
    await pull();
    if (mode === 'remote') setInterval(pull, 1200);
    else window.addEventListener('storage', (e) => { if (e.key === KEY) pull(); });
    return mode;
  }

  async function save(req) {
    req.updatedAt = Date.now();
    const i = cache.findIndex((x) => x.id === req.id);
    if (i >= 0) cache[i] = req; else cache.unshift(req);
    lastJson = JSON.stringify(cache);
    emit();
    if (mode === 'remote') {
      try {
        await fetch('api/requests/' + encodeURIComponent(req.id), {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req)
        });
      } catch (e) { /* thử lại ở lần lưu sau */ }
    } else {
      writeLocal(cache);
    }
    return req;
  }

  async function reset() {
    cache = []; lastJson = '[]'; emit();
    if (mode === 'remote') { try { await fetch('api/requests', { method: 'DELETE' }); } catch (e) { /* bỏ qua */ } }
    else writeLocal([]);
  }

  function newId() {
    let id;
    do { id = 'R-' + Math.floor(1000 + Math.random() * 9000); } while (cache.some((x) => x.id === id));
    return id;
  }

  window.Store = {
    init, save, reset, newId,
    get: (id) => cache.find((x) => x.id === id) || null,
    list: () => cache.slice(),
    mode: () => mode,
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }
  };
})();

/* Tiện ích giao diện dùng chung. */
window.UI = {
  el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'style') n.style.cssText = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (k === 'html') n.innerHTML = v; // chỉ dùng cho SVG viết sẵn trong code, không dùng cho chữ người dùng gõ
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) if (c !== null && c !== undefined && c !== false) n.append(c);
    return n;
  },
  ago(ts) {
    const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (s < 45) return 'vừa xong';
    if (s < 3600) return Math.round(s / 60) + ' phút trước';
    if (s < 86400) return Math.round(s / 3600) + ' giờ trước';
    return new Date(ts).toLocaleDateString('vi-VN');
  },
  time(ts) { return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); },
  toast(text, kind) {
    let box = document.getElementById('toasts');
    if (!box) { box = UI.el('div', { id: 'toasts', class: 'toasts', 'aria-live': 'polite' }); document.body.append(box); }
    const t = UI.el('div', { class: 'toast ' + (kind || '') }, text);
    box.append(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3800);
  },
  icon: {
    check: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
    warn: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5"/><path d="M12 18h.01"/></svg>',
    user: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    swap: '<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7"/></svg>',
    up: '<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/><path d="M5 21h14"/></svg>',
    tool: '<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
    key: '<svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="32" r="11"/><circle cx="20" cy="32" r="4"/><path d="M31 32h28"/><path d="M51 32v8"/><path d="M45 32v6"/></svg>',
    bell: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    plus: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    arrow: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    back: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>'
  },
  svg(name) { const s = document.createElement('span'); s.className = 'ic'; s.innerHTML = UI.icon[name]; return s; }
};
