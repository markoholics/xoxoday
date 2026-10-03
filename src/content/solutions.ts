export type Role = 'marketers' | 'finance' | 'cx';
export const ROLES: { id: Role; label: string }[] = [
  { id: 'marketers', label: 'Marketers' },
  { id: 'finance', label: 'Finance and risk' },
  { id: 'cx', label: 'CX teams' },
];

export interface SolutionDef {
  slug: string;
  group: 'audience' | 'industry';
  label: string;
  detail: string;
  headline: string;
  outcome: string;
  mechanic: string;
  roles: Record<Role, { text: string; storyId: string }>;
  faqIds: string[];
}

export const SOLUTIONS: SolutionDef[] = [
  {
    slug: 'customers',
    group: 'audience',
    label: 'Customers',
    detail: 'Retain customers and grow basket size',
    headline: 'Keep customers earning and coming back.',
    outcome: 'Members earn on every purchase and redeem for rewards they want.',
    mechanic: 'Points per purchase, tiers that move members up, and campaigns you approve before they run.',
    roles: {
      marketers: { text: 'Launch a customer program in 8 to 12 weeks, not 9 to 12 months. Run points, tiers and campaigns in one place and reach members in 30+ languages. Teams see about 50% fewer marketing tickets.', storyId: 'cbi' },
      finance: { text: 'Every rule and budget change needs a second approver. Every point sits in an idempotent, replayable reward ledger, so a balance traces back to its source.', storyId: 'mutual-trust-bank' },
      cx: { text: 'Members check balance, browse and redeem in a white label iOS and Android app or a WhatsApp bot. Rewards are localized across 150+ countries and 55+ currencies.', storyId: 'cbi' },
    },
    faqIds: ['launch', 'global', 'separate'],
  },
  {
    slug: 'channel-partners',
    group: 'audience',
    label: 'Channel partners',
    detail: 'Dealers, distributors and installers',
    headline: 'Turn dealers and distributors into repeat sellers.',
    outcome: 'Partners earn on every sale and see what they have earned.',
    mechanic: 'Target tiers, claims with proof, and rewards issued after validation.',
    roles: {
      marketers: { text: 'Run a channel program for dealers, distributors and installers. Each program runs independently under one account, so each network gets its own rules.', storyId: 'tbo-holidays' },
      finance: { text: 'Maker checker approvals cover every rule and budget change. Dual-control, an audit trail and anomaly detection watch for unusual claims.', storyId: 'tbo-holidays' },
      cx: { text: 'Partners check balance, browse and redeem from a WhatsApp bot or a white label app, in their own language.', storyId: 'tbo-holidays' },
    },
    faqIds: ['program-types', 'fraud', 'separate'],
  },
  {
    slug: 'influencers',
    group: 'audience',
    label: 'Influencers',
    detail: 'Advocates, missions and referrals',
    headline: 'Reward advocates with incentives you can measure.',
    outcome: 'Advocates complete missions and referrals, and every reward is traceable.',
    mechanic: 'Missions, referral rewards and approved budgets.',
    roles: {
      marketers: { text: 'Set missions and referral rewards for advocates. Launch in weeks and change rules with approval.', storyId: 'ola-energy' },
      finance: { text: 'Approve budgets before a mission starts. Every reward lands in the ledger, and anomaly detection flags unusual spikes.', storyId: 'mutual-trust-bank' },
      cx: { text: 'Advocates see their balance and redeem from a rewards marketplace of 10M+ options in 30+ categories.', storyId: 'ola-energy' },
    },
    faqIds: ['program-types', 'fraud', 'launch'],
  },
  {
    slug: 'banking-and-cards',
    group: 'industry',
    label: 'Banking and cards',
    detail: 'Cardholder engagement and spend',
    headline: 'Give cardholders reasons to use the card.',
    outcome: 'Cardholders earn points on spend and redeem for rewards in their own currency.',
    mechanic: 'Points on card spend, tiers and approved campaigns.',
    roles: {
      marketers: { text: 'Build card programs that give cardholders reasons to spend. Read how Mutual Trust Bank and CBI describe the change.', storyId: 'mutual-trust-bank' },
      finance: { text: 'Security covers PCI-DSS, SOC 2 Type II and ISO 27001, with dual-control approvals, an audit trail and ML fraud controls.', storyId: 'cbi' },
      cx: { text: 'Offer rewards in 30+ languages and 55+ currencies, on a white label app or a WhatsApp bot.', storyId: 'cbi' },
    },
    faqIds: ['data-protection', 'fraud', 'deployment'],
  },
  {
    slug: 'manufacturing-and-channel',
    group: 'industry',
    label: 'Manufacturing and channel',
    detail: 'Repeat sales across partner networks',
    headline: 'Grow repeat sales across your partner network.',
    outcome: 'Partners earn for repeat sales and redeem across countries.',
    mechanic: 'Channel programs with approved rules and validated claims.',
    roles: {
      marketers: { text: 'Run channel programs across partner networks. Each program runs independently under one account.', storyId: 'tbo-holidays' },
      finance: { text: 'Approvals, an audit trail and an idempotent, replayable reward ledger keep partner rewards traceable.', storyId: 'tbo-holidays' },
      cx: { text: 'Give partners a white label app or a WhatsApp bot with rewards localized in 150+ countries.', storyId: 'ola-energy' },
    },
    faqIds: ['program-types', 'integrations', 'global'],
  },
  {
    slug: 'travel-and-energy',
    group: 'industry',
    label: 'Travel and energy',
    detail: 'Booker and fuel retail programs',
    headline: 'Reward bookers and customers across borders.',
    outcome: 'Bookers and customers earn and redeem across countries and currencies.',
    mechanic: 'Cross border programs with localized rewards.',
    roles: {
      marketers: { text: 'Reach bookers and retail customers in 150+ countries. Ola Energy works with Loyalife across 17 countries in Africa.', storyId: 'ola-energy' },
      finance: { text: 'Run one program per market under one account. Approvals and a replayable ledger keep every country auditable.', storyId: 'ola-energy' },
      cx: { text: 'TBO Holidays reports a strong response from agencies, bookers and suppliers across 14 countries on ease of use.', storyId: 'tbo-holidays' },
    },
    faqIds: ['global', 'separate', 'launch'],
  },
];

export const getSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
