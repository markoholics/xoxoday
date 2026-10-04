import { useEffect, type ReactNode } from 'react';
import { FAQ } from '@/content/faq';
import { setJsonLd } from '@/lib/seo';
import { CtaPair } from './CtaPair';
import { Accordion } from './Accordion';
import { LastUpdated, Section, SectionHead } from './Section';
import { Reveal } from './Reveal';
import type { CtaKey } from '@/content/cta';

/** Page hero: eyebrow, one outcome headline, lead and the CtaPair. */
export function PageHero({ eyebrow, title, lead, ctaKey, children, section = 'hero', tour }: { eyebrow: string; title: ReactNode; lead?: ReactNode; ctaKey?: CtaKey; children?: ReactNode; section?: string; tour?: string }) {
  return (
    <section data-section={section} data-tour={tour} className="pb-10 pt-14 sm:pb-14 sm:pt-20">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="label-mono mb-4">{eyebrow}</p>
          <h1 className="h1">{title}</h1>
          {lead && <p className="lead mt-5 max-w-2xl">{lead}</p>}
          <CtaPair ctaKey={ctaKey} variant="hero" className="mt-8" />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** Middle of a long page. */
export function MidCta({ ctaKey, title = 'Ready to see it with your numbers?' }: { ctaKey?: CtaKey; title?: string }) {
  return (
    <section className="py-6">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-5 rounded-xl2 border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <p className="text-lg font-medium sm:max-w-xs">{title}</p>
          <CtaPair ctaKey={ctaKey} variant="mid" size="md" />
        </div>
      </div>
    </section>
  );
}

export function ClosingCta({ title = 'See Loyalife run your program.', ctaKey, note = true }: { title?: string; ctaKey?: CtaKey; note?: boolean }) {
  return (
    <section className="py-20 sm:py-28" data-section="closing">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="h2">{title}</h2>
          <CtaPair ctaKey={ctaKey} variant="closing" align="center" className="mt-8" note={note} />
        </Reveal>
      </div>
    </section>
  );
}

/** Short FAQ. Adds FAQPage JSON LD for the questions shown. */
export function PageFaq({ ids, title = 'Questions', id = 'faq', idPrefix = 'faq' }: { ids?: string[]; title?: string; id?: string; idPrefix?: string }) {
  const items = ids ? FAQ.filter((f) => ids.includes(f.id)) : FAQ;
  useEffect(() => {
    setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
    return () => setJsonLd('faq', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids?.join(',')]);
  return (
    <Section id={id} section="faq" tone="plain">
      <SectionHead title={title} />
      <Reveal className="max-w-3xl">
        <Accordion idPrefix={idPrefix} items={items.map((f) => ({ id: f.id, title: f.q, body: f.a }))} />
      </Reveal>
    </Section>
  );
}

export function PageFoot() {
  return (
    <div className="container-x pb-10">
      <LastUpdated />
    </div>
  );
}
