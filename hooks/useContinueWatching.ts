"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  readProgress,
  writeProgress,
  STORAGE_KEY,
  type WatchProgress,
} from "@/lib/continueWatching";

// Drop an entry once it's effectively finished, or barely started.
const COMPLETE_RATIO = 0.95;
const MIN_POSITION_SEC = 10;

/*
 * localStorage is an *external store*, so we read it with `useSyncExternalStore`
 * rather than an effect + setState. This gives us, for free:
 *   - SSR safety (the server snapshot is always empty),
 *   - no hydration mismatch (client starts from the server snapshot, then syncs),
 *   - cross-tab updates (via the `storage` event).
 */

const EMPTY: WatchProgress[] = [];
const listeners = new Set<() => void>();

// Cache the parsed value keyed by the raw string so `getSnapshot` returns a
// stable reference while storage is unchanged (required to avoid render loops).
let cachedRaw: string | null | undefined;
let cachedValue: WatchProgress[] = EMPTY;

function getSnapshot(): WatchProgress[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = readProgress();
  }
  return cachedValue;
}

function getServerSnapshot(): WatchProgress[] {
  return EMPTY;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // `storage` only fires in *other* tabs, which keeps them in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

// Persist and notify subscribers in the current tab (where `storage` won't fire).
function persist(next: WatchProgress[]): void {
  writeProgress(next);
  listeners.forEach((listener) => listener());
}

/**
 * React access to the continue-watching list.
 *
 * - `items`  – current entries, most-recent first
 * - `record` – upsert progress for a title (called by the player)
 * - `remove` – drop a title from the row
 */
export function useContinueWatching() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const record = useCallback((entry: Omit<WatchProgress, "updatedAt">) => {
    const others = readProgress().filter((item) => item.id !== entry.id);
    const ratio = entry.durationSec > 0 ? entry.positionSec / entry.durationSec : 0;

    // Finished or barely-started titles shouldn't clutter the row.
    const next =
      ratio >= COMPLETE_RATIO || entry.positionSec < MIN_POSITION_SEC
        ? others
        : [{ ...entry, updatedAt: Date.now() }, ...others];

    persist(next);
  }, []);

  const remove = useCallback((id: string) => {
    persist(readProgress().filter((item) => item.id !== id));
  }, []);

  return { items, record, remove };
}
