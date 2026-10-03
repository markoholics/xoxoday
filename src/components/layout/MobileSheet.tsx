import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV } from '@/content/nav';
import { uiStore, useUi } from '@/lib/ui';
import { useFocusTrap } from '@/lib/focus';
import { useReducedMotion } from '@/lib/prefs';
import { t } from '@/lib/motion';
import { startTour } from '@/lib/tour';
import { trackEvent } from '@/lib/events';
import { Logo } from '../ui/Logo';
import { Button, ButtonLink } from '../ui/Button';
import { IconChevron, IconClose } from '../ui/Icons';

/** Full screen sheet. One level of accordions. CTAs pinned at the bottom. */
export function MobileSheet() {
  const { menuOpen } = useUi();
  const { pathname } = useLocation();
  const [acc, setAcc] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const close = () => uiStore.set({ menuOpen: false });
  useFocusTrap(ref, menuOpen, close);
  useEffect(() => close(), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[80] flex flex-col bg-canvas lg:hidden"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={t.base}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
            <Logo className="h-6 w-auto text-ink" />
            <button type="button" onClick={close} aria-label="Close menu" className="rounded-full p-2 hover:bg-sunken">
              <IconClose />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-2">
            <ul className="divide-y">
              {NAV.map((item) =>
                item.columns ? (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-expanded={acc === item.id}
                      aria-controls={`m-${item.id}`}
                      onClick={() => setAcc(acc === item.id ? null : item.id)}
                      className="flex w-full items-center justify-between py-4 text-left text-lg font-medium"
                    >
                      {item.label}
                      <IconChevron className={`text-muted transition-transform duration-200 ${acc === item.id ? 'rotate-180' : ''}`} />
                    </button>
                    <div id={`m-${item.id}`} hidden={acc !== item.id} className="pb-3">
                      <Link to={item.to} className="block py-2 text-sm font-medium text-brand">{item.label} overview</Link>
                      {item.columns.map((c) => (
                        <div key={c.label} className="mb-3">
                          <p className="label-mono mb-1">{c.label}</p>
                          {c.links.map((l) => (
                            <Link key={l.to} to={l.to} className="block rounded-lg py-2">
                              <span className="block text-[15px] font-medium text-brand">{l.label}</span>
                              <span className="block text-[13px] text-muted">{l.detail}</span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li key={item.id}>
                    <Link to={item.to} className="block py-4 text-lg font-medium">{item.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="grid shrink-0 grid-cols-2 gap-3 border-t bg-canvas px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button
              variant="ghost"
              onClick={() => {
                trackEvent('cta_click', { page: pathname, variant: 'sheet', label: 'Take the tour', kind: 'ghost' });
                close();
                startTour('site');
              }}
            >
              Take the tour
            </Button>
            <ButtonLink to="/demo" onClick={() => trackEvent('cta_click', { page: pathname, variant: 'sheet', label: 'Book a demo', kind: 'solid' })}>
              Book a demo
            </ButtonLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
