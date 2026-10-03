// localStorage always inside try/catch, with an in-memory fallback.
const mem = new Map<string, string>();

export function readStorage(key: string): string | null {
  try {
    const v = window.localStorage.getItem(key);
    return v ?? mem.get(key) ?? null;
  } catch {
    return mem.get(key) ?? null;
  }
}

export function writeStorage(key: string, value: string): void {
  mem.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* in-memory fallback already holds the value */
  }
}

export function removeStorage(key: string): void {
  mem.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key) ?? mem.get('s:' + key) ?? null;
  } catch {
    return mem.get('s:' + key) ?? null;
  }
}

export function writeSession(key: string, value: string): void {
  mem.set('s:' + key, value);
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
