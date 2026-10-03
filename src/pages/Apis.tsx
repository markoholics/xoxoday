import { INTEGRATIONS } from '@/content/site';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { ApiExplorer } from '@/components/platform/ApiExplorer';
import { Flag } from '@/lib/review';

export default function Apis() {
  return (
    <>
      <PageHero eyebrow="Platform · APIs" title="REST first. Built for your stack." lead="OAuth 2.0 to JWT secures access to members, transactions and points. Connect the systems your teams already use." ctaKey="apis" />
      <Section tone="plain" label="API explorer">
        <ApiExplorer />
      </Section>
      <MidCta title="Want an engineer to walk you through the APIs?" />
      <Section id="integrations" tone="sunken" label="Integrations">
        <SectionHead title="Integrations" lead="Systems you can connect." />
        <ul className="flex flex-wrap gap-2">
          {INTEGRATIONS.map((i) => <li key={i} className="rounded-full border bg-surface px-4 py-2 text-sm">{i}</li>)}
        </ul>
        <p className="mt-3 text-xs text-muted"><Flag id="integrations" /></p>
      </Section>
      <PageFaq ids={['integrations', 'data-protection', 'deployment']} />
      <ClosingCta title="Build on Loyalife." ctaKey="apis" />
      <PageFoot />
    </>
  );
}
