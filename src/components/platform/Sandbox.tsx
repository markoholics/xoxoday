import { useRef } from 'react';
import { SANDBOX_DEFAULT, sandboxStore, useSandbox, type Channel } from '@/lib/sandbox';
import { trackEvent } from '@/lib/events';
import { Switch, SampleLabel } from '../ui/Bits';
import { Hotspot } from '../ui/Hotspot';
import { Term } from '../ui/Term';
import { Flag } from '@/lib/review';
import { Button } from '../ui/Button';

const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'app', label: 'Member app' },
  { id: 'whatsapp', label: 'WhatsApp bot' },
  { id: 'email', label: 'Email' },
];

/** Three controls change one live member card. Sample data. */
export function Sandbox() {
  const s = useSandbox();
  const last = useRef(0);
  const emit = (control: string) => {
    const now = Date.now();
    if (now - last.current > 500) {
      last.current = now;
      trackEvent('sandbox_used', { control });
    }
  };
  const points = 11200;
  const need = Math.max(0, s.threshold - points);
  const pct = Math.min(100, (points / s.threshold) * 100);
  const earn = s.doublePoints ? 200 : 100;
  const message =
    s.channel === 'whatsapp'
      ? s.doublePoints ? 'Double points this weekend. Reply BALANCE to see your points.' : 'Reply BALANCE to see your points, or REDEEM to browse rewards.'
      : s.channel === 'email'
        ? s.doublePoints ? 'Subject: Double points this weekend' : `Subject: ${need ? `You are ${need.toLocaleString('en-US')} points from Gold` : 'You reached Gold'}`
        : s.doublePoints ? 'Double points are on. Every purchase earns 2x.' : need ? `${need.toLocaleString('en-US')} points to Gold.` : 'You are a Gold member.';

  return (
    <div id="sandbox" data-tour="sandbox" data-section="sandbox" className="relative rounded-xl2 border bg-surface p-5 sm:p-6">
      <Hotspot id="sandbox" label="Sandbox controls" className="right-4 top-4">Change a control. The member card on the right updates.</Hotspot>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold">Sandbox</h3>
        <SampleLabel flag="sandbox">Sample data</SampleLabel>
      </div>
      {s.source !== 'default' && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed bg-sunken px-3 py-2 text-sm">
          <span><span className="font-medium">Loaded: {s.programName}.</span> <span className="text-muted">{s.note}</span></span>
          <Button size="sm" variant="plain" onClick={() => sandboxStore.set({ ...SANDBOX_DEFAULT })}>Reset</Button>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <label htmlFor="sb-rule" className="text-sm font-medium">Toggle a rule</label>
              <p className="text-sm text-muted">Double points weekend</p>
            </div>
            <Switch id="sb-rule" label="Double points weekend" checked={s.doublePoints} onChange={(v) => { sandboxStore.set({ doublePoints: v }); emit('rule'); }} />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="sb-threshold" className="text-sm font-medium">Change a <Term id="tier">tier</Term> threshold</label>
              <span className="font-mono text-sm tabular-nums">Gold at {s.threshold.toLocaleString('en-US')}</span>
            </div>
            <input id="sb-threshold" type="range" min={5000} max={30000} step={1000} value={s.threshold} onChange={(e) => { sandboxStore.set({ threshold: Number(e.target.value) }); emit('threshold'); }} className="mt-2 w-full accent-[rgb(var(--brand))]" />
          </div>
          <fieldset>
            <legend className="text-sm font-medium">Preview a member message</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CHANNELS.map((c) => (
                <label key={c.id} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${s.channel === c.id ? 'border-ink bg-ink text-canvas' : 'hover:border-ink/50'}`}>
                  <input type="radio" name="sb-channel" className="sr-only" checked={s.channel === c.id} onChange={() => { sandboxStore.set({ channel: c.id }); emit('message'); }} />
                  {c.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div aria-live="polite" className="rounded-xl border bg-canvas p-5" data-member-card>
          <p className="label-mono">Member card</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-sm text-muted">Sample member</p>
              <p className="text-3xl font-semibold tabular-nums">{points.toLocaleString('en-US')}</p>
              <p className="text-sm text-muted">points</p>
            </div>
            <span className="rounded-full border px-3 py-1 text-xs">{need ? 'Silver' : 'Gold'}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-brand transition-[width] duration-320 ease-calm" style={{ width: `${pct}%` }} /></div>
          <p className="mt-1.5 text-xs text-muted">{need ? `${need.toLocaleString('en-US')} points to Gold at ${s.threshold.toLocaleString('en-US')}` : `Gold reached at ${s.threshold.toLocaleString('en-US')}`}</p>
          <p className="mt-3 text-sm">A $100 purchase earns <strong className="tabular-nums">{earn}</strong> points{s.doublePoints ? ' (weekend bonus on)' : ''}.</p>
          <div className="mt-4 rounded-lg bg-sunken p-3 text-sm"><p className="label-mono mb-1">{CHANNELS.find((c) => c.id === s.channel)!.label}</p>{message}</div>
        </div>
      </div>
    </div>
  );
}
