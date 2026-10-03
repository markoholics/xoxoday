import { lazy, Suspense } from 'react';
import { explorerAvailable, useExplorer } from '@/lib/explorer';
import { TOTAL_POINTS } from '@/content/explorer';
import { uiStore, useUi } from '@/lib/ui';

const Popover = lazy(() => import('./ExplorerPopover'));

/** The only gamification element visible by default: a small SVG progress ring. */
export function ExplorerRing() {
  const s = useExplorer();
  const { explorerOpen } = useUi();
  if (!explorerAvailable()) return null;
  const r = 11;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, s.points / TOTAL_POINTS);
  return (
    <>
      <button
        type="button"
        data-explorer-ring
        onClick={() => uiStore.set({ explorerOpen: !explorerOpen })}
        aria-label={`Explorer journey. ${s.enabled ? `${s.tier}, ${s.points} of ${TOTAL_POINTS} points` : 'Switched off'}. Open`}
        aria-expanded={explorerOpen}
        aria-haspopup="dialog"
        className="rounded-full p-1.5 transition-colors duration-200 hover:bg-sunken"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden focusable="false">
          <circle cx="14" cy="14" r={r} fill="none" strokeWidth="3" className="stroke-ink/15" strokeDasharray={s.enabled ? undefined : '3 3'} />
          <circle
            cx="14" cy="14" r={r} fill="none" strokeWidth="3" strokeLinecap="round"
            className="stroke-brand transition-[stroke-dashoffset] duration-600 ease-calm"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - (s.enabled ? pct : 0))}
            transform="rotate(-90 14 14)"
          />
          <circle cx="14" cy="14" r="3" className="fill-accent" />
        </svg>
      </button>
      {explorerOpen && (
        <Suspense fallback={null}>
          <Popover />
        </Suspense>
      )}
    </>
  );
}
