export interface FaqItem {
  id: string;
  q: string;
  a: string;
  keywords: string[];
}

export const FAQ: FaqItem[] = [
  {
    id: 'launch',
    q: 'How fast can we launch?',
    a: 'Launch to first redemption takes 8 to 12 weeks. An in house build takes 9 to 12 months and needs 3 to 5 engineers. Loyalife needs 0 to 1 FTE at steady state.',
    keywords: ['launch', 'time', 'weeks', 'months', 'speed', 'fast', 'build', 'in house', 'engineers', 'fte', 'staff'],
  },
  {
    id: 'program-types',
    q: 'Which program types can Loyalife run?',
    a: 'Loyalife runs enterprise multi brand, channel, influencer, omnichannel and coalition programs. Members can use a white label iOS and Android app or a WhatsApp bot to check balance, browse and redeem.',
    keywords: ['program', 'types', 'channel', 'influencer', 'coalition', 'omnichannel', 'multi brand', 'whatsapp', 'app', 'mobile'],
  },
  {
    id: 'separate',
    q: 'Can we run programs separately?',
    a: 'Yes. Loyalife is multi-tenant. Each program runs independently under one account.',
    keywords: ['separate', 'independent', 'multi-tenant', 'tenant', 'tenancy', 'account', 'brands'],
  },
  {
    id: 'fraud',
    q: 'How do you handle fraud and misuse?',
    a: 'Every change goes through maker checker approvals, with dual-control and an audit trail. The reward ledger is idempotent and replayable. Anomaly detection and ML fraud controls flag unusual activity.',
    keywords: ['fraud', 'misuse', 'abuse', 'risk', 'anomaly', 'ledger', 'audit', 'maker', 'checker', 'approval', 'dual-control', 'governance'],
  },
  {
    id: 'global',
    q: 'How many countries, languages and currencies do you cover?',
    a: 'Loyalife serves 150+ countries with localized rewards, 30+ languages and 55+ currencies. The rewards marketplace holds 10M+ options in 30+ categories.',
    keywords: ['countries', 'languages', 'currencies', 'global', 'international', 'localized', 'rewards', 'catalog', 'marketplace', 'options', 'categories'],
  },
  {
    id: 'deployment',
    q: 'What deployment options exist?',
    a: 'Loyalife runs on-prem, hybrid and cloud. It supports VPC, Active-Active DR, multi-tenant and white-labelling.',
    keywords: ['deployment', 'on-prem', 'hybrid', 'cloud', 'vpc', 'dr', 'disaster', 'active-active', 'white-label', 'hosting', 'infrastructure'],
  },
  {
    id: 'integrations',
    q: 'Which systems does Loyalife integrate with?',
    a: 'Integrations include Salesforce, Shopify, HubSpot, MoEngage, Stripe, Twilio, Magento and Microsoft Dynamics. APIs are REST-first, with OAuth 2.0 to JWT for members, transactions and points.',
    keywords: ['integrations', 'integrate', 'api', 'salesforce', 'shopify', 'hubspot', 'moengage', 'stripe', 'twilio', 'magento', 'dynamics', 'rest', 'oauth', 'jwt', 'crm'],
  },
  {
    id: 'data-protection',
    q: 'How do you protect data?',
    a: 'Security covers PCI-DSS, SOC 2 Type II, ISO 27001, dual-control, audit and ML fraud. Consent, access and deletion workflows run by channel. Request the security pack for detail.',
    keywords: ['data', 'protection', 'privacy', 'security', 'pci', 'soc', 'iso', 'certification', 'consent', 'deletion', 'access', 'compliance', 'residency'],
  },
];
