import { Link } from 'react-router-dom';
import { Section, SectionHead } from '../ui/Section';
import { AiStatus, Checkpoint } from '../ui/Bits';
import { Graphic } from '../graphics';
import { Term } from '../ui/Term';
import { Button } from '../ui/Button';
import { startTour } from '@/lib/tour';

const STEPS = [
  { n: 'Brief', t: 'Describe the program you want.', id: 'studioBrief' as const },
  { n: 'Draft', t: 'AI proposes rules, tiers and a budget band.', id: 'studioDraft' as const },
  { n: 'Simulate', t: 'Check the draft against sample members.', id: 'studioSimulate' as const },
  { n: 'Approve', t: 'A person decides.', id: 'studioApprove' as const },
];

export function AiTeaser() {
  return (
    <Section id="ai" section="ai-teaser" tour="ai-teaser">
      <SectionHead
        title="AI that drafts and watches. People who decide."
        lead={<>Loyalife AI uses an on-prem LLM + <Term id="mcp">MCP</Term> with tenant-isolated, audited tool-calling. <Term id="anomaly">Anomaly detection</Term> watches the ledger.</>}
      />
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s.n} className="flex items-start gap-4 rounded-xl border bg-surface p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-canvas">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-medium">{s.n} <AiStatus id={s.id} /></p>
                  <p className="text-sm text-muted">{s.t}</p>
                </div>
              </li>
            ))}
          </ol>
          <Checkpoint className="mt-4" />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="ghost" arrow onClick={() => startTour('build')}>Take the build tour</Button>
            <Link to="/platform/ai-mcp#ai-studio" className="inline-flex h-11 items-center text-[15px] font-medium text-brand hover:underline">Try the AI studio</Link>
          </div>
        </div>
        <Graphic kind="ai" />
      </div>
    </Section>
  );
}
