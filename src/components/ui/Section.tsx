import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { SITE } from '@/content/site';

export function Section({
  id, section, tour, tone, children, className = '', label,
}: { id?: string; section?: string; tour?: string; tone?: 'sunken' | 'plain'; children: ReactNode; className?: string; label?: string }) {
  return (
    <section
      id={id}
      data-section={section}
      data-tour={tour}
      aria-label={label}
      className={`py-16 sm:py-24 ${tone === 'sunken' ? 'bg-sunken/70' : ''} ${className}`}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, className = '', as: H = 'h2' }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; className?: string; as?: 'h1' | 'h2' }) {
  return (
    <Reveal className={`mb-10 max-w-2xl ${className}`}>
      {eyebrow && <p className="label-mono mb-3">{eyebrow}</p>}
      <H className={H === 'h1' ? 'h1' : 'h2'}>{title}</H>
      {lead && <p className="lead mt-4">{lead}</p>}
    </Reveal>
  );
}

export function LastUpdated() {
  return (
    <p className="label-mono">
      Last updated <time dateTime={SITE.lastUpdatedISO}>{SITE.lastUpdated}</time>
    </p>
  );
}
