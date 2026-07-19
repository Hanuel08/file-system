import { fetchFolder } from './api.mjs';

let currentPath = [];
let currentItems = [];
let history = [];
let selectedIndex = -1;

export function getCurrentPath() { return currentPath; }
export function getCurrentItems() { return currentItems; }
export function getHistoryLength() { return history.length; }
export function getSelectedIndex() { return selectedIndex; }
export function setSelectedIndex(i) { selectedIndex = i; }

export async function navigate(path) {
  history.push([...currentPath]);
  currentPath = [...path];
  const data = await fetchFolder(currentPath);
  currentItems = data.items || [];
  selectedIndex = -1;
  return currentItems;
}

export async function navigateToRoot() {
  history = [];
  currentPath = [];
  const data = await fetchFolder([]);
  currentItems = data.items || [];
  selectedIndex = -1;
  return currentItems;
}

export async function goBack() {
  if (history.length === 0) return null;
  currentPath = history.pop();
  const data = await fetchFolder(currentPath);
  currentItems = data.items || [];
  selectedIndex = -1;
  return currentItems;
}

export async function refresh() {
  const data = await fetchFolder(currentPath);
  currentItems = data.items || [];
  selectedIndex = -1;
  return currentItems;
}
