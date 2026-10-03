import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { IconChevron } from './Icons';

export interface AccItem {
  id: string;
  title: ReactNode;
  body: ReactNode;
}

/** One open at a time. Height animates through grid rows (200ms). */
export function Accordion({ items, idPrefix, defaultOpen = null, onOpen }: { items: AccItem[]; idPrefix: string; defaultOpen?: string | null; onOpen?: (id: string) => void }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const { hash } = useLocation();
  useEffect(() => {
    const h = hash.replace('#', '');
    const hit = items.find((i) => `${idPrefix}-${i.id}` === h);
    if (hit) setOpen(hit.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);
  return (
    <div className="divide-y rounded-xl2 border bg-surface">
      {items.map((it) => {
        const o = open === it.id;
        return (
          <div key={it.id} id={`${idPrefix}-${it.id}`}>
            <h3>
              <button
                type="button"
                aria-expanded={o}
                aria-controls={`${idPrefix}-${it.id}-panel`}
                onClick={() => {
                  setOpen(o ? null : it.id);
                  if (!o) onOpen?.(it.id);
                }}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium"
              >
                <span>{it.title}</span>
                <IconChevron className={`shrink-0 text-muted transition-transform duration-200 ease-calm ${o ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            <div
              id={`${idPrefix}-${it.id}-panel`}
              role="region"
              aria-labelledby={undefined}
              className={`grid transition-[grid-template-rows] duration-200 ease-calm ${o ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className={`px-5 pb-5 text-[15px] leading-relaxed text-muted transition-opacity duration-200 ${o ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!o}>
                  {it.body}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
