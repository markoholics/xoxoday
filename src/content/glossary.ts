export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  graphic?: 'points' | 'approval' | 'ledger' | 'ai' | 'global' | 'partner';
}

export const GLOSSARY: GlossaryEntry[] = [
  { id: 'earn-burn', term: 'Earn and burn', definition: 'Members earn points through activity and burn them by redeeming rewards.', graphic: 'points' },
  { id: 'maker-checker', term: 'Maker checker', definition: 'One person proposes a change. A second person approves it before it goes live.', graphic: 'approval' },
  { id: 'reward-ledger', term: 'Reward ledger', definition: 'An idempotent, replayable record of every point issued and redeemed.', graphic: 'ledger' },
  { id: 'tier', term: 'Tier', definition: 'A member level that points move members into. Each tier can carry its own benefits.' },
  { id: 'coalition', term: 'Coalition loyalty', definition: 'A program type where several brands take part in one loyalty program.', graphic: 'global' },
  { id: 'multi-tenant', term: 'Multi-tenant', definition: 'Each program runs independently under one account.' },
  { id: 'anomaly', term: 'Anomaly detection', definition: 'Flags unusual activity, such as a spike in redemptions, for review.', graphic: 'ledger' },
  { id: 'white-label', term: 'White-labelling', definition: 'The member iOS and Android app carries your brand.' },
  { id: 'mcp', term: 'MCP', definition: 'A way for an assistant to call tools. In Loyalife, calls are tenant-isolated and audited.', graphic: 'ai' },
  { id: 'dual-control', term: 'Dual-control', definition: 'Two people must agree before a sensitive change takes effect.', graphic: 'approval' },
];
