import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, type NavItemDef } from '@/content/nav';
import { panel, panelItem } from '@/lib/motion';
import { useReducedMotion } from '@/lib/prefs';
import { openPalette, uiStore, useUi } from '@/lib/ui';
import { startTour } from '@/lib/tour';
import { trackEvent } from '@/lib/events';
import { Logo } from '../ui/Logo';
import { Button, ButtonLink } from '../ui/Button';
import { IconMenu, IconSearch } from '../ui/Icons';
import { ThemeToggle } from './ThemeToggle';
import { ExplorerRing } from '../explorer/ExplorerRing';
import { MobileSheet } from './MobileSheet';

function MegaPanel({ item, onClose }: { item: NavItemDef; onClose: (focusTrigger: boolean) => void }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const onKey = (e: KeyboardEvent) => {
    const links = Array.from(ref.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      links[Math.min(i + 1, links.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (i <= 0) onClose(true);
      else links[i - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose(true);
    }
  };
  return (
    <motion.div
      ref={ref}
      id={`menu-${item.id}`}
      role="group"
      aria-label={`${item.label} menu`}
      onKeyDown={onKey}
      variants={reduced ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } } : panel}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute left-1/2 top-full z-50 w-[min(720px,calc(100vw-2rem))] origin-top -translate-x-1/2 rounded-xl2 border bg-surface shadow-soft"
    >
      <div className="grid grid-cols-2 divide-x">
        {item.columns!.map((col) => (
          <motion.div key={col.label} variants={reduced ? undefined : panelItem} className="p-4">
            <p className="px-2 pb-2 text-sm font-semibold text-ink">{col.label}</p>
            <ul className="space-y-0.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} onClick={() => onClose(false)} className="block rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-sunken focus-visible:bg-sunken">
                    <span className="block text-[15px] font-medium text-brand">{l.label}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{l.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<number>();
  const skipFocus = useRef(false);
  const triggers = useRef<Record<string, HTMLAnchorElement | null>>({});
  const { menuOpen } = useUi();

  useEffect(() => setOpen(null), [pathname]);

  const schedule = (id: string | null, delay = 120) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(id), delay);
  };
  const close = (focusTrigger: boolean) => {
    const id = open;
    window.clearTimeout(timer.current);
    setOpen(null);
    if (focusTrigger && id) {
      skipFocus.current = true;
      triggers.current[id]?.focus();
      window.setTimeout(() => (skipFocus.current = false), 80);
    }
  };

  const onTriggerKey = (e: KeyboardEvent, item: NavItemDef, idx: number) => {
    if (e.key === 'ArrowDown' && item.columns) {
      e.preventDefault();
      setOpen(item.id);
      window.setTimeout(() => document.querySelector<HTMLAnchorElement>(`#menu-${item.id} a`)?.focus(), 60);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const n = NAV[(idx + (e.key === 'ArrowRight' ? 1 : NAV.length - 1)) % NAV.length];
      triggers.current[n.id]?.focus();
    } else if (e.key === 'Escape') {
      close(true);
    }
  };

  const openItem = NAV.find((n) => n.id === open && n.columns);

  return (
    <header className="sticky top-0 z-50 border-b bg-canvas/90 backdrop-blur" data-no-print>
      <div className="container-x relative flex h-16 items-center justify-between gap-3">
        <Link to="/" aria-label="Loyalife by Xoxoday, home" className="flex shrink-0 items-center gap-2.5">
          <Logo className="h-6 w-auto text-ink" title="Xoxoday" />
          <span aria-hidden className="h-4 w-px bg-ink/25" />
          <span className="text-[15px] font-semibold tracking-tight">Loyalife</span>
        </Link>

        <nav aria-label="Primary" data-tour="nav" className="hidden h-full lg:block" onMouseLeave={() => schedule(null)}>
          <ul className="flex h-full items-center gap-1">
            {NAV.map((item, idx) => {
              const active = pathname === item.to || pathname.startsWith(item.to + '/');
              const expanded = open === item.id;
              return (
                <li
                  key={item.id}
                  className="flex h-full items-center"
                  onMouseEnter={() => schedule(item.columns ? item.id : null)}
                  onFocus={() => item.columns && !skipFocus.current && schedule(item.id, 0)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node) && !document.getElementById(`menu-${item.id}`)?.contains(e.relatedTarget as Node)) schedule(null, 0);
                  }}
                >
                  <NavLink
                    to={item.to}
                    ref={(el) => (triggers.current[item.id] = el)}
                    aria-haspopup={item.columns ? 'true' : undefined}
                    aria-expanded={item.columns ? expanded : undefined}
                    aria-controls={item.columns ? `menu-${item.id}` : undefined}
                    onKeyDown={(e) => onTriggerKey(e, item, idx)}
                    className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-200 ease-calm ${expanded || active ? 'bg-sunken text-ink' : 'text-ink/80 hover:bg-sunken hover:text-ink'}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
          {/* Panel lives outside li so it can center under the whole bar. Pointer stays inside nav. */}
          <AnimatePresence>
            {openItem && (
              <div onMouseEnter={() => window.clearTimeout(timer.current)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node) && !(e.relatedTarget as HTMLElement | null)?.closest?.('nav')) schedule(null, 0); }}>
                <MegaPanel key={openItem.id} item={openItem} onClose={close} />
              </div>
            )}
          </AnimatePresence>
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search (Ctrl or Cmd plus K)"
            aria-keyshortcuts="Control+K Meta+K"
            className="rounded-full p-2 text-ink transition-colors duration-200 hover:bg-sunken"
          >
            <IconSearch />
          </button>
          <ExplorerRing />
          <ThemeToggle />
          <div className="ml-1 hidden items-center gap-2 lg:flex">
            <Button
              variant="ghost"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => {
                trackEvent('cta_click', { page: pathname, variant: 'header', label: 'Take the tour', kind: 'ghost' });
                startTour('site');
              }}
            >
              Take the tour
            </Button>
            <ButtonLink to="/demo" size="sm" className="whitespace-nowrap" onClick={() => trackEvent('cta_click', { page: pathname, variant: 'header', label: 'Book a demo', kind: 'solid' })}>
              Book a demo
            </ButtonLink>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-ink hover:bg-sunken lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => uiStore.set({ menuOpen: true })}
          >
            <IconMenu />
          </button>
        </div>
      </div>
      <MobileSheet />
    </header>
  );
}
