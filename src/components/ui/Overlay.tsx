import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/lib/focus';
import { useReducedMotion } from '@/lib/prefs';
import { t } from '@/lib/motion';
import { useMediaQuery } from '@/lib/hooks';
import { IconClose } from './Icons';

type Side = 'right' | 'center' | 'bottom';

/** Modal, side drawer or bottom sheet. Traps focus. Escape closes. On phones the drawer becomes a bottom sheet. */
export function Overlay({
  open, onClose, label, side = 'right', children, widthClass = 'max-w-md', hideClose,
}: { open: boolean; onClose: () => void; label: string; side?: Side; children: ReactNode; widthClass?: string; hideClose?: boolean }) {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 639px)');
  const eff: Side = isMobile && side === 'right' ? 'bottom' : side;
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  if (typeof document === 'undefined') return null;
  const initial = reduced ? { opacity: 0 } : eff === 'right' ? { opacity: 0, x: 32 } : eff === 'bottom' ? { opacity: 0, y: 40 } : { opacity: 0, scale: 0.98 };
  const shown = { opacity: 1, x: 0, y: 0, scale: 1 };
  const pos =
    eff === 'right'
      ? `fixed inset-y-0 right-0 w-full ${widthClass} border-l`
      : eff === 'bottom'
        ? 'fixed inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl border-t'
        : `fixed left-1/2 top-1/2 w-[calc(100%-2rem)] ${widthClass} max-h-[88vh] -translate-x-1/2 -translate-y-1/2 rounded-xl2 border`;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="overlay-root fixed inset-0 z-[70]">
          <motion.div
            className="no-print absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={t.base}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={`${pos} overflow-y-auto bg-surface shadow-soft`}
            initial={initial}
            animate={shown}
            exit={initial}
            transition={t.slow}
          >
            {!hideClose && (
              <button type="button" onClick={onClose} aria-label="Close" className="no-print absolute right-3 top-3 z-10 rounded-full p-2 text-muted hover:bg-sunken hover:text-ink">
                <IconClose />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
