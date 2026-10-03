import { useSyncExternalStore } from 'react';
import { readStorage, writeStorage } from './storage';

export interface Store<T> {
  get(): T;
  set(patch: Partial<T> | ((s: T) => T)): void;
  subscribe(fn: () => void): () => void;
  reset(): void;
}

/** Tiny external store. Persists to localStorage when a key is given. */
export function createStore<T extends object>(initial: T, key?: string): Store<T> {
  let state: T = initial;
  if (key) {
    try {
      const raw = readStorage(key);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch {
      state = initial;
    }
  }
  const subs = new Set<() => void>();
  const persist = () => {
    if (key) {
      try {
        writeStorage(key, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    }
  };
  return {
    get: () => state,
    set(patch) {
      state = typeof patch === 'function' ? patch(state) : { ...state, ...patch };
      persist();
      subs.forEach((f) => f());
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    reset() {
      state = initial;
      persist();
      subs.forEach((f) => f());
    },
  };
}

export function useStore<T extends object>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

export function useStoreSelector<T extends object, R>(store: Store<T>, sel: (s: T) => R): R {
  return useSyncExternalStore(store.subscribe, () => sel(store.get()), () => sel(store.get()));
}
