import { useRef, useState, type KeyboardEvent } from 'react';
import { trackEvent } from '@/lib/events';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { DeploymentDiagram, type Mode } from '@/components/platform/DeploymentDiagram';
import { Hotspot } from '@/components/ui/Hotspot';
import { SampleLabel } from '@/components/ui/Bits';
import { Term } from '@/components/ui/Term';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Flag } from '@/lib/review';

const MODES: { id: Mode; label: string; line: string }[] = [
  { id: 'cloud', label: 'Cloud', line: 'Loyalife runs in the cloud, inside a VPC.' },
  { id: 'hybrid', label: 'Hybrid', line: 'Loyalife spans cloud and your own environment.' },
  { id: 'onprem', label: 'On-prem', line: 'Loyalife runs in your own environment.' },
];

export default function Infrastructure() {
  const [mode, setMode] = useState<Mode>('cloud');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pick = (m: Mode) => {
    setMode(m);
    trackEvent('deployment_select', { mode: m });
  };
  const onKey = (e: KeyboardEvent) => {
    const i = MODES.findIndex((m) => m.id === mode);
    const n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % 3 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i + 2) % 3 : -1;
    if (n >= 0) {
      e.preventDefault();
      pick(MODES[n].id);
      refs.current[MODES[n].id]?.focus();
    }
  };
  const cur = MODES.find((m) => m.id === mode)!;
  return (
    <>
      <PageHero eyebrow="Platform · Infrastructure" title="Run Loyalife where your risk team wants it." lead="Choose on-prem, hybrid or cloud. Keep a VPC boundary and Active-Active DR. Put your own brand on the member app." ctaKey="infrastructure" />
      <Section id="deployment" section="deployment" tour="deployment">
        <SectionHead title="Pick a deployment" lead="Select an option. The diagram shows where the Loyalife core sits." />
        <div className="relative rounded-xl2 border bg-surface p-4 sm:p-6">
          <Hotspot id="deployment" label="Deployment diagram" className="right-4 top-4">Pick Cloud, Hybrid or On-prem. The two regions pulse in sync.</Hotspot>
          <div role="radiogroup" aria-label="Deployment option" onKeyDown={onKey} className="mb-4 inline-flex gap-1 rounded-full border bg-sunken p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                ref={(el) => (refs.current[m.id] = el)}
                type="button"
                role="radio"
                aria-checked={mode === m.id}
                tabIndex={mode === m.id ? 0 : -1}
                onClick={() => pick(m.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ease-calm ${mode === m.id ? 'bg-ink text-canvas' : 'text-ink hover:bg-ink/10'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <DeploymentDiagram mode={mode} />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <p className="font-medium" aria-live="polite">{cur.line}</p>
            <SampleLabel flag="deploymentDiagram">Illustrative diagram</SampleLabel>
            <Flag id="deployment" />
          </div>
        </div>
      </Section>
      <MidCta title="Need a deployment walkthrough for your risk team?" />
      <Section tone="sunken" label="Capabilities">
        <SectionHead title="What the diagram shows" />
        <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Deployment', 'On-prem, hybrid and cloud.'],
            ['VPC', 'A VPC boundary around the core.'],
            ['Active-Active DR', 'Two regions run together and stay in sync.'],
            ['Multi-tenant', 'Each program runs independently under one account.'],
          ].map(([a, b]) => (
            <RevealItem key={a}><div className="card h-full p-5"><h3 className="font-semibold">{a}</h3><p className="mt-1 text-sm text-muted">{b}</p></div></RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="h3"><Term id="white-label">White-labelling</Term></h3>
            <p className="mt-2 text-muted">A white label iOS and Android app carries your brand. A WhatsApp bot lets members check balance, browse and redeem.</p>
          </div>
          <div className="card p-6">
            <h3 className="h3"><Term id="multi-tenant">Multi-tenant</Term> by design</h3>
            <p className="mt-2 text-muted">Run enterprise multi brand, channel, influencer, omnichannel and coalition programs. Each one runs independently under one account.</p>
          </div>
        </div>
      </Section>
      <PageFaq ids={['deployment', 'separate', 'data-protection']} />
      <ClosingCta title="Choose where Loyalife runs." ctaKey="infrastructure" />
      <PageFoot />
    </>
  );
}
