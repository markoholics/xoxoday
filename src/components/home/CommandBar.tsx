import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMAND_CHIPS, parseBrief, type ProgramCardData } from '@/lib/commandParser';
import { trackEvent } from '@/lib/events';
import { sandboxStore } from '@/lib/sandbox';
import { useReducedMotion } from '@/lib/prefs';
import { Button } from '../ui/Button';
import { AiStatus, Checkpoint, SampleLabel } from '../ui/Bits';
import { Hotspot } from '../ui/Hotspot';
import { Flag } from '@/lib/review';
import { IconArrow } from '../ui/Icons';

export function ProgramCard({ data, reveal, onOpen }: { data: ProgramCardData; reveal: number; onOpen?: () => void }) {
  const show = (n: number) => reveal >= n;
  return (
    <div className="rounded-xl2 border bg-surface p-5" role="region" aria-label="Sample program card">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold">{show(1) ? data.name : '…'}</h3>
        <AiStatus id="commandBar" />
        <SampleLabel flag="commandBar">Sample output</SampleLabel>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {show(2) && (
          <div><dt className="label-mono">Audience</dt><dd className="mt-0.5">{data.audience} · {data.region} · {data.currency}</dd></div>
        )}
        {show(5) && (
          <div><dt className="label-mono">Budget band</dt><dd className="mt-0.5">{data.budgetBand}</dd></div>
        )}
        {show(3) && (
          <div className="sm:col-span-2">
            <dt className="label-mono">Rules</dt>
            <dd><ul className="mt-0.5 list-disc space-y-0.5 pl-4">{data.rules.map((r) => <li key={r}>{r}</li>)}</ul></dd>
          </div>
        )}
        {show(4) && (
          <div className="sm:col-span-2">
            <dt className="label-mono">Tiers</dt>
            <dd className="mt-0.5">{data.tiers.join(' · ')}</dd>
          </div>
        )}
        {show(6) && (
          <div className="sm:col-span-2">
            <dt className="label-mono">Simulated risk check</dt>
            <dd className="mt-1">
              <ul className="grid gap-1 sm:grid-cols-2">
                {data.risk.map((r) => (
                  <li key={r.label} className="flex items-center gap-2">
                    <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${r.ok ? 'bg-success' : 'bg-warning'}`} />
                    <span>{r.label}</span>
                    <span className="sr-only">{r.ok ? 'passed' : 'needs attention'}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-xs text-muted">{data.riskSummary}</p>
            </dd>
          </div>
        )}
      </dl>
      {show(6) && (
        <div className="mt-4 space-y-3">
          <Checkpoint />
          {onOpen && <Button size="md" variant="ghost" arrow onClick={onOpen}>Open in sandbox</Button>}
        </div>
      )}
    </div>
  );
}

/** Natural language command bar. A deterministic keyword parser, never a live model. */
export function CommandBar() {
  const [val, setVal] = useState('');
  const [data, setData] = useState<ProgramCardData | null>(null);
  const [reveal, setReveal] = useState(0);
  const [hint, setHint] = useState('');
  const reduced = useReducedMotion();
  const nav = useNavigate();
  const timer = useRef<number>();

  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = (text: string) => {
    if (!text.trim()) {
      setHint('Describe a program, or pick one of the examples below.');
      return;
    }
    setHint('');
    const d = parseBrief(text);
    setData(d);
    trackEvent('command_bar_submit', { query: text.trim() });
    window.clearInterval(timer.current);
    if (reduced) return setReveal(6);
    setReveal(1);
    let i = 1;
    timer.current = window.setInterval(() => {
      i += 1;
      setReveal(i);
      if (i >= 6) window.clearInterval(timer.current);
    }, 320);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(val);
  };

  const open = () => {
    if (!data) return;
    sandboxStore.set({ programName: data.name, threshold: data.threshold, doublePoints: data.doublePoints, note: `Drafted from your brief. ${data.budgetBand === 'To be set with your finance lead' ? '' : 'Budget band ' + data.budgetBand + '.'}`.trim(), source: 'command' });
    nav('/platform#sandbox');
  };

  return (
    <div data-tour="command-bar" className="relative">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row" role="search" aria-label="Describe a program">
        <label htmlFor="command-input" className="sr-only">Describe the program you want</label>
        <div className="relative flex-1">
          <input
            id="command-input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Describe the program you want"
            autoComplete="off"
            className="h-12 w-full rounded-full border bg-surface px-5 pr-12 text-base shadow-sm placeholder:text-muted"
          />
          <Hotspot id="command-bar" label="Command bar" className="right-3 top-3" align="right">Type a goal. A keyword parser drafts a sample program. No live model is used.</Hotspot>
        </div>
        <Button type="submit" size="lg" variant="subtle" className="shrink-0 !bg-ink !text-canvas hover:!bg-ink/85">
          Draft it <IconArrow size={16} />
        </Button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Examples">
        {COMMAND_CHIPS.map((c) => (
          <button key={c} type="button" onClick={() => { setVal(c); run(c); }} className="rounded-full border bg-surface px-3 py-1.5 text-left text-sm transition-colors duration-200 hover:border-ink/50">
            {c}
          </button>
        ))}
        <Flag id="commandBar" />
      </div>
      {hint && <p role="status" className="mt-2 text-sm text-muted">{hint}</p>}
      <div className="mt-4" aria-live="polite">
        {data && <ProgramCard data={data} reveal={reveal} onOpen={open} />}
      </div>
    </div>
  );
}
