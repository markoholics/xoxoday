import { lazy, Suspense } from 'react';
import { useTour } from '@/lib/tour';

const TourOverlay = lazy(() => import('./TourOverlay'));

export function TourHost() {
  const { active } = useTour();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <TourOverlay />
    </Suspense>
  );
}
