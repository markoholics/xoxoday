import { useState } from 'react';
import { parseBrief } from '@/lib/commandParser';
import { trackEvent } from '@/lib/events';
import { AiStatus, Checkpoint, SampleLabel } from '../ui/Bits';
import { Button } from '../ui/Button';
import { Hotspot } from '../ui/Hotspot';
import { ProgramCard } from '../home/CommandBar';
import { Flag } from '@/lib/review';
import { IconCheck } from '../ui/Icons';
import type { AiStatusId } from '@/config/status';

const STEPS: { id: 'brief' | 'draft' | 'simulate' | 'approve'; label: string; status: AiStatusId }[] = [
  { id: 'brief', label: 'Brief', status: 'studioBrief' },
  { id: 'draft', label: 'Draft', status: 'studioDraft' },
  { id: 'simulate', label: 'Simulate', status: 'studioSimulate' },
  { id: 'approve', label: 'Approve', status: 'studioApprove' },
];

const SAMPLE = 'Win back lapsed cardholders in the UAE with a $40,000 budget';

/** The four step AI studio. Sample output from a deterministic parser. A person approves. */
export function AiStudio() {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState(SAMPLE);
  const [approved, setApproved] = useState(false);
  const data = parseBrief(brief || SAMPLE);
  const seed = (brief || SAMPLE).length;
  const bars = [
    ['Expected participation', 34 + (seed % 17)],
    ['Points liability against budget', 52 + (seed % 23)],
    ['Redemption pace', 28 + (seed % 19)],
  ] as const;

  const go = (n: number) => {
    setStep(n);
    trackEvent('ai_studio_build', { step: STEPS[n].id });
  };
  const approve = () => {
    setApproved(true);
    trackEvent('ai_studio_build', { step: 'approve', completed: true });
  };

  return (
    <div id="ai-studio" data-tour="ai-studio" data-section="ai-studio" className="relative rounded-xl2 border bg-surface p-5 sm:p-6">
      <Hotspot id="ai-studio" label="AI studio stepper" className="right-4 top-4">Move through Brief, Draft, Simulate and Approve. Output is a sample.</Hotspot>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold">AI studio</h3>
        <SampleLabel flag="aiStudio">Sample output</SampleLabel>
      </div>

      <ol className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Steps">
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === step ? 'step' : undefined}
              className={`w-full rounded-xl border p-3 text-left transition-colors duration-200 ease-calm ${i === step ? 'border-ink bg-sunken' : 'hover:border-ink/40'} ${s.status === 'studioDraft' || s.status === 'studioSimulate' ? 'border-dashed' : ''}`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink font-mono text-[10px] text-canvas">{i < step || (i === 3 && approved) ? <IconCheck size={11} strokeWidth={3} /> : i + 1}</span>
                {s.label}
              </span>
              <span className="mt-2 block"><AiStatus id={s.status} /></span>
            </button>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="min-h-[220px]">
        {step === 0 && (
          <div>
            <label htmlFor="studio-brief" className="text-sm font-medium">Sample brief</label>
            <textarea id="studio-brief" value={brief} onChange={(e) => setBrief(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border bg-canvas p-3 text-base" />
            <p className="mt-1 text-xs text-muted">Edit the brief or keep the sample. A keyword parser reads audience, mechanic, budget and region.</p>
          </div>
        )}
        {step === 1 && <ProgramCard data={data} reveal={6} />}
        {step === 2 && (
          <div>
            <p className="text-sm font-medium">Simulated against sample members</p>
            <ul className="mt-3 space-y-3">
              {bars.map(([l, v]) => (
                <li key={l}>
                  <div className="flex justify-between text-sm"><span>{l}</span><span className="font-mono tabular-nums">{v}%</span></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-accent transition-[width] duration-600 ease-calm" style={{ width: `${v}%` }} /></div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Sample output. Not a forecast.</p>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm">Draft: <strong>{data.name}</strong>. Send it to a checker. Approving is a person's decision.</p>
            {!approved ? (
              <Button onClick={approve} arrow>Approve as checker</Button>
            ) : (
              <p role="status" className="rounded-xl border border-success/50 bg-success/10 p-3 text-sm">Approved by a person. Added to the audit trail. Sample only: nothing went live.</p>
            )}
          </div>
        )}
      </div>

      <Checkpoint className="mt-5" />
      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
        {step < 3 && <Button size="sm" arrow onClick={() => go(step + 1)}>{['Draft it', 'Simulate it', 'Review and approve'][step]}</Button>}
      </div>
      <p className="mt-3 text-xs text-muted"><Flag id="aiMcp" /></p>
    </div>
  );
}
