import { useState } from 'react';
import { FLAGS, type FlagKind } from '@/content/flags';
import { aiStatus, STATUS_TEXT } from '@/config/status';
import { features } from '@/config/features';
import { useReview } from '@/lib/review';

const KIND: Record<FlagKind, string> = { confirm: 'Confirm', simulated: 'Simulated', placeholder: 'Placeholder', cert: 'Attach certificate or report' };

/** Review mode panel (?review=1). Lists every flag and every AI status. */
export default function ReviewPanel() {
  const on = useReview();
  const [open, setOpen] = useState(false);
  if (!on) return null;
  const entries = Object.entries(FLAGS);
  return (
    <div className="fixed bottom-4 left-4 z-[85]" data-no-print>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full border border-amber-500 bg-amber-100 px-3.5 py-2 font-mono text-xs font-medium text-amber-900 shadow-soft"
      >
        ⚑ Review mode · {entries.length} flags
      </button>
      {open && (
        <div role="dialog" aria-label="Review flags" className="mt-2 max-h-[70vh] w-[min(440px,calc(100vw-2rem))] overflow-y-auto rounded-xl2 border border-amber-500/60 bg-surface p-4 text-sm shadow-soft">
          <h2 className="text-base font-semibold">Review flags</h2>
          <p className="text-xs text-muted">Mirrored in CONFIRM.md. Explorer features: aiMode {String(features.aiMode)}, realRewards {String(features.realRewards)}.</p>
          <h3 className="label-mono mt-4">AI statuses (src/config/status.ts)</h3>
          <ul className="mt-1 space-y-1">
            {Object.values(aiStatus).map((s) => (
              <li key={s.label} className="flex justify-between gap-2"><span>{s.label}</span><span className="font-mono text-xs">{STATUS_TEXT[s.status]}{(s as { supplied?: boolean }).supplied ? ' · supplied' : ''}</span></li>
            ))}
          </ul>
          <h3 className="label-mono mt-4">Flags</h3>
          <ul className="mt-1 space-y-1.5">
            {entries.map(([id, f]) => (
              <li key={id} className="flex gap-2"><span className="w-24 shrink-0 font-mono text-[11px] text-amber-800">{KIND[f.kind]}</span><span>{f.label}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
