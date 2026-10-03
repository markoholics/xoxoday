import { createStore, useStore } from './store';
import { getTour } from '@/content/tours';
import { trackEvent } from './events';

export interface TourState {
  active: boolean;
  tourId: string | null;
  index: number;
  startedAt: number;
  // resume pointer, persisted
  resumeId: string | null;
  resumeIndex: number;
}

export const tourStore = createStore<TourState>(
  { active: false, tourId: null, index: 0, startedAt: 0, resumeId: null, resumeIndex: 0 },
  'loyalife_tour_v1',
);
// An overlay never survives a reload. Only the resume pointer does.
tourStore.set({ active: false });

export const useTour = () => useStore(tourStore);

export function startTour(id: string, from = 0) {
  const t = getTour(id);
  if (!t) return;
  tourStore.set({ active: true, tourId: id, index: Math.min(from, t.steps.length - 1), startedAt: Date.now() });
  trackEvent('tour_start', { tourId: id });
}

export function resumeTour() {
  const s = tourStore.get();
  if (s.resumeId) startTour(s.resumeId, s.resumeIndex);
}

export function stopTour(save = true) {
  const s = tourStore.get();
  if (save && s.tourId) tourStore.set({ active: false, resumeId: s.tourId, resumeIndex: s.index });
  else tourStore.set({ active: false });
}

export function finishTour() {
  const s = tourStore.get();
  if (s.tourId) {
    const dwellMs = Date.now() - s.startedAt;
    trackEvent('tour_complete', { tourId: s.tourId, dwellMs });
  }
  tourStore.set({ active: false, resumeId: null, resumeIndex: 0 });
}

export function setStep(i: number) {
  tourStore.set({ index: i });
}
