import { Link } from 'react-router-dom';
import { SOLUTIONS, ROLES, type Role } from '@/content/solutions';
import { getDemo } from '@/content/demos';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Tabs } from '@/components/ui/Tabs';
import { DemoPlayer } from '@/components/ui/DemoPlayer';
import { useState } from 'react';

function Group({ title, group }: { title: string; group: 'audience' | 'industry' }) {
  return (
    <div>
      <h3 className="label-mono mb-4">{title}</h3>
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SOLUTIONS.filter((s) => s.group === group).map((s) => (
          <RevealItem key={s.slug}>
            <Link to={`/solutions/${s.slug}`} className="card card-hover block h-full p-5">
              <span className="text-lg font-semibold text-brand">{s.label}</span>
              <span className="mt-1 block text-sm text-muted">{s.detail}</span>
              <span className="mt-3 block text-sm">{s.headline}</span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export default function SolutionsIndex() {
  const [role, setRole] = useState<Role>('marketers');
  return (
    <>
      <PageHero eyebrow="Solutions" title="A program for every audience and industry." lead="Pick the audience you serve or the industry you work in. Each page shows one outcome and one mechanic." ctaKey="solutions" />
      <Section tone="plain" label="Solutions" className="!pt-6">
        <div className="space-y-12">
          <Group title="By audience" group="audience" />
          <Group title="By industry" group="industry" />
        </div>
      </Section>
      <MidCta title="Not sure where to start?" ctaKey="solutions" />
      <Section id="demo-slot" section="demo-slot" tone="sunken">
        <SectionHead title="A 90 second demo for your role" />
        <Tabs tabs={ROLES.map((r) => ({ id: r.id, label: r.label }))} value={role} onChange={setRole} label="Show this for my role" idPrefix="roleidx" variant="pill" className="mb-5 flex-wrap" />
        <div className="max-w-3xl"><DemoPlayer key={role} demo={getDemo(`role-${role === 'finance' ? 'finance' : role}`)!} /></div>
      </Section>
      <PageFaq ids={['program-types', 'launch', 'global']} />
      <ClosingCta ctaKey="solutions" />
      <PageFoot />
    </>
  );
}
