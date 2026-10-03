import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { celebrationStore, explorerAvailable } from '@/lib/explorer';
import { useStore } from '@/lib/store';
import { features } from '@/config/features';
import { useReducedMotion } from '@/lib/prefs';
import { spring, t } from '@/lib/motion';

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 320;
    const H = 220;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const col = (v: string) => `rgb(${css.getPropertyValue(v).trim()})`;
    const colors = [col('--brand'), col('--accent'), col('--accent-soft'), col('--ink')];
    const ps = Array.from({ length: 24 }, (_, i) => {
      const a = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 0.9;
      const v = 140 + Math.random() * 120;
      return { x: W / 2, y: 100, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 4 + Math.random() * 4, c: colors[i % colors.length], r: Math.random() * 6 };
    });
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const el = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      if (el >= 1.2) return;
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, el - 0.8) / 0.4);
      for (const p of ps) {
        const x = p.x + p.vx * el;
        const y = p.y + p.vy * el + 260 * el * el;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.r + el * 6);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={320} height={220} style={{ width: 320, height: 220 }} className="pointer-events-none absolute -top-[90px] left-1/2 -translate-x-1/2" aria-hidden />;
}

/** Celebrations are queued: one at a time, never stacked, never blocking. Points are announced politely. */
export function CelebrationHost() {
  const { queue, announce } = useStore(celebrationStore);
  const reduced = useReducedMotion();
  const cur = queue[0];
  useEffect(() => {
    if (!cur) return;
    const id = window.setTimeout(() => celebrationStore.set((s) => ({ ...s, queue: s.queue.slice(1) })), cur.kind === 'points' ? 1800 : 2200);
    return () => window.clearTimeout(id);
  }, [cur]);
  if (!explorerAvailable()) return null;
  const confetti = !reduced && features.confetti;
  return (
    <>
      <div className="sr-only-live" aria-live="polite" aria-atomic="true" data-testid="explorer-live">{announce}</div>
      <div className="pointer-events-none fixed inset-x-0 top-20 z-[90] flex justify-center px-4 sm:justify-end sm:pr-6" data-no-print>
        <AnimatePresence mode="wait">
          {cur?.kind === 'points' && (
            <motion.div key={'p' + queue.length + cur.label} initial={{ opacity: 0, y: reduced ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={t.base}
              className="flex items-center gap-3 rounded-full border bg-surface py-2 pl-2 pr-4 shadow-soft">
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-xs font-semibold text-[#0C0A09]">+{cur.points}</span>
              <span className="text-sm"><span className="font-medium">{cur.badge}</span> <span className="text-muted">badge</span></span>
            </motion.div>
          )}
          {cur?.kind === 'tier' && (
            <motion.div key={'t' + cur.tier} initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={reduced ? t.base : spring}
              className={`relative rounded-xl2 border bg-surface px-6 py-4 text-center shadow-soft ${confetti ? '' : 'ring-2 ring-accent'}`}>
              {confetti && <Confetti />}
              <p className="label-mono">Tier reached</p>
              <p className="mt-1 text-xl font-semibold">{cur.tier}</p>
              <p className="text-sm text-muted">{cur.points} points</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
