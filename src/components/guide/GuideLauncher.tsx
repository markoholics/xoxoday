import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { closeGuide, openGuide, openPalette, uiStore, useUi } from '@/lib/ui';
import { sectionStore } from '@/lib/section';
import { useTour } from '@/lib/tour';
import { IconHelp } from '../ui/Icons';

const GuidePanel = lazy(() => import('./GuidePanel'));
const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
};

/** One floating button replaces any separate help, tour or chat launcher. Also owns keyboard shortcuts and section detection. */
export function GuideLauncher() {
  const { guideOpen, stickyVisible } = useUi();
  const tour = useTour();
  const { pathname } = useLocation();

  // Keyboard shortcuts: ?, /, Cmd or Ctrl plus K, G then T
  useEffect(() => {
    let g = 0;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
        return;
      }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '?') {
        e.preventDefault();
        openGuide('help');
      } else if (e.key === '/') {
        e.preventDefault();
        openGuide('ask');
      } else if (e.key.toLowerCase() === 'g') {
        g = Date.now();
      } else if (e.key.toLowerCase() === 't' && Date.now() - g < 900) {
        g = 0;
        openGuide('tour');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // What am I looking at: IntersectionObserver over [data-section]
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.isIntersecting ? e.intersectionRatio * Math.min(1, e.boundingClientRect.height / window.innerHeight + 0.2) : 0));
        let best: Element | null = null;
        let bv = 0;
        ratios.forEach((v, k) => {
          if (v > bv) {
            bv = v;
            best = k;
          }
        });
        sectionStore.set({ id: best ? (best as HTMLElement).dataset.section ?? null : null });
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] },
    );
    const t = window.setTimeout(() => document.querySelectorAll('[data-section]').forEach((el) => io.observe(el)), 700);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
      sectionStore.set({ id: null });
    };
  }, [pathname]);

  useEffect(() => {
    if (tour.active) closeGuide();
  }, [tour.active]);

  return (
    <>
      <button
        type="button"
        data-tour="guide"
        data-no-print
        onClick={() => (guideOpen ? closeGuide() : openGuide(uiStore.get().guideTab))}
        aria-expanded={guideOpen}
        aria-haspopup="dialog"
        aria-keyshortcuts="?"
        className={`fixed right-4 z-[45] flex h-11 items-center gap-2 rounded-full border bg-surface pl-3.5 pr-4 text-sm font-medium shadow-soft transition-[transform,bottom,border-color] duration-200 ease-calm hover:-translate-y-0.5 hover:border-ink/50 active:scale-[0.98] sm:right-6 ${stickyVisible ? 'bottom-[5.5rem] lg:bottom-6' : 'bottom-4 sm:bottom-6'}`}
      >
        <IconHelp size={18} />
        Guide
      </button>
      {guideOpen && (
        <Suspense fallback={null}>
          <GuidePanel />
        </Suspense>
      )}
    </>
  );
}
