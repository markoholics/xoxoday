import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROLES, getSolution, type Role } from '@/content/solutions';
import { STATS, STORIES } from '@/content/site';
import { getDemo } from '@/content/demos';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { DemoPlayer } from '@/components/ui/DemoPlayer';
import { Counter } from '@/components/ui/Counter';
import { Flag } from '@/lib/review';
import { Reveal } from '@/components/ui/Reveal';
import NotFound from './NotFound';

export default function SolutionDetail() {
  const { slug } = useParams();
  const sol = getSolution(slug ?? '');
  const [role, setRole] = useState<Role>('marketers');
  if (!sol) return <NotFound />;
  const r = sol.roles[role];
  const story = STORIES.find((s) => s.id === r.storyId)!;
  const demo = getDemo(`role-${role}`)!;
  return (
    <>
      <PageHero eyebrow={sol.group === 'audience' ? 'Solutions · By audience' : 'Solutions · By industry'} title={sol.headline} lead={sol.outcome} ctaKey="solutions" />
      <Section tone="plain" className="!pt-6" label="Outcome and mechanic">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="card p-6"><p className="label-mono">Outcome</p><p className="mt-2 text-lg font-medium">{sol.outcome}</p></Reveal>
          <Reveal className="card p-6" delay={0.06}><p className="label-mono">Mechanic</p><p className="mt-2 text-lg font-medium">{sol.mechanic}</p></Reveal>
        </div>
      </Section>
      <Section id="role" tone="sunken" label="Show this for my role">
        <SectionHead title="Show this for my role" lead="One emphasis, one story and one demo for the role you play." />
        <Tabs tabs={ROLES.map((x) => ({ id: x.id, label: x.label }))} value={role} onChange={setRole} label="Show this for my role" idPrefix="role" variant="pill" className="mb-6 flex-wrap" />
        <TabPanel idPrefix="role" id={role} className="grid gap-8 outline-offset-4 lg:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed">{r.text}<Flag id="benchmarks" /></p>
            <blockquote className="mt-6 border-l-2 border-accent pl-4">
              <p>“{story.quote}”</p>
              <footer className="mt-2 text-sm text-muted">{story.person}, {story.role}, {story.company}<Flag id="quotes" /><Flag id="storyMatch" /></footer>
              <Link to={`/resources/case-studies/${story.id}`} className="link mt-2 inline-block text-sm">Read the {story.company} story</Link>
            </blockquote>
          </div>
          <div id="demo-slot" data-section="demo-slot">
            <p className="label-mono mb-2">90 second demo · {ROLES.find((x) => x.id === role)!.label}</p>
            <DemoPlayer key={role} demo={demo} />
          </div>
        </TabPanel>
      </Section>
      <MidCta title={`Want to see ${sol.label.toLowerCase()} programs with your rules?`} ctaKey="solutions" />
      <Section label="Proof">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.id} className="border-l-2 border-accent pl-4">
              <div className="text-3xl font-semibold tracking-tight"><Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} /><Flag id={s.flag} /></div>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>
      <PageFaq ids={sol.faqIds} />
      <ClosingCta ctaKey="solutions" />
      <PageFoot />
    </>
  );
}
