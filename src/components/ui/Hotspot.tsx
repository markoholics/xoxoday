import { createStore, useStore } from '@/lib/store';
import { prefsStore } from '@/lib/prefs';
import { TipBubble, useTip } from './Tip';

const seen = createStore<{ ids: string[] }>({ ids: [] }, 'loyalife_hints_v1');

/** Pulsing dot with a tooltip on hover, focus and tap. One time hint: stops pulsing once opened. Place inside a relative parent. */
export function Hotspot({ id, label, children, className = 'right-3 top-3', align = 'right' }: { id: string; label: string; children: string; className?: string; align?: 'left' | 'right' | 'center' }) {
  const { showHints } = useStore(prefsStore);
  const { ids } = useStore(seen);
  const tip = useTip();
  if (!showHints) return null;
  const done = ids.includes(id);
  const open = () => {
    tip.setOpen(true);
    if (!done) seen.set({ ids: [...ids, id] });
  };
  return (
    <span ref={tip.wrapRef} className={`absolute z-20 ${className}`} onMouseEnter={() => { tip.show(); if (!done) seen.set({ ids: [...ids, id] }); }} onMouseLeave={tip.hide} data-hotspot={id}>
      <button
        type="button"
        aria-label={`Hint: ${label}`}
        aria-describedby={tip.open ? tip.id : undefined}
        onClick={() => (tip.open ? tip.setOpen(false) : open())}
        onFocus={open}
        onBlur={tip.hide}
        className="relative flex h-6 w-6 items-center justify-center rounded-full"
      >
        {!done && <span className="ping-soft absolute inline-flex h-3 w-3 rounded-full bg-accent" aria-hidden />}
        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-surface bg-accent ring-1 ring-ink/40" aria-hidden />
      </button>
      <TipBubble id={tip.id} open={tip.open} title={label} align={align}>
        {children}
      </TipBubble>
    </span>
  );
}
