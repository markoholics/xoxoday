import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Graphic } from '../graphics';
import type { GraphicKey } from '@/content/tours';

/** Tooltip shown on hover, focus and tap. Escape closes. */
export function useTip() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };
  return { open, setOpen, id, wrapRef, show, hide };
}

export function TipBubble({ id, open, title, children, graphic, align = 'left' }: { id: string; open: boolean; title?: string; children: ReactNode; graphic?: GraphicKey; align?: 'left' | 'center' | 'right' }) {
  if (!open) return null;
  const pos = align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'right' ? 'right-0' : 'left-0';
  return (
    <span
      role="tooltip"
      id={id}
      className={`absolute top-full z-40 mt-2 block w-64 max-w-[80vw] rounded-xl border bg-surface p-3 text-left text-sm font-normal normal-case leading-snug tracking-normal text-ink shadow-soft ${pos}`}
    >
      {title && <span className="mb-1 block font-semibold">{title}</span>}
      <span className="block text-muted">{children}</span>
      {graphic && (
        <span className="mt-2 block">
          <Graphic kind={graphic} compact />
        </span>
      )}
    </span>
  );
}
