import { formatSize, formatDateTime, getIconClasses } from './utils.mjs';
import { getCurrentPath } from './state.mjs';
import * as api from './api.mjs';

const overlay = () => document.getElementById('modalOverlay');
const content = () => document.getElementById('modalContent');

function openModal(html) {
  content().innerHTML = html;
  overlay().hidden = false;
  const firstInput = content().querySelector('input, textarea');
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
}

function closeModal() {
  overlay().hidden = true;
  content().innerHTML = '';
}

function onOverlayClick(e) {
  if (e.target === overlay()) closeModal();
}

function onEsc(e) {
  if (e.key === 'Escape') closeModal();
}

document.addEventListener('keydown', onEsc);
document.addEventListener('click', onOverlayClick);

export function showCreateFolder(currentPath, onConfirm) {
  const pathStr = currentPath.join('/') || '/';
  openModal(`
    <div class="modal__header">
      <div class="modal__header-icon modal__header-icon--folder">
        <i class="ti ti-folder-plus"></i>
      </div>
      <div>
        <div class="modal__title">Nueva carpeta</div>
        <div class="modal__subtitle">${escapeHtml(pathStr)}</div>
      </div>
    </div>
    <div class="modal__field">
      <label class="modal__label">Nombre</label>
      <input type="text" class="modal__input" id="modalNameInput" placeholder="Nueva carpeta">
    </div>
    <div class="modal__actions">
      <button class="modal__btn modal__btn--cancel" id="modalCancel">Cancelar</button>
      <button class="modal__btn modal__btn--primary" id="modalConfirm">Crear</button>
    </div>`);

  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalConfirm').addEventListener('click', async () => {
    const name = document.getElementById('modalNameInput').value.trim() || 'Nueva carpeta';
    const btn = document.getElementById('modalConfirm');
    btn.disabled = true;
    btn.textContent = 'Creando...';
    try {
      await api.createFolder([...currentPath, name]);
      closeModal();
      onConfirm();
    } catch (e) {
      alert('Error al crear carpeta: ' + e.message);
      btn.disabled = false;
      btn.textContent = 'Crear';
    }
  });

  document.getElementById('modalNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('modalConfirm').click();
  });
}

export function showCreateFile(currentPath, onConfirm) {
  const pathStr = currentPath.join('/') || '/';
  openModal(`
    <div class="modal__header">
      <div class="modal__header-icon">
        <i class="ti ti-file-plus"></i>
      </div>
      <div>
        <div class="modal__title">Nuevo archivo</div>
        <div class="modal__subtitle">${escapeHtml(pathStr)}</div>
      </div>
    </div>
    <div class="modal__field">
      <label class="modal__label">Nombre del archivo</label>
      <input type="text" class="modal__input" id="modalFileName" placeholder="archivo.txt">
    </div>
    <div class="modal__field">
      <label class="modal__label">Contenido (opcional)</label>
      <textarea class="modal__textarea" id="modalFileContent" placeholder="Escribe el contenido del archivo..."></textarea>
    </div>
    <div class="modal__actions">
      <button class="modal__btn modal__btn--cancel" id="modalCancel">Cancelar</button>
      <button class="modal__btn modal__btn--primary" id="modalConfirm">Crear</button>
    </div>`);

  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalConfirm').addEventListener('click', async () => {
    const name = document.getElementById('modalFileName').value.trim() || 'archivo.txt';
    const content = document.getElementById('modalFileContent').value;
    const btn = document.getElementById('modalConfirm');
    btn.disabled = true;
    btn.textContent = 'Creando...';
    try {
      await api.createFile([...currentPath, name], content);
      closeModal();
      onConfirm();
    } catch (e) {
      alert('Error al crear archivo: ' + e.message);
      btn.disabled = false;
      btn.textContent = 'Crear';
    }
  });

  document.getElementById('modalFileName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('modalConfirm').click();
  });
}

export function showFileInfo(item, onConfirm) {
  const [colorClass, iconClass] = getIconClasses(item.type);
  const pathStr = item.path.join('/');
  openModal(`
    <div class="modal__header">
      <div class="modal__header-icon ${item.isDirectory ? 'modal__header-icon--folder' : ''}">
        <i class="ti ${iconClass}"></i>
      </div>
      <div>
        <div class="modal__title">${escapeHtml(item.name)}</div>
        <div class="modal__subtitle">${item.isDirectory ? 'Carpeta' : 'Archivo'}</div>
      </div>
    </div>
    <hr class="modal__divider">
    <div class="modal__info-grid">
      <span class="modal__info-label">Tipo</span>
      <span class="modal__info-value">${item.isDirectory ? 'Carpeta' : item.type}</span>
      <span class="modal__info-label">Ruta</span>
      <span class="modal__info-value">${escapeHtml(pathStr)}</span>
      ${!item.isDirectory ? `
        <span class="modal__info-label">Tamaño</span>
        <span class="modal__info-value">${formatSize(item.size)}</span>
      ` : ''}
      <span class="modal__info-label">Creado</span>
      <span class="modal__info-value">${formatDateTime(item.created)}</span>
      <span class="modal__info-label">Modificado</span>
      <span class="modal__info-value">${formatDateTime(item.modified)}</span>
    </div>
    <hr class="modal__divider">
    <div class="modal__actions">
      <button class="modal__btn modal__btn--cancel" id="modalCancel">Cerrar</button>
      <button class="modal__btn modal__btn--danger" id="modalDelete">
        <i class="ti ti-trash" style="margin-right:4px"></i> Eliminar
      </button>
    </div>`);

  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalDelete').addEventListener('click', async () => {
    const btn = document.getElementById('modalDelete');
    btn.disabled = true;
    btn.textContent = 'Eliminando...';
    try {
      await api.deleteItem(item.path);
      closeModal();
      onConfirm();
    } catch (e) {
      alert('Error al eliminar: ' + e.message);
      btn.disabled = false;
      btn.textContent = 'Eliminar';
    }
  });
}

export function showContextMenu(x, y, items) {
  removeContextMenu();
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.id = 'contextMenu';

  items.forEach(({ label, icon, danger, onClick }) => {
    const btn = document.createElement('button');
    btn.className = `context-menu__item${danger ? ' context-menu__item--danger' : ''}`;
    btn.innerHTML = `<i class="${icon}"></i> ${label}`;
    btn.addEventListener('click', () => { removeContextMenu(); onClick(); });
    menu.appendChild(btn);
  });

  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  document.body.appendChild(menu);

  requestAnimationFrame(() => {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) menu.style.left = `${x - rect.width}px`;
    if (rect.bottom > window.innerHeight) menu.style.top = `${y - rect.height}px`;
  });

  setTimeout(() => document.addEventListener('click', removeContextMenu, { once: true }), 0);
}

function removeContextMenu() {
  const existing = document.getElementById('contextMenu');
  if (existing) existing.remove();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
