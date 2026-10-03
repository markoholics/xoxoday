import { useState } from 'react';
import { CERTIFICATIONS } from '@/content/site';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { AnomalyDemo, DualControlDemo, LedgerReplayDemo } from '@/components/platform/SecurityDemos';
import { SecurityPackForm } from '@/components/platform/SecurityPackForm';
import { Graphic } from '@/components/graphics';
import { Flag } from '@/lib/review';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

const RESIDENCY = ['United States', 'Europe', 'Middle East', 'Asia Pacific'];

export default function Security() {
  const [res, setRes] = useState(RESIDENCY[0]);
  return (
    <>
      <PageHero
        eyebrow="Platform · Security, fraud & governance"
        title="Every change approved. Every point traceable."
        lead="Maker checker approvals, dual-control, an audit trail, a replayable reward ledger and anomaly detection. Consent, access and deletion workflows run by channel."
        ctaKey="security"
      />
      <Section tone="plain" label="Governance demos">
        <SectionHead title="See the controls work" lead="Three short demos. All use sample data." />
        <div className="grid gap-6 lg:grid-cols-2">
          <DualControlDemo />
          <div className="space-y-6">
            <Graphic kind="approval" />
          </div>
          <LedgerReplayDemo />
          <AnomalyDemo />
        </div>
      </Section>
      <MidCta title="Want your risk team to review this?" />
      <Section id="certs" section="certs" tour="certs" tone="sunken">
        <SectionHead title="Certifications and data residency" />
        <RevealGroup className="grid gap-6 lg:grid-cols-3">
          <RevealItem className="card p-6">
            <h3 className="font-semibold">Certifications</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CERTIFICATIONS.map((c) => (
                <li key={c.id} className="rounded-full border px-3 py-1 text-sm">{c.label}<Flag id={c.flag} /></li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">Also dual-control, audit and ML fraud.<Flag id="security" /></p>
          </RevealItem>
          <RevealItem className="card p-6">
            <h3 className="font-semibold"><label htmlFor="residency">Data residency</label></h3>
            <select id="residency" value={res} onChange={(e) => setRes(e.target.value)} aria-describedby="residency-help" className="mt-3 h-11 w-full rounded-lg border bg-canvas px-3 text-base">
              {RESIDENCY.map((r) => <option key={r}>{r}</option>)}
            </select>
            <p id="residency-help" className="mt-2 text-sm text-muted">Residency options to be confirmed.<Flag id="residency" /></p>
          </RevealItem>
          <RevealItem className="card p-6">
            <h3 className="font-semibold">Request our security pack</h3>
            <div className="mt-3"><SecurityPackForm id="page" /></div>
          </RevealItem>
        </RevealGroup>
      </Section>
      <PageFaq ids={['fraud', 'data-protection', 'deployment']} />
      <ClosingCta title="Review the controls with us." ctaKey="security" />
      <PageFoot />
    </>
  );
}
