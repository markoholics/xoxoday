/** Facts you may use. Nothing outside this file's facts is published as a claim. */
export const SITE = {
  name: 'Loyalife by Xoxoday',
  short: 'Loyalife',
  url: 'https://loyalife.example', // PLACEHOLDER, see CONFIRM.md
  lastUpdated: 'October 3, 2026',
  lastUpdatedISO: '2026-10-03',
  legal: '© 2026 Nreach Online Services Pvt Ltd. All rights reserved.',
};

export interface Stat {
  id: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
  flag: 'members' | 'rewardsDistributed' | 'countries' | 'uptime';
}

export const STATS: Stat[] = [
  { id: 'members', value: 65, suffix: 'M+', label: 'members managed', flag: 'members' },
  { id: 'rewards', value: 5, prefix: '$', suffix: 'B+', label: 'rewards distributed to date', flag: 'rewardsDistributed' },
  { id: 'countries', value: 150, suffix: '+', label: 'countries with localized rewards', flag: 'countries' },
  { id: 'uptime', value: 99.99, decimals: 2, suffix: '%', label: 'platform uptime, SLA backed', flag: 'uptime' },
];

export type IndustryTag = 'banking' | 'channel' | 'travel';

export const CUSTOMER_FILTERS: { id: 'all' | IndustryTag; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'banking', label: 'Banking and cards' },
  { id: 'channel', label: 'Channel and manufacturing' },
  { id: 'travel', label: 'Travel and energy' },
];

// Industry tags are our own grouping. Names without a tag show under All only.
export const CUSTOMERS: { name: string; tag?: IndustryTag }[] = [
  { name: 'AAT' },
  { name: 'Access' },
  { name: 'Al Masraf', tag: 'banking' },
  { name: 'Alkem Laboratories', tag: 'channel' },
  { name: 'Allied Bank', tag: 'banking' },
  { name: 'BNI' },
  { name: 'Bank BRI', tag: 'banking' },
  { name: 'Bank bjb', tag: 'banking' },
  { name: 'Bank of Maldives', tag: 'banking' },
  { name: 'CBI', tag: 'banking' },
  { name: 'Commercial Bank', tag: 'banking' },
  { name: 'Danamon', tag: 'banking' },
  { name: 'Eastern Bank PLC', tag: 'banking' },
  { name: 'Ecobank', tag: 'banking' },
  { name: 'Eurogrip', tag: 'channel' },
  { name: 'Landco Pacific' },
  { name: 'Mandiri', tag: 'banking' },
  { name: 'Mutual Trust Bank PLC', tag: 'banking' },
  { name: 'QIB', tag: 'banking' },
  { name: 'Siddhartha Bank', tag: 'banking' },
  { name: 'Stanley Black & Decker', tag: 'channel' },
  { name: 'Worldia', tag: 'travel' },
  { name: 'Ahli Bank', tag: 'banking' },
  { name: 'SAPTCO', tag: 'travel' },
  { name: 'TBO.com', tag: 'travel' },
];

export interface Story {
  id: string;
  company: string;
  person: string;
  role: string;
  quote: string; // exactly as published today
  industry: string;
  topic: string; // what the quote speaks to
}

export const STORIES: Story[] = [
  {
    id: 'mutual-trust-bank',
    company: 'Mutual Trust Bank',
    person: 'Md Abu Bokar Siddik',
    role: 'Head of Cards',
    quote: 'Cardholders are now more motivated to use their cards and earn MRewardz points.',
    industry: 'Banking and cards',
    topic: 'Card usage',
  },
  {
    id: 'cbi',
    company: 'CBI',
    person: 'Siny Antony Davis',
    role: 'Manager, Cards Portfolio Management',
    quote: '…leading to a tremendous improvement in customer engagement.',
    industry: 'Banking and cards',
    topic: 'Customer engagement',
  },
  {
    id: 'ola-energy',
    company: 'Ola Energy',
    person: 'Motaz Ben Saoud',
    role: 'Corporate Retail Officer',
    quote: 'We chose Loyalife as our loyalty provider to work with us across 17 countries in Africa.',
    industry: 'Travel and energy',
    topic: '17 countries in Africa',
  },
  {
    id: 'tbo-holidays',
    company: 'TBO Holidays',
    person: 'Vijayeta James',
    role: 'Global Sales Effectiveness Leader',
    quote: 'We have received tremendous response from agencies, bookers, and suppliers across 14 countries on the ease of use of the platform.',
    industry: 'Travel and energy',
    topic: 'Ease of use across 14 countries',
  },
];

export const CERTIFICATIONS = [
  { id: 'pci', label: 'PCI-DSS', flag: 'certPci' as const },
  { id: 'soc2', label: 'SOC 2 Type II', flag: 'certSoc2' as const },
  { id: 'iso', label: 'ISO 27001', flag: 'certIso' as const },
];

export const INTEGRATIONS = ['Salesforce', 'Shopify', 'HubSpot', 'MoEngage', 'Stripe', 'Twilio', 'Magento', 'Microsoft Dynamics'];

export const PROGRAM_TYPES = ['Enterprise multi brand', 'Channel', 'Influencer', 'Omnichannel', 'Coalition'];

export const BENCHMARKS = {
  loyalife: { launch: '8 to 12 weeks', staff: '0 to 1 FTE at steady state', reach: '150+ countries', options: '10M+ options' },
  inHouse: { launch: '9 to 12 months', staff: '3 to 5 engineers', reach: '30 to 50 countries', options: 'around 50,000 options at best' },
  tickets: 'about 50% fewer marketing tickets',
};

export const REWARD_CATEGORIES = ['Dining', 'Travel', 'Electronics', 'Mobile top up', 'Subscriptions', 'Charity', 'Experiences', 'Merchandise'];
