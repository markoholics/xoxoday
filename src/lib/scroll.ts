import { prefsStore, systemPrefersReduced } from './prefs';

export function scrollToSelector(sel: string, focus = false): boolean {
  const el = document.querySelector<HTMLElement>(sel);
  if (!el) return false;
  const reduced = prefsStore.get().reduceMotion || systemPrefersReduced();
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  if (focus) {
    const f = el.querySelector<HTMLElement>('input,button,select,textarea,a[href]') ?? el;
    window.setTimeout(() => f.focus({ preventScroll: true }), reduced ? 0 : 450);
  }
  return true;
}

/** Wait for a selector to exist (route changes), up to maxMs. */
export function waitFor(sel: string, maxMs = 2500): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const el = document.querySelector<HTMLElement>(sel);
      if (el) return resolve(el);
      if (performance.now() - start > maxMs) return resolve(null);
      requestAnimationFrame(tick);
    };
    tick();
  });
}
