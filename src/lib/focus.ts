import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Trap focus inside ref while active. Restores focus on close. Escape calls onEscape. */
export function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean, onEscape?: () => void, opts: { initialFocus?: string } = {}) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const prev = document.activeElement as HTMLElement | null;
    const first = (opts.initialFocus && el.querySelector<HTMLElement>(opts.initialFocus)) || el.querySelector<HTMLElement>(FOCUSABLE) || el;
    if (first === el && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    window.setTimeout(() => first.focus({ preventScroll: true }), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!items.length) return e.preventDefault();
      const a = items[0];
      const z = items[items.length - 1];
      const cur = document.activeElement;
      if (e.shiftKey && (cur === a || !el.contains(cur))) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && (cur === z || !el.contains(cur))) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prev?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
