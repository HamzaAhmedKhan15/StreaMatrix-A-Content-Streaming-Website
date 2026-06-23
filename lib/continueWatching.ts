/**
 * Browser-side storage for the "Continue watching" row.
 *
 * Progress lives in localStorage as a small snapshot so the row can render right
 * away and offline, with no extra fetch to look up titles. All access goes
 * through these helpers. They're SSR-safe (guarded on `window`) and never throw,
 * even if storage is full or disabled.
 */

export const STORAGE_KEY = "streamly:continue-watching:v1";
const MAX_ENTRIES = 12;

export interface WatchProgress {
  id: string;
  name: string;
  /** Landscape thumbnail used by the continue-watching card. */
  thumbnailUrl: string;
  positionSec: number;
  durationSec: number;
  /** Epoch ms of the last update, used to sort most-recent first. */
  updatedAt: number;
}

export function readProgress(): WatchProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as WatchProgress[]) : [];
  } catch {
    return [];
  }
}

export function writeProgress(entries: WatchProgress[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // Ignore quota or disabled-storage errors, progress isn't critical.
  }
}

/** Resume position for a single title, or 0 if none is saved. */
export function getResumePosition(id: string): number {
  const entry = readProgress().find((item) => item.id === id);
  return entry?.positionSec ?? 0;
}
