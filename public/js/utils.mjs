export function formatDate(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
}

export function formatSize(bytes) {
  if (bytes == null || isNaN(bytes)) return '';
  if (bytes === 0) return '0 B';
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('es', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ICON_MAP = {
  folder: ['icon-folder', 'ti-folder'],
  js:     ['icon-js', 'ti-file-type-js'],
  mjs:    ['icon-mjs', 'ti-brand-nodejs'],
  html:   ['icon-html', 'ti-file-type-html'],
  css:    ['icon-css', 'ti-file-type-css'],
  scss:   ['icon-scss', 'ti-brand-sass'],
  py:     ['icon-py', 'ti-brand-python'],
  json:   ['icon-json', 'ti-code-dots'],
  md:     ['icon-md', 'ti-markdown'],
  pdf:    ['icon-pdf', 'ti-file-type-pdf'],
  txt:    ['icon-txt', 'ti-file-type-txt'],
  png:    ['icon-png', 'ti-photo'],
  jpg:    ['icon-jpg', 'ti-photo'],
  jpeg:   ['icon-jpeg', 'ti-photo'],
  gif:    ['icon-gif', 'ti-photo'],
  webp:   ['icon-webp', 'ti-photo'],
  svg:    ['icon-svg', 'ti-photo'],
  zip:    ['icon-zip', 'ti-file-type-zip'],
  mp4:    ['icon-mp4', 'ti-movie'],
  mkv:    ['icon-mkv', 'ti-movie'],
  mov:    ['icon-mov', 'ti-movie'],
  mp3:    ['icon-mp3', 'ti-music'],
  doc:    ['icon-doc', 'ti-file-type-doc'],
  docx:   ['icon-docx', 'ti-file-type-docx'],
};

export function getIconClasses(type) {
  if (type === 'folder') return ICON_MAP.folder;
  return ICON_MAP[type] || ['icon-default', 'ti-file'];
}
