import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConcierge, type ConciergeAnswer } from '@/lib/concierge';
import { trackEvent } from '@/lib/events';
import { goTo } from '@/lib/nav';
import { closeGuide, uiStore, useUi } from '@/lib/ui';
import { Flag } from '@/lib/review';
import { AiStatus, Skeleton } from '../ui/Bits';
import { Button } from '../ui/Button';
import { IconSend } from '../ui/Icons';

interface Msg {
  q: string;
  a?: ConciergeAnswer;
}

const START = ['How fast can we launch?', 'What deployment options exist?', 'How do you handle fraud and misuse?'];

/** Ask Loyalife. Answers are composed only from matched site snippets, with citations. */
export function AskTab() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [val, setVal] = useState('');
  const nav = useNavigate();
  const { askQuery, askNonce } = useUi();
  const end = useRef<HTMLDivElement>(null);
  const lastNonce = useRef(0);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text) return;
    setMsgs((m) => [...m, { q: text }]);
    setVal('');
    const a = await getConcierge().ask(text);
    trackEvent('concierge_ask', { query: text, matched: a.matched });
    setMsgs((m) => m.map((x, i) => (i === m.length - 1 && x.q === text && !x.a ? { ...x, a } : x)));
  };

  useEffect(() => {
    if (askNonce && askNonce !== lastNonce.current && askQuery) {
      lastNonce.current = askNonce;
      void ask(askQuery);
      uiStore.set({ askQuery: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askNonce]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [msgs]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(val);
  };

  return (
    <div className="flex h-full min-h-[320px] flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold">Ask Loyalife</h3>
        <AiStatus id="concierge" />
        <Flag id="concierge" />
      </div>
      <p className="mt-1 text-xs text-muted">Answers come from this site only. Local keyword search, no live model.</p>

      <div className="mt-3 flex-1 space-y-4" aria-live="polite">
        {!msgs.length && (
          <ul className="flex flex-wrap gap-2">
            {START.map((s) => (
              <li key={s}><button type="button" onClick={() => ask(s)} className="rounded-full border px-3 py-1.5 text-left text-sm hover:border-ink/50">{s}</button></li>
            ))}
          </ul>
        )}
        {msgs.map((m, i) => (
          <div key={i} className="space-y-2">
            <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-sm text-canvas">{m.q}</p>
            {!m.a ? (
              <div className="space-y-2"><Skeleton className="h-3 w-4/5" /><Skeleton className="h-3 w-3/5" /></div>
            ) : (
              <div className="rounded-2xl rounded-bl-md border bg-surface p-3 text-sm">
                <p className="leading-relaxed">{m.a.text}</p>
                {m.a.citations.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted">Sources</span>
                    {m.a.citations.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { closeGuide(); goTo(nav, c.href, c.anchor); }}
                        className="rounded-full border px-2.5 py-0.5 text-xs text-brand hover:border-brand"
                      >
                        {c.title}
                      </button>
                    ))}
                  </p>
                )}
                {!m.a.matched && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => { closeGuide(); nav('/demo'); }}>Book a demo</Button>
                    <Button size="sm" variant="ghost" onClick={() => { closeGuide(); nav('/resources/faq'); }}>Browse the FAQ</Button>
                  </div>
                )}
                {m.a.followups.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {m.a.followups.map((f) => (
                      <li key={f}><button type="button" onClick={() => ask(f)} className="rounded-full bg-sunken px-2.5 py-1 text-xs hover:bg-ink/10">{f}</button></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>

      <form onSubmit={submit} className="sticky bottom-0 mt-3 flex gap-2 bg-surface pt-2">
        <label htmlFor="ask-input" className="sr-only">Ask a question about Loyalife</label>
        <input id="ask-input" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Ask about launch time, security, APIs" autoFocus className="h-11 min-w-0 flex-1 rounded-full border bg-canvas px-4 text-sm" />
        <Button type="submit" size="md" className="!px-3.5" aria-label="Send question"><IconSend size={16} /></Button>
      </form>
    </div>
  );
}
