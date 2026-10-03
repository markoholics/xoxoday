import { createStore, useStore } from './store';

export const REGIONS = ['United States', 'Europe', 'Middle East and Africa', 'Asia Pacific'] as const;
export type Region = (typeof REGIONS)[number];

export const regionStore = createStore<{ region: Region }>({ region: 'United States' }, 'loyalife_region_v1');
export const useRegion = () => useStore(regionStore).region;
