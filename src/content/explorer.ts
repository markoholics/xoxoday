export type MissionId =
  | 'tour' | 'governance' | 'studio' | 'region' | 'estimator' | 'story' | 'demo' | 'concierge';

export interface Mission {
  id: MissionId;
  label: string;
  points: number;
  badge: string;
  topic: string; // phrase for the explorer summary
}

export const MISSIONS: Mission[] = [
  { id: 'tour', label: 'Finish the 3 minute guided tour', points: 50, badge: 'Tour Guide', topic: 'the guided tour' },
  { id: 'governance', label: 'Approve or reject a change in the governance demo', points: 30, badge: 'Governance Guru', topic: 'governance approvals' },
  { id: 'studio', label: 'Complete the AI studio stepper', points: 40, badge: 'Program Architect', topic: 'the AI studio' },
  { id: 'region', label: 'Switch region and see local rewards', points: 20, badge: 'Globe Trotter', topic: 'regional rewards' },
  { id: 'estimator', label: 'Use the build versus buy estimator', points: 30, badge: 'Number Cruncher', topic: 'the build versus buy estimator' },
  { id: 'story', label: 'Open a customer story', points: 20, badge: 'Story Seeker', topic: 'customer stories' },
  { id: 'demo', label: 'Watch a demo past 75%', points: 30, badge: 'Front Row', topic: 'a recorded demo' },
  { id: 'concierge', label: 'Ask the concierge a question', points: 10, badge: 'Curious Mind', topic: 'Ask Loyalife' },
];

export const TOTAL_POINTS = MISSIONS.reduce((a, m) => a + m.points, 0); // 230

export const TIERS = [
  { id: 'Explorer', at: 0 },
  { id: 'Navigator', at: 60 },
  { id: 'Insider', at: 120 },
  { id: 'Architect', at: 180 },
] as const;
export type TierId = (typeof TIERS)[number]['id'];

export function tierFor(points: number): TierId {
  let t: TierId = 'Explorer';
  for (const x of TIERS) if (points >= x.at) t = x.id;
  return t;
}

export const REWARD_BY_TIER: Record<string, { title: string; text: string }> = {
  Navigator: { title: 'Program template pack', text: 'Three templates: Customer rewards, Channel partner program and Influencer missions.' },
  Insider: { title: 'Build versus buy one pager', text: 'A printable benchmark summary from the published facts.' },
  Architect: { title: 'Priority demo slot', text: 'Reserved on the demo page, with your explorer summary prefilled.' },
};

export interface Template {
  id: string;
  name: string;
  audience: string;
  rules: string[];
  tiers: string[];
  threshold: number;
  doublePoints: boolean;
}

export const TEMPLATES: Template[] = [
  { id: 'customer', name: 'Customer rewards', audience: 'Customers', rules: ['Earn 1 point per $1 spent', 'Bonus points on a second purchase in 30 days', 'Redeem from the rewards marketplace'], tiers: ['Silver 0', 'Gold 12,000', 'Platinum 30,000'], threshold: 12000, doublePoints: false },
  { id: 'channel', name: 'Channel partner program', audience: 'Channel partners', rules: ['Earn on validated sales', 'Quarterly target tiers', 'Rewards issued after proof is validated'], tiers: ['Base 0', 'Preferred 8,000', 'Elite 20,000'], threshold: 8000, doublePoints: false },
  { id: 'influencer', name: 'Influencer missions', audience: 'Influencers', rules: ['Complete missions for points', 'Referral reward after a validated sign up', 'Budget approved before launch'], tiers: ['Starter 0', 'Advocate 5,000', 'Ambassador 15,000'], threshold: 5000, doublePoints: true },
];
