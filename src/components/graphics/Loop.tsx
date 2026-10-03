import { motion, useMotionValue, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useOnScreen, useTabVisible } from '@/lib/hooks';
import { useReducedMotion } from '@/lib/prefs';
import { IconPause, IconPlay } from '../ui/Icons';
import { Flag } from '@/lib/review';

/** Drives a 0..1 clock as a MotionValue. Pauses off screen, in hidden tabs, and under reduced motion. */
export function useClock(duration: number, playing: boolean, finalP: number, reduced: boolean): MotionValue<number> {
  const p = useMotionValue(reduced ? finalP : 0);
  const pos = useRef(0);
  useEffect(() => {
    if (reduced) {
      p.set(finalP);
      return;
    }
    if (!playing) return;
    let raf = 0;
    let last = 0;
    const start = performance.now() - pos.current;
    const tick = (now: number) => {
      if (now - last > 30) {
        last = now;
        const el = (now - start) % duration;
        pos.current = el;
        p.set(el / duration);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced, duration, finalP, p]);
  return p;
}

export interface LoopProps {
  compact?: boolean;
  className?: string;
}

interface FrameProps extends LoopProps {
  label: string;
  caption: string;
  transcript: string;
  duration: number; // ms, 4000 to 8000
  finalP?: number;
  children: (p: MotionValue<number>) => ReactNode;
}

/** Shared frame: role=img, play/pause, caption, transcript in a details element. */
export function LoopFrame({ label, caption, transcript, duration, finalP = 0.96, compact, className = '', children }: FrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useOnScreen(ref);
  const vis = useTabVisible();
  const reduced = useReducedMotion();
  const [user, setUser] = useState(true);
  const p = useClock(duration, user && on && vis, finalP, reduced);
  return (
    <figure ref={ref} className={`rounded-xl border bg-surface p-3 ${className}`} data-loop>
      <svg viewBox="0 0 320 180" role="img" aria-label={label} className="block h-auto w-full font-sans" focusable="false">
        {children(p)}
      </svg>
      <figcaption className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
        <span>{caption}<Flag id="tourGraphics" /></span>
        {!compact && !reduced && (
          <button
            type="button"
            onClick={() => setUser((v) => !v)}
            aria-label={user ? `Pause animation: ${label}` : `Play animation: ${label}`}
            className="shrink-0 rounded-full border p-1.5 text-ink hover:bg-sunken"
          >
            {user ? <IconPause size={12} /> : <IconPlay size={12} />}
          </button>
        )}
      </figcaption>
      {!compact && (
        <details className="mt-2 text-xs text-muted">
          <summary className="select-none">Transcript</summary>
          <p className="mt-1 leading-relaxed">{transcript}</p>
        </details>
      )}
    </figure>
  );
}
