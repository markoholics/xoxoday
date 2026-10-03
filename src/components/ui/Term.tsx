import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { GLOSSARY } from '@/content/glossary';
import { TipBubble, useTip } from './Tip';
import { Flag } from '@/lib/review';

const claimed = new Map<string, Set<string>>();
const TermCtx = createContext(true);
export const TermProvider = ({ children }: { children: ReactNode }) => <TermCtx.Provider value>{children}</TermCtx.Provider>;

/** Glossary term. Dotted underline and a one sentence definition. Only the first use per page is underlined. */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  useContext(TermCtx);
  const { pathname } = useLocation();
  const entry = GLOSSARY.find((g) => g.id === id);
  const [first, setFirst] = useState(true);
  const tip = useTip();
  const mine = useRef(Symbol(id));
  useLayoutEffect(() => {
    const set = claimed.get(pathname) ?? new Set<string>();
    claimed.set(pathname, set);
    if (set.has(id)) {
      setFirst(false);
    } else {
      set.add(id);
      setFirst(true);
    }
    return () => {
      // release only if we were the claimer
      if (first) claimed.get(pathname)?.delete(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, id]);
  void mine;
  if (!entry) return <>{children}</>;
  if (!first) return <>{children ?? entry.term}</>;
  return (
    <span ref={tip.wrapRef} className="relative inline" onMouseEnter={tip.show} onMouseLeave={tip.hide}>
      <button
        type="button"
        className="term inline p-0 text-inherit"
        aria-describedby={tip.open ? tip.id : undefined}
        onFocus={tip.show}
        onBlur={tip.hide}
        onClick={() => tip.setOpen(!tip.open)}
      >
        {children ?? entry.term}
      </button>
      <TipBubble id={tip.id} open={tip.open} title={entry.term} graphic={entry.graphic}>
        {entry.definition}
        <Flag id="glossary" />
      </TipBubble>
    </span>
  );
}
