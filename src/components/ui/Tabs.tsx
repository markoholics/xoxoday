import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface TabDef<T extends string> {
  id: T;
  label: string;
}

/** Accessible tablist with roving tabindex and arrow keys. Render panels with TabPanel. */
export function Tabs<T extends string>({
  tabs, value, onChange, label, idPrefix, className = '', variant = 'underline',
}: {
  tabs: TabDef<T>[]; value: T; onChange: (v: T) => void; label: string; idPrefix: string; className?: string; variant?: 'underline' | 'pill';
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === value);
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n >= 0) {
      e.preventDefault();
      onChange(tabs[n].id);
      refs.current[tabs[n].id]?.focus();
    }
  };
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKey} className={`flex gap-1 overflow-x-auto ${variant === 'underline' ? 'border-b' : ''} ${className}`}>
      {tabs.map((t) => {
        const sel = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => (refs.current[t.id] = el)}
            role="tab"
            id={`${idPrefix}-tab-${t.id}`}
            aria-selected={sel}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={sel ? 0 : -1}
            type="button"
            onClick={() => onChange(t.id)}
            className={
              variant === 'underline'
                ? `relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-calm ${sel ? 'text-ink' : 'text-muted hover:text-ink'}`
                : `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-calm ${sel ? 'border-ink bg-ink text-canvas' : 'border-line bg-surface text-ink hover:border-ink/50'}`
            }
          >
            {t.label}
            {variant === 'underline' && sel && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-ink" />}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ idPrefix, id, children, className = '' }: { idPrefix: string; id: string; children: ReactNode; className?: string }) {
  return (
    <div role="tabpanel" id={`${idPrefix}-panel-${id}`} aria-labelledby={`${idPrefix}-tab-${id}`} tabIndex={0} className={className}>
      {children}
    </div>
  );
}
