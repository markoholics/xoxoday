import { KNOWLEDGE, type Snippet } from '@/content/knowledge';
import { FAQ } from '@/content/faq';
import { GLOSSARY } from '@/content/glossary';
import { SOLUTIONS } from '@/content/solutions';
import { features } from '@/config/features';

export interface Citation {
  id: string;
  title: string;
  href: string;
  anchor?: string;
}

export interface ConciergeAnswer {
  matched: boolean;
  text: string;
  citations: Citation[];
  followups: string[];
}

/**
 * Contract for Ask Loyalife. A real model implementation may replace the local retrieval later.
 * It must only be given the snippets returned by retrieve(), and it must return citations
 * that point at those snippets (see assertCitations).
 */
export interface Concierge {
  ask(question: string): Promise<ConciergeAnswer>;
}

export const NO_MATCH = "I don't have that on this site yet";

const STOP = new Set('a an and are as at be by can do does for from how i in is it its me my of on or our so than that the their them then there these they this to us was we what when where which who why will with you your about tell show give any'.split(' '));
const SYN: Record<string, string[]> = {
  price: ['pricing'], cost: ['pricing', 'cost'], costs: ['pricing', 'cost'], cheap: ['pricing'], fee: ['pricing'],
  safe: ['security'], secure: ['security'], gdpr: ['privacy', 'consent'], privacy: ['consent', 'deletion', 'security'],
  hosting: ['deployment'], premise: ['on-prem'], premises: ['on-prem'],
  integrate: ['integrations'], connect: ['integrations'], crm: ['integrations', 'salesforce'],
  fraud: ['fraud', 'anomaly', 'governance'], misuse: ['fraud', 'anomaly'], abuse: ['fraud', 'anomaly'],
  whatsapp: ['whatsapp'], app: ['app'], mobile: ['app'],
  approve: ['approval', 'maker'], approvals: ['approval', 'maker'],
  genai: ['ai'], chatbot: ['ai'], llm: ['llm', 'ai'],
};

const stem = (w: string) => (w.length > 4 ? w.replace(/ies$/, 'y').replace(/(ing|ed|es|s)$/, '') : w);
function tokens(s: string): string[] {
  const raw = s.toLowerCase().replace(/[^a-z0-9+\-\s]/g, ' ').split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of raw) {
    if (STOP.has(w)) continue;
    out.push(stem(w));
    for (const x of SYN[w] ?? []) out.push(stem(x));
  }
  return out;
}

function corpus(): (Snippet & { _t: Set<string>; _k: Set<string>; _title: Set<string> })[] {
  const extra: Snippet[] = [
    ...FAQ.map((f) => ({ id: 'faq-' + f.id, title: f.q, text: f.a, href: '/resources/faq', anchor: 'faq-' + f.id, keywords: f.keywords })),
    ...GLOSSARY.map((g) => ({ id: 'term-' + g.id, title: g.term, text: g.definition, href: '/resources/faq', anchor: 'glossary', keywords: [g.term.toLowerCase(), 'what is', 'meaning', 'define'] })),
    ...SOLUTIONS.map((s) => ({ id: 'sol-' + s.slug, title: s.label + ' solution', text: `${s.headline} ${s.outcome} ${s.mechanic}`, href: '/solutions/' + s.slug, keywords: [s.label.toLowerCase(), s.slug.replace(/-/g, ' '), 'solution'] })),
  ];
  return [...KNOWLEDGE, ...extra].map((s) => ({
    ...s,
    _title: new Set(tokens(s.title)),
    _k: new Set(s.keywords.flatMap(tokens)),
    _t: new Set(tokens(s.text)),
  }));
}

let CORPUS: ReturnType<typeof corpus> | null = null;

/** Keyword retrieval over site content. Returns only snippets. */
export function retrieve(question: string, limit = 3): { snippet: Snippet; score: number }[] {
  CORPUS = CORPUS ?? corpus();
  const q = tokens(question);
  if (!q.length) return [];
  const scored = CORPUS.map((s) => {
    let score = 0;
    for (const w of new Set(q)) {
      if (s._title.has(w)) score += 3;
      if (s._k.has(w)) score += 2.5;
      if (s._t.has(w)) score += 1;
    }
    return { snippet: s as Snippet, score };
  })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

function toCitation(s: Snippet): Citation {
  return { id: s.id, title: s.title, href: s.href, anchor: s.anchor };
}

export const localConcierge: Concierge = {
  async ask(question) {
    const hits = retrieve(question, 3);
    await new Promise((r) => setTimeout(r, 250));
    if (!hits.length) {
      return { matched: false, text: NO_MATCH + '.', citations: [], followups: ['How fast can we launch?', 'Which program types can Loyalife run?', 'What deployment options exist?'] };
    }
    const best = hits[0];
    const parts = [best.snippet.text];
    const second = hits.find((h, i) => i > 0 && h.score >= best.score * 0.7 && !h.snippet.id.startsWith('term-'));
    if (second && second.snippet.text !== best.snippet.text) parts.push(second.snippet.text);
    const used = [best, ...(second ? [second] : [])];
    const follow = (best.snippet.followups ?? []).slice(0, 2);
    return { matched: true, text: parts.join(' '), citations: used.map((h) => toCitation(h.snippet)), followups: follow };
  },
};

/** Guard for any model backed concierge: citations must come from the supplied snippets. */
export function assertCitations(answer: ConciergeAnswer, allowed: Snippet[]): ConciergeAnswer {
  const ids = new Set(allowed.map((a) => a.id));
  const citations = answer.citations.filter((c) => ids.has(c.id));
  if (!citations.length) return { matched: false, text: NO_MATCH + '.', citations: [], followups: [] };
  return { ...answer, citations };
}

/** Stub for a model backed concierge. Wire a real model here. Give it ONLY retrieve() snippets. */
export const modelConcierge: Concierge = {
  async ask(question) {
    const snippets = retrieve(question, 5).map((h) => h.snippet);
    // A real implementation sends `question` and `snippets` (and nothing else) to the model,
    // then returns assertCitations(result, snippets). Until then, fall back to local retrieval.
    void snippets;
    return localConcierge.ask(question);
  },
};

export function getConcierge(): Concierge {
  return features.aiMode ? modelConcierge : localConcierge;
}
