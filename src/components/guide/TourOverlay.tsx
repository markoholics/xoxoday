import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTour } from '@/content/tours';
import { finishTour, setStep, stopTour, useTour } from '@/lib/tour';
import { waitFor } from '@/lib/scroll';
import { useFocusTrap } from '@/lib/focus';
import { useReducedMotion } from '@/lib/prefs';
import { Button } from '../ui/Button';
import { Graphic } from '../graphics';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PAD = 8;

/** Spotlight tour engine: SVG mask, coach mark, step counter, dots, Back/Next/Skip, keyboard, focus trap. */
export default function TourOverlay() {
  const tour = useTour();
  const def = tour.tourId ? getTour(tour.tourId) : undefined;
  const step = def?.steps[tour.index];
  const nav = useNavigate();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [rect, setRect] = useState<Rect | null>(null);
  const [found, setFound] = useState(false);
  const coachRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);
  const [ch, setCh] = useState(200);

  const last = !!def && tour.index === def.steps.length - 1;
  const next = () => (last ? finishTour() : setStep(tour.index + 1));
  const back = () => tour.index > 0 && setStep(tour.index - 1);
  const skip = () => stopTour(true);

  useFocusTrap(coachRef, tour.active && !!step, skip);

  // Navigate to the step's route, wait for the target, scroll it into view.
  useEffect(() => {
    if (!step) return;
    let cancel = false;
    setFound(false);
    setRect(null);
    (async () => {
      if (step.route && step.route !== pathname) nav(step.route);
      const el = await waitFor(step.target, 3500);
      if (cancel) return;
      if (!el) return setFound(false);
      const r0 = el.getBoundingClientRect();
      const mobile = window.innerWidth < 640;
      const top = mobile ? r0.top + window.scrollY - 72 : r0.top + window.scrollY - Math.max(72, (window.innerHeight - Math.min(r0.height, window.innerHeight * 0.6)) / 2 - 60);
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
      setFound(true);
    })();
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id, tour.tourId]);

  // Track the target rect while it is found.
  useEffect(() => {
    if (!step || !found) return;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(step.target);
      if (!el) return setRect(null);
      const r = el.getBoundingClientRect();
      setRect((o) => (o && Math.abs(o.x - r.left) < 0.5 && Math.abs(o.y - r.top) < 0.5 && Math.abs(o.w - r.width) < 0.5 && Math.abs(o.h - r.height) < 0.5 ? o : { x: r.left, y: r.top, w: r.width, h: r.height }));
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    measure();
    const id = window.setInterval(measure, 100);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [step?.id, found, step]);

  useLayoutEffect(() => {
    if (coachRef.current) setCh(coachRef.current.offsetHeight);
  }, [step?.id, rect]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        back();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  if (!def || !step) return null;

  const mobile = vw < 640;
  const w = Math.min(360, vw - 32);
  let style: React.CSSProperties;
  if (mobile) {
    const targetBottom = rect ? rect.y + rect.h : 0;
    const placeTop = rect ? targetBottom > vh - ch - 40 && rect.y > ch + 40 : false;
    style = placeTop ? { left: 16, right: 16, top: 16 } : { left: 16, right: 16, bottom: 16 };
  } else if (rect) {
    const below = rect.y + rect.h + PAD + 16 + ch < vh;
    const top = below ? rect.y + rect.h + PAD + 12 : Math.max(16, rect.y - PAD - 12 - ch);
    const left = Math.min(Math.max(16, rect.x + rect.w / 2 - w / 2), vw - w - 16);
    // If the target is taller than the viewport, dock the coach mark at the bottom.
    style = rect.h > vh - ch - 80 ? { width: w, left: vw - w - 24, bottom: 24 } : { width: w, left, top };
  } else {
    style = { width: w, left: (vw - w) / 2, top: Math.max(24, (vh - ch) / 2) };
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]" data-no-print data-tour-overlay>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.x - PAD} y={rect.y - PAD} width={rect.w + PAD * 2} height={rect.h + PAD * 2} rx="14" fill="black"
                style={{ transition: reduced ? 'none' : 'all 320ms cubic-bezier(0.22,1,0.36,1)' }}
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" mask="url(#tour-mask)" className="fill-ink" fillOpacity="0.55" />
        {rect && (
          <rect
            x={rect.x - PAD} y={rect.y - PAD} width={rect.w + PAD * 2} height={rect.h + PAD * 2} rx="14" fill="none" strokeWidth="2" className="stroke-accent"
            style={{ transition: reduced ? 'none' : 'all 320ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        )}
      </svg>

      <div
        ref={coachRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${def.title}, step ${tour.index + 1} of ${def.steps.length}`}
        className="absolute rounded-xl2 border bg-surface p-4 shadow-soft"
        style={{ ...style, transition: reduced ? 'opacity 200ms' : 'top 320ms cubic-bezier(0.22,1,0.36,1), left 320ms cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className="flex items-center justify-between">
          <p className="label-mono">{def.title} · {tour.index + 1} of {def.steps.length}</p>
          <button type="button" onClick={skip} className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">Skip</button>
        </div>
        <h2 className="mt-2 text-lg font-semibold leading-snug">{step.title}</h2>
        <p className="mt-1 text-sm text-muted" aria-live="polite">{step.body}</p>
        {step.graphic && !mobile && <div className="mt-3"><Graphic kind={step.graphic} compact /></div>}
        <div className="mt-4 flex items-center justify-between gap-3">
          <ol className="flex gap-1" aria-hidden>
            {def.steps.map((s, i) => (
              <li key={s.id} className={`h-1.5 rounded-full transition-all duration-200 ${i === tour.index ? 'w-4 bg-ink' : i < tour.index ? 'w-1.5 bg-ink/50' : 'w-1.5 bg-ink/20'}`} />
            ))}
          </ol>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={back} disabled={tour.index === 0}>Back</Button>
            <Button size="sm" onClick={next} arrow={!last}>{last ? 'Finish' : 'Next'}</Button>
          </div>
        </div>
        {!found && <p className="mt-2 text-xs text-muted">Looking for this part of the page.</p>}
      </div>
    </div>,
    document.body,
  );
}
