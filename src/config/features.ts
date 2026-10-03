import { readSession, writeSession } from '@/lib/storage';

/** Feature flags. Edit here. */
export const features = {
  explorerMode: true,
  confetti: true,
  realRewards: false, // stub only, no real fulfillment
  aiMode: false, // true swaps local retrieval for a model backed concierge (see src/lib/concierge.ts)
};

function param(name: string): string | null {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

/** ?explorer=off disables Explorer Mode for the session. */
export function explorerEnabledByUrl(): boolean {
  if (!features.explorerMode) return false;
  const p = param('explorer');
  if (p === 'off') writeSession('loyalife_explorer_off', '1');
  if (p === 'on') writeSession('loyalife_explorer_off', '0');
  return readSession('loyalife_explorer_off') !== '1';
}

/** ?review=1 turns on review mode for the session. */
export function reviewModeFromUrl(): boolean {
  const p = param('review');
  if (p === '1') writeSession('loyalife_review', '1');
  if (p === '0') writeSession('loyalife_review', '0');
  return readSession('loyalife_review') === '1';
}
