import type { DemoState } from '@/types';
import { createSeedState } from './seed';

const STORAGE_KEY = 'contentpilot_demo_state_v1';

export function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed.seeded) return parsed;
    }
  } catch {
    // fall through to seed
  }
  const seed = createSeedState();
  saveState(seed);
  return seed;
}

export function saveState(state: DemoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save demo state', e);
  }
}

export function resetState(): DemoState {
  const seed = createSeedState();
  saveState(seed);
  return seed;
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
