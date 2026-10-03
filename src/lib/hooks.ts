import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from './prefs';

export function useOnScreen<T extends Element>(ref: RefObject<T>, rootMargin = '80px'): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return on;
}

export function useTabVisible(): boolean {
  const [v, setV] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const on = () => setV(!document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return v;
}

/** True only while the element is on screen, the tab is visible and motion is allowed. Loops use this. */
export function useActive<T extends Element>(ref: RefObject<T>): boolean {
  const on = useOnScreen(ref);
  const vis = useTabVisible();
  const reduced = useReducedMotion();
  return on && vis && !reduced;
}

export function useInterval(cb: () => void, ms: number, active: boolean) {
  const saved = useRef(cb);
  saved.current = cb;
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
}

export function useMediaQuery(q: string): boolean {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

export function useScrolledPast(px: number): boolean {
  const [v, setV] = useState(false);
  useEffect(() => {
    const on = () => setV(window.scrollY > px);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [px]);
  return v;
}

export function useId2(prefix: string) {
  const r = useRef(prefix + Math.random().toString(36).slice(2, 8));
  return r.current;
}
