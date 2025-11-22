import { ProgramEntry } from '../types';
import { APP_STORAGE_KEY } from '../constants';

export const getEntries = (): ProgramEntry[] => {
  const stored = localStorage.getItem(APP_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    // Sort by timestamp (creation order)
    return parsed.sort((a: ProgramEntry, b: ProgramEntry) => a.timestamp - b.timestamp);
  } catch (e) {
    console.error("Failed to parse entries", e);
    return [];
  }
};

export const addEntry = (entry: ProgramEntry): ProgramEntry[] => {
  const current = getEntries();
  const updated = [...current, entry];
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const removeEntry = (id: string): ProgramEntry[] => {
  const current = getEntries();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const toggleComplete = (id: string): ProgramEntry[] => {
  const current = getEntries();
  const updated = current.map(e => 
    e.id === id ? { ...e, completed: !e.completed } : e
  );
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearEntries = (): void => {
  localStorage.removeItem(APP_STORAGE_KEY);
};