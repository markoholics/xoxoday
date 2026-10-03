import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/prefs';

/** Counts up over 1.2s when in view. Reduced motion shows the final value. */
export function Counter({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) return setN(value);
    if (!inView) return;
    const c = animate(0, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, reduced, value]);
  return (
    <span ref={ref} className="tabular-nums" aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden>{prefix}{n.toFixed(decimals)}{suffix}</span>
    </span>
  );
}
