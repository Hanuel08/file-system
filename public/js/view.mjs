import { formatSize, formatDate, getIconClasses } from './utils.mjs';
import { getCurrentPath } from './state.mjs';

export function renderBreadcrumb(container, path, onClick) {
  container.innerHTML = '';
  const root = document.createElement('span');
  root.className = 'toolbar__breadcrumb-item';
  root.textContent = 'Inicio';
  root.addEventListener('click', () => onClick([]));
  container.appendChild(root);

  let accumulated = [];
  path.forEach((segment, i) => {
    accumulated.push(segment);
    const sep = document.createElement('span');
    sep.className = 'toolbar__breadcrumb-sep';
    sep.textContent = '/';
    container.appendChild(sep);

    const item = document.createElement('span');
    item.className = 'toolbar__breadcrumb-item';
    item.textContent = segment;
    const pathCopy = [...accumulated];
    item.addEventListener('click', () => onClick(pathCopy));
    container.appendChild(item);
  });
}

export function renderFileList(container, items, { onSelect, onOpen, onContextMenu }) {
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon"><i class="ti ti-folder-off"></i></div>
        <div class="empty-state__text">Carpeta vacía</div>
        <div class="empty-state__sub">No hay archivos ni carpetas aquí</div>
      </div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'file-row';
    row.dataset.type = item.isDirectory ? 'folder' : 'file';
    row.dataset.index = index;

    const [colorClass, iconClass] = getIconClasses(item.type);
    row.innerHTML = `
      <div class="file-row__icon"><i class="ti ${iconClass} ${colorClass}"></i></div>
      <span class="file-row__name">${escapeHtml(item.name)}</span>
      <span class="file-row__date">${formatDate(item.modified)}</span>
      <span class="file-row__size">${item.isDirectory ? '--' : formatSize(item.size)}</span>`;

    row.addEventListener('click', () => onSelect(index));
    row.addEventListener('dblclick', () => {
      if (item.isDirectory) onOpen(item);
    });
    row.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      onSelect(index);
      onContextMenu(e, item);
    });

    fragment.appendChild(row);
  });

  container.appendChild(fragment);
}

export function setSelectedRow(container, index) {
  container.querySelectorAll('.file-row').forEach((row, i) => {
    row.classList.toggle('selected', i === index);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
