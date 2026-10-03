export interface Pillar {
  id: 'programs' | 'members' | 'engagement' | 'rewards' | 'reports';
  label: string;
  line: string;
}

export const PILLARS: Pillar[] = [
  { id: 'programs', label: 'Loyalty programs', line: 'Run enterprise multi brand, channel, influencer, omnichannel and coalition programs.' },
  { id: 'members', label: 'Member management', line: 'Manage 65M+ members. Each program runs independently under one account.' },
  { id: 'engagement', label: 'Member engagement', line: 'Reach members in 30+ languages through a white label iOS and Android app or a WhatsApp bot.' },
  { id: 'rewards', label: 'Loyalty rewards', line: 'Offer a marketplace of 10M+ options in 30+ categories across 150+ countries.' },
  { id: 'reports', label: 'Reports and insights', line: 'Trace every point through an idempotent, replayable reward ledger.' },
];

export const SUBPAGES = [
  { to: '/platform/infrastructure', label: 'Infrastructure, white-labelling & deployment', line: 'Run Loyalife where your risk team wants it.' },
  { to: '/platform/ai-mcp', label: 'Loyalife AI & MCP', line: 'AI that drafts and watches. People who decide.' },
  { to: '/platform/security', label: 'Security, fraud & governance', line: 'Every change approved. Every point traceable.' },
  { to: '/platform/apis', label: 'APIs', line: 'REST first. Built for your stack.' },
];

export const REGIONS_REWARD = [
  { id: 'global', label: 'Global', currency: 'USD', note: 'Sample view across regions. Loyalife supports 55+ currencies.' },
  { id: 'americas', label: 'Americas', currency: 'USD', note: 'Sample view in US dollars.' },
  { id: 'europe', label: 'Europe', currency: 'EUR', note: 'Sample view in euros.' },
  { id: 'mea', label: 'Middle East and Africa', currency: 'AED', note: 'Sample view in UAE dirhams.' },
  { id: 'apac', label: 'Asia Pacific', currency: 'SGD', note: 'Sample view in Singapore dollars.' },
] as const;

export type RegionId = (typeof REGIONS_REWARD)[number]['id'];

// Sample ordering and sample values, not data.
export const REWARD_ORDER: Record<RegionId, string[]> = {
  global: ['Dining', 'Travel', 'Electronics', 'Mobile top up', 'Subscriptions', 'Charity', 'Experiences', 'Merchandise'],
  americas: ['Dining', 'Subscriptions', 'Travel', 'Electronics', 'Experiences', 'Merchandise', 'Charity', 'Mobile top up'],
  europe: ['Travel', 'Experiences', 'Dining', 'Subscriptions', 'Electronics', 'Charity', 'Merchandise', 'Mobile top up'],
  mea: ['Mobile top up', 'Dining', 'Electronics', 'Travel', 'Merchandise', 'Experiences', 'Subscriptions', 'Charity'],
  apac: ['Mobile top up', 'Electronics', 'Dining', 'Subscriptions', 'Travel', 'Merchandise', 'Experiences', 'Charity'],
};

export const REWARD_SAMPLE_VALUE: Record<string, number> = {
  Dining: 25, Travel: 100, Electronics: 150, 'Mobile top up': 10, Subscriptions: 15, Charity: 20, Experiences: 75, Merchandise: 40,
};
