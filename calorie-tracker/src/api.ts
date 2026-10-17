import type { DaySummary, Entry } from "./types";

const KEY = "caloriesnap.password";
export const getPassword = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};
export const setPassword = (p: string) => {
  try {
    localStorage.setItem(KEY, p);
  } catch {
    /* private mode: password just won't persist */
  }
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

let onUnauthorized: () => void = () => {};
export const setUnauthorizedHandler = (fn: () => void) => (onUnauthorized = fn);

async function call<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { "x-app-password": getPassword() };
  if (init.json !== undefined) headers["content-type"] = "application/json";
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers, body: init.json !== undefined ? JSON.stringify(init.json) : init.body });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) onUnauthorized();
  if (!res.ok) throw new ApiError(res.status, data.error ?? `Request failed (${res.status})`);
  return data as T;
}

/** <img> tags can't send headers, so protected deployments pass the password in the query. */
export const imgSrc = (url: string | null) => {
  if (!url) return undefined;
  const p = getPassword();
  return p ? `${url}?p=${encodeURIComponent(p)}` : url;
};

export type ItemFields = { name?: string; portion?: string; calories?: number; protein?: number; carbs?: number; fat?: number };

export const api = {
  auth: () => call<{ protected: boolean }>("/api/auth"),
  day: (day: string) => call<DaySummary & { target: number }>(`/api/day?day=${day}`),
  history: (before: string | null, limit = 7) =>
    call<{ target: number; days: DaySummary[]; nextBefore: string | null }>(
      `/api/history?limit=${limit}${before ? `&before=${before}` : ""}`,
    ),
  setTarget: (target: number) => call<{ target: number }>("/api/settings", { method: "PUT", json: { target } }),
  analyze: (body: { image?: string; barcode?: string; day: string }) => call<Entry>("/api/analyze", { method: "POST", json: body }),
  entry: (id: number) => call<Entry>(`/api/entries/${id}`),
  deleteEntry: (id: number) => call<{ ok: true }>(`/api/entries/${id}`, { method: "DELETE" }),
  patchItem: (id: number, f: ItemFields) => call<Entry>(`/api/items/${id}`, { method: "PATCH", json: f }),
  resetItem: (id: number) => call<Entry>(`/api/items/${id}/reset`, { method: "POST" }),
  deleteItem: (id: number) => call<{ entry: Entry | null }>(`/api/items/${id}`, { method: "DELETE" }),
};
