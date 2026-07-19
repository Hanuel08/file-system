import * as state from './state.mjs';
import * as view from './view.mjs';
import * as components from './components.mjs';

const $breadcrumb = document.getElementById('breadcrumb');
const $fileList = document.getElementById('fileList');
const $searchInput = document.getElementById('searchInput');
const $backBtn = document.getElementById('backBtn');
const $refreshBtn = document.getElementById('refreshBtn');
const $sortBtn = document.getElementById('sortBtn');
const $newFolderBtn = document.getElementById('newFolderBtn');
const $newFileBtn = document.getElementById('newFileBtn');
const $deleteBtn = document.getElementById('deleteBtn');

let allItems = [];
let sortAsc = true;

function updateButtons() {
  $backBtn.disabled = state.getHistoryLength() === 0;
  $deleteBtn.disabled = state.getSelectedIndex() < 0;
}

function render() {
  const items = filterItems(allItems, $searchInput.value);
  view.renderFileList($fileList, items, {
    onSelect: (index) => {
      state.setSelectedIndex(index);
      view.setSelectedRow($fileList, index);
      updateButtons();
    },
    onOpen: (item) => {
      if (item.isDirectory) openFolder(item.name);
    },
    onContextMenu: (e, item) => {
      components.showContextMenu(e.clientX, e.clientY, [
        {
          label: 'Abrir',
          icon: 'ti ti-folder-open',
          onClick: () => { if (item.isDirectory) openFolder(item.name); },
        },
        {
          label: 'Ver detalles',
          icon: 'ti ti-info-circle',
          onClick: () => components.showFileInfo(item, loadAndRender),
        },
        {
          label: 'Eliminar',
          icon: 'ti ti-trash',
          danger: true,
          onClick: async () => {
            if (confirm(`¿Eliminar "${item.name}"?`)) {
              try {
                await import('./api.mjs').then(m => m.deleteItem(item.path));
                await loadAndRender();
              } catch (e) {
                alert('Error: ' + e.message);
              }
            }
          },
        },
      ]);
    },
  });
  view.renderBreadcrumb($breadcrumb, state.getCurrentPath(), async (path) => {
    await state.navigate(path);
    await loadAndRender();
  });
  updateButtons();
}

function filterItems(items, query) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(i => i.name.toLowerCase().includes(q));
}

async function loadAndRender() {
  allItems = await state.refresh();
  render();
}

async function openFolder(name) {
  const currentPath = state.getCurrentPath();
  await state.navigate([...currentPath, name]);
  allItems = state.getCurrentItems();
  render();
}

// ── Event handlers ──

$backBtn.addEventListener('click', async () => {
  const items = await state.goBack();
  if (items) {
    allItems = items;
    render();
  }
});

$refreshBtn.addEventListener('click', loadAndRender);

$newFolderBtn.addEventListener('click', () => {
  components.showCreateFolder(state.getCurrentPath(), loadAndRender);
});

$newFileBtn.addEventListener('click', () => {
  components.showCreateFile(state.getCurrentPath(), loadAndRender);
});

$deleteBtn.addEventListener('click', async () => {
  const index = state.getSelectedIndex();
  if (index < 0) return;
  const item = allItems[index];
  if (!confirm(`¿Eliminar "${item.name}"?`)) return;
  try {
    await import('./api.mjs').then(m => m.deleteItem(item.path));
    await loadAndRender();
  } catch (e) {
    alert('Error: ' + e.message);
  }
});

$searchInput.addEventListener('input', () => {
  render();
});

$sortBtn.addEventListener('click', () => {
  sortAsc = !sortAsc;
  allItems.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return sortAsc ? -1 : 1;
    if (!a.isDirectory && b.isDirectory) return sortAsc ? 1 : -1;
    return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });
  $sortBtn.querySelector('i').className = sortAsc ? 'ti ti-sort-ascending-letters' : 'ti ti-sort-descending-letters';
  render();
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'Backspace') {
    e.preventDefault();
    $backBtn.click();
  } else if (e.key === 'Delete') {
    e.preventDefault();
    $deleteBtn.click();
  } else if (e.key === 'F5') {
    e.preventDefault();
    loadAndRender();
  }
});

// ── Init ──

async function init() {
  $fileList.innerHTML = `<div class="loading"><div class="loading__spinner"></div></div>`;
  try {
    allItems = await state.navigateToRoot();
    render();
  } catch (e) {
    $fileList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon"><i class="ti ti-alert-triangle"></i></div>
        <div class="empty-state__text">Error de conexión</div>
        <div class="empty-state__sub">${e.message}. Asegúrate de que el servidor esté corriendo.</div>
      </div>`;
  }
}

init();
