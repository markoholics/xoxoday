import { subscribe } from './events';
import { regionStore } from './region';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __PRERENDER__?: boolean;
  }
}

let started = false;

/** Forwards every tracked event to the console and window.dataLayer with page and region. */
export function startAnalytics(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  subscribe((e) => {
    const record = {
      event: e.name,
      ...e.payload,
      page: window.location.pathname,
      region: regionStore.get().region,
      ts: e.at,
    };
    if (!window.__PRERENDER__) console.info('[analytics]', record);
    window.dataLayer!.push(record);
  });
}
