import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CUSTOMERS, CUSTOMER_FILTERS, STATS, type IndustryTag } from '@/content/site';
import { Counter } from '../ui/Counter';
import { Chip } from '../ui/Bits';
import { Section } from '../ui/Section';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal';
import { Flag } from '@/lib/review';
import { t } from '@/lib/motion';

export function ProofBand() {
  const [f, setF] = useState<'all' | IndustryTag>('all');
  const list = CUSTOMERS.filter((c) => f === 'all' || c.tag === f);
  return (
    <Section id="proof" section="proof" tour="proof" tone="sunken">
      <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <RevealItem key={s.id}>
            <div className="border-l-2 border-accent pl-4">
              <div className="text-3xl font-semibold tracking-tight sm:text-4xl">
                <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                <Flag id={s.flag} />
              </div>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Trusted by banks, partner networks and travel brands</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter customers by industry">
            {CUSTOMER_FILTERS.map((x) => (
              <Chip key={x.id} active={f === x.id} onClick={() => setF(x.id)}>{x.label}</Chip>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={f} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t.base} className="mt-6 flex flex-wrap gap-x-2 gap-y-2" aria-label="Customer names">
            {list.map((c) => (
              <li key={c.name} className="rounded-lg border bg-surface px-3 py-1.5 text-sm text-ink/90">{c.name}</li>
            ))}
          </motion.ul>
        </AnimatePresence>
        <p className="mt-4 text-xs text-muted">Replace with approved logos. <Flag id="logos" /><Flag id="logoCategories" /></p>
      </Reveal>
    </Section>
  );
}
