import { HistoryItem } from '../types';

const HISTORY_KEY = 'calc_app_history_v1';
const THEME_KEY = 'calc_app_theme_v1';
const MEMORY_KEY = 'calc_app_memory_v1';

export function getStoredHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem[] {
  try {
    const history = getStoredHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now()
    };
    // Keep top 50 recent items
    const updated = [newItem, ...history].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  try {
    const history = getStoredHistory().filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch {
    return [];
  }
}

export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}

export function getStoredTheme(): 'light' | 'dark' | 'system' {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'light' || theme === 'dark' || theme === 'system') return theme;
  } catch {}
  return 'system';
}

export function setStoredTheme(theme: 'light' | 'dark' | 'system'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function getStoredMemory(): number {
  try {
    const mem = localStorage.getItem(MEMORY_KEY);
    if (mem !== null) return parseFloat(mem) || 0;
  } catch {}
  return 0;
}

export function setStoredMemory(val: number): void {
  try {
    localStorage.setItem(MEMORY_KEY, val.toString());
  } catch {}
}
