import { useState } from 'react';
import { DEMOS, type DemoDef } from '@/content/demos';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section } from '@/components/ui/Section';
import { Overlay } from '@/components/ui/Overlay';
import { DemoPlayer } from '@/components/ui/DemoPlayer';
import { IconPlay } from '@/components/ui/Icons';
import { Flag } from '@/lib/review';

export default function Demos() {
  const [open, setOpen] = useState<DemoDef | null>(null);
  return (
    <>
      <PageHero eyebrow="Resources · Recorded demos" title="Watch it in 90 seconds." lead="Walkthroughs by role. Each one plays an animated walkthrough built in code. Recordings will replace them." ctaKey="resources" />
      <Section id="demos" section="demo-slot" tone="plain" className="!pt-6" label="Demos">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((d) => (
            <li key={d.id}>
              <button type="button" onClick={() => setOpen(d)} className="card card-hover group flex h-full w-full flex-col text-left" aria-label={`Play ${d.title}, ${d.label}`}>
                <span className="relative flex aspect-video items-center justify-center rounded-t-xl2 bg-sunken">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[#0C0A09] transition-transform duration-200 ease-calm group-hover:scale-105"><IconPlay size={18} /></span>
                  <span className="absolute bottom-2 right-2 rounded bg-ink px-1.5 py-0.5 font-mono text-[11px] text-canvas">{d.label}</span>
                </span>
                <span className="p-4">
                  <span className="block font-semibold">{d.title}</span>
                  <span className="mt-1 block text-sm text-muted">{d.blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">Demo slots. <Flag id="demoSlots" /></p>
      </Section>
      <MidCta title="Want a live walkthrough instead?" ctaKey="resources" />
      <PageFaq ids={['launch', 'fraud']} />
      <ClosingCta ctaKey="resources" />
      <PageFoot />
      <Overlay open={!!open} onClose={() => setOpen(null)} label={open?.title ?? 'Demo'} side="center" widthClass="max-w-3xl">
        {open && (
          <div className="p-4 pt-12 sm:p-6 sm:pt-12">
            <h2 className="h3 mb-3">{open.title}</h2>
            <DemoPlayer demo={open} />
          </div>
        )}
      </Overlay>
    </>
  );
}
