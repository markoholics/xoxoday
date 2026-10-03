import { useEffect, useState } from 'react';
import { createStore, useStore } from './store';

export interface Prefs {
  theme: 'light' | 'dark' | null;
  reduceMotion: boolean;
  showHints: boolean;
}

export const prefsStore = createStore<Prefs>({ theme: null, reduceMotion: false, showHints: true }, 'loyalife_prefs_v1');

export function systemPrefersReduced(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function systemDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

export const resolvedTheme = (): 'light' | 'dark' => prefsStore.get().theme ?? (systemDark() ? 'dark' : 'light');

export function applyPrefs(): void {
  const p = prefsStore.get();
  const root = document.documentElement;
  root.setAttribute('data-theme', p.theme ?? (systemDark() ? 'dark' : 'light'));
  root.setAttribute('data-reduce-motion', p.reduceMotion || systemPrefersReduced() ? 'true' : 'false');
}

export function toggleTheme(): void {
  prefsStore.set({ theme: resolvedTheme() === 'dark' ? 'light' : 'dark' });
  applyPrefs();
}

export function setReduceMotion(v: boolean): void {
  prefsStore.set({ reduceMotion: v });
  applyPrefs();
}

/** Reduced motion = system setting OR the Guide switch OR a prerender pass (final frames). */
export function useReducedMotion(): boolean {
  const { reduceMotion } = useStore(prefsStore);
  const [sys, setSys] = useState(systemPrefersReduced);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setSys(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduceMotion || sys || (typeof window !== 'undefined' && !!window.__PRERENDER__);
}

export const useTheme = () => {
  useStore(prefsStore);
  return resolvedTheme();
};
