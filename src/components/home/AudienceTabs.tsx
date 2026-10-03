import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORIES } from '@/content/site';
import { Section, SectionHead } from '../ui/Section';
import { Tabs, TabPanel } from '../ui/Tabs';
import { Graphic } from '../graphics';
import { ButtonLink } from '../ui/Button';
import { Flag } from '@/lib/review';
import type { GraphicKey } from '@/content/tours';

type Aud = 'customers' | 'channel' | 'influencers';

const AUD: { id: Aud; label: string; outcome: string; mechanic: string; storyId: string; to: string; graphic: GraphicKey }[] = [
  { id: 'customers', label: 'Customers', outcome: 'Keep customers earning and coming back.', mechanic: 'Points per purchase, tiers that move members up, and campaigns you approve before they run.', storyId: 'cbi', to: '/solutions/customers', graphic: 'points' },
  { id: 'channel', label: 'Channel partners', outcome: 'Turn dealers and distributors into repeat sellers.', mechanic: 'Target tiers, claims with proof, and rewards issued after validation.', storyId: 'tbo-holidays', to: '/solutions/channel-partners', graphic: 'partner' },
  { id: 'influencers', label: 'Influencers', outcome: 'Reward advocates with incentives you can measure.', mechanic: 'Missions, referral rewards and approved budgets.', storyId: 'ola-energy', to: '/solutions/influencers', graphic: 'global' },
];

export function AudienceTabs() {
  const [v, setV] = useState<Aud>('customers');
  const a = AUD.find((x) => x.id === v)!;
  const story = STORIES.find((s) => s.id === a.storyId)!;
  return (
    <Section id="audience" section="audience" tour="audience">
      <SectionHead title="One platform. Three audiences." lead="Pick the audience you serve. See one outcome, one mechanic and one story." />
      <Tabs tabs={AUD.map((x) => ({ id: x.id, label: x.label }))} value={v} onChange={setV} label="Audience" idPrefix="aud" variant="pill" className="mb-6 flex-wrap" />
      <TabPanel idPrefix="aud" id={v} className="grid gap-6 rounded-xl2 border bg-surface p-6 outline-offset-4 sm:p-8 lg:grid-cols-2">
        <div>
          <p className="label-mono">Outcome</p>
          <h3 className="h3 mt-1">{a.outcome}</h3>
          <p className="label-mono mt-5">Mechanic</p>
          <p className="mt-1 text-muted">{a.mechanic}</p>
          <p className="label-mono mt-5">Story</p>
          <blockquote className="mt-1 border-l-2 border-accent pl-4">
            <p className="text-[15px]">“{story.quote}”</p>
            <footer className="mt-2 text-sm text-muted">{story.person}, {story.role}, {story.company}<Flag id="quotes" /><Flag id="storyMatch" /></footer>
          </blockquote>
          <ButtonLink to={a.to} variant="plain" arrow className="mt-5">See the {a.label.toLowerCase()} solution</ButtonLink>
        </div>
        <div className="self-center">
          <Graphic kind={a.graphic} />
        </div>
      </TabPanel>
      <p className="mt-3 text-xs text-muted">Stories are the closest published match. Full list on <Link to="/resources/case-studies" className="link">case studies</Link>.</p>
    </Section>
  );
}
