const API_BASE = '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export function fetchFolder(path) {
  return request(`/${path.join('/')}`);
}

export function createFolder(path) {
  return request(`/${path.join('/')}`, { method: 'MKCOL' });
}

export function createFile(path, content) {
  return request(`/${path.join('/')}`, { method: 'PUT', body: content });
}

export function deleteItem(path) {
  return request(`/${path.join('/')}`, { method: 'DELETE' });
}
