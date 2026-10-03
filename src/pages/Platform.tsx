import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PILLARS, SUBPAGES } from '@/content/platform';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { MOCKS } from '@/components/platform/PillarMocks';
import { Sandbox } from '@/components/platform/Sandbox';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Flag } from '@/lib/review';
import { Term } from '@/components/ui/Term';

export default function Platform() {
  const [p, setP] = useState<(typeof PILLARS)[number]['id']>('programs');
  const pillar = PILLARS.find((x) => x.id === p)!;
  const Mock = MOCKS[p];
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="One platform. Every audience. Every change approved."
        lead={<>Run enterprise multi brand, channel, influencer, omnichannel and <Term id="coalition">coalition</Term> programs from one account. Each program runs independently.</>}
      />
      <Section id="pillars" section="pillars" tour="pillars">
        <SectionHead title="Five pillars" lead="Pick a pillar to see a mock screen." />
        <Tabs tabs={PILLARS.map((x) => ({ id: x.id, label: x.label }))} value={p} onChange={setP} label="Platform pillars" idPrefix="pil" className="mb-6" />
        <TabPanel idPrefix="pil" id={p} className="grid items-start gap-6 outline-offset-4 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h3 className="h3">{pillar.label}</h3>
            <p className="mt-3 text-muted">{pillar.line}<Flag id="members" /></p>
          </div>
          <Mock />
        </TabPanel>
      </Section>
      <MidCta title="Want to change a rule yourself?" />
      <Section tone="sunken" label="Sandbox">
        <SectionHead title="Try the sandbox" lead="Toggle a rule, change a tier threshold and preview a member message. One member card shows the result." />
        <Sandbox />
      </Section>
      <Section label="Deep dives">
        <SectionHead title="Go deeper" />
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {SUBPAGES.map((s) => (
            <RevealItem key={s.to}>
              <Link to={s.to} className="card card-hover block h-full p-5">
                <span className="text-lg font-semibold text-brand">{s.label}</span>
                <span className="mt-1 block text-muted">{s.line}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <PageFaq ids={['program-types', 'separate', 'launch']} />
      <ClosingCta title="See the platform with your program." />
      <PageFoot />
    </>
  );
}
