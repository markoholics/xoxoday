/** Deterministic keyword parser. No model is called. Output is always labelled Sample output. */
export interface ProgramCardData {
  name: string;
  audience: 'Customers' | 'Channel partners' | 'Influencers';
  mechanic: string;
  region: string;
  currency: string;
  rules: string[];
  tiers: string[];
  budgetBand: string;
  budgetValue?: number;
  risk: { label: string; ok: boolean }[];
  riskSummary: string;
  threshold: number;
  doublePoints: boolean;
}

const REGION_RULES: [RegExp, string, string][] = [
  [/\b(uae|dubai|abu dhabi|saudi|qatar|oman|kuwait|middle east|gcc)\b/i, 'Middle East', 'AED'],
  [/\b(usa?|united states|america|canada)\b/i, 'United States', 'USD'],
  [/\b(india|mumbai|delhi)\b/i, 'India', 'INR'],
  [/\b(uk|britain|england|europe|germany|france|spain|italy)\b/i, 'Europe', 'EUR'],
  [/\b(africa|nigeria|kenya|egypt|ghana)\b/i, 'Africa', 'USD'],
  [/\b(singapore|asia|apac|indonesia|malaysia|australia)\b/i, 'Asia Pacific', 'SGD'],
];

const MECHANICS: { id: string; re: RegExp; name: string; rules: string[]; double?: boolean }[] = [
  { id: 'winback', re: /(win back|lapsed|dormant|inactive|churn|re-?engage|come back)/i, name: 'Win back', rules: ['Find members with no activity in a set period', 'Offer bonus points on the next purchase', 'End the offer when the member returns'], double: true },
  { id: 'target', re: /(target|quarterly|quota|goal|hit)/i, name: 'Target tiers', rules: ['Set a quarterly target for each partner', 'Reward partners who hit the target', 'Add a bonus tier above target'] },
  { id: 'referral', re: /(referral|refer|invite)/i, name: 'Referral', rules: ['Reward the referrer after a validated sign up', 'Reward the new member on a first purchase', 'Cap rewards per referrer'] },
  { id: 'bonus', re: /(double|bonus|weekend|promo|campaign|seasonal)/i, name: 'Bonus points', rules: ['Run bonus points for a set window', 'Apply to selected categories', 'End on a fixed date'], double: true },
  { id: 'mission', re: /(mission|challenge|quest)/i, name: 'Missions', rules: ['Set missions with clear steps', 'Award points when a mission is validated', 'Show progress to the member'] },
];

const AUDIENCES: { re: RegExp; a: ProgramCardData['audience']; short: string }[] = [
  { re: /(distributor|dealer|installer|partner|reseller|channel|retailer)/i, a: 'Channel partners', short: 'Partner' },
  { re: /(influenc|advocate|ambassador|creator)/i, a: 'Influencers', short: 'Influencer' },
  { re: /(cardholder|customer|member|shopper|card|loyal)/i, a: 'Customers', short: 'Customer' },
];

const TIERS: Record<ProgramCardData['audience'], { names: string[]; thresholds: number[] }> = {
  Customers: { names: ['Silver', 'Gold', 'Platinum'], thresholds: [0, 12000, 30000] },
  'Channel partners': { names: ['Base', 'Preferred', 'Elite'], thresholds: [0, 8000, 20000] },
  Influencers: { names: ['Starter', 'Advocate', 'Ambassador'], thresholds: [0, 5000, 15000] },
};

function parseBudget(text: string): number | undefined {
  const m = text.match(/\$\s?([\d][\d,]*(?:\.\d+)?)\s?(k|m)?/i) || text.match(/\b([\d][\d,]*(?:\.\d+)?)\s?(k|m)\s+budget/i);
  if (!m) return undefined;
  let n = parseFloat(m[1].replace(/,/g, ''));
  if (m[2]?.toLowerCase() === 'k') n *= 1000;
  if (m[2]?.toLowerCase() === 'm') n *= 1_000_000;
  return Math.round(n);
}

const usd = (n: number) => '$' + n.toLocaleString('en-US');

export function parseBrief(input: string): ProgramCardData {
  const text = input.trim();
  const aud = AUDIENCES.find((a) => a.re.test(text)) ?? AUDIENCES[2];
  const mech = MECHANICS.find((m) => m.re.test(text));
  const reg = REGION_RULES.find(([re]) => re.test(text));
  const budget = parseBudget(text);
  const mechName = mech?.name ?? 'Points per purchase';
  const rules = mech?.rules ?? ['Earn points on every purchase', 'Move members up tiers as points grow', 'Redeem from the rewards marketplace'];
  const region = reg?.[1] ?? 'Global';
  const tiers = TIERS[aud.a];
  const risk = [
    { label: 'Budget cap set', ok: budget !== undefined },
    { label: 'Maker checker approval required', ok: true },
    { label: 'Anomaly detection watches redemptions', ok: true },
    { label: 'Duplicate claims guard on', ok: true },
  ];
  const notes = risk.filter((r) => !r.ok).length;
  return {
    name: `${aud.short} ${mechName.toLowerCase()}${region !== 'Global' ? ` (${region})` : ''}`.replace(/^./, (c) => c.toUpperCase()),
    audience: aud.a,
    mechanic: mechName,
    region,
    currency: reg?.[2] ?? 'USD',
    rules,
    tiers: tiers.names.map((n, i) => `${n} from ${tiers.thresholds[i].toLocaleString('en-US')} points`),
    budgetBand: budget ? `${usd(Math.round(budget * 0.9))} to ${usd(Math.round(budget * 1.1))}` : 'To be set with your finance lead',
    budgetValue: budget,
    risk,
    riskSummary: notes ? `${notes} note to resolve before approval` : 'No blocking issues',
    threshold: tiers.thresholds[1],
    doublePoints: !!mech?.double,
  };
}

export const COMMAND_CHIPS = ['Reward distributors who hit quarterly targets', 'Win back lapsed cardholders in the UAE', 'Launch a referral program for influencers'];
