import { createStore, useStore } from './store';

export type GuideTab = 'tour' | 'help' | 'ask';

export interface UiState {
  guideOpen: boolean;
  guideTab: GuideTab;
  askQuery: string; // set to run a question in the Ask tab
  askNonce: number;
  paletteOpen: boolean;
  securityPackOpen: boolean;
  explorerOpen: boolean;
  menuOpen: boolean;
  stickyVisible: boolean;
}

export const uiStore = createStore<UiState>({
  guideOpen: false,
  guideTab: 'tour',
  askQuery: '',
  askNonce: 0,
  paletteOpen: false,
  securityPackOpen: false,
  explorerOpen: false,
  menuOpen: false,
  stickyVisible: false,
});

export const useUi = () => useStore(uiStore);

export const openGuide = (tab: GuideTab = 'tour') => uiStore.set({ guideOpen: true, guideTab: tab });
export const closeGuide = () => uiStore.set({ guideOpen: false });
export const askGuide = (q: string) =>
  uiStore.set((s) => ({ ...s, guideOpen: true, guideTab: 'ask', askQuery: q, askNonce: s.askNonce + 1, paletteOpen: false }));
export const openPalette = () => uiStore.set({ paletteOpen: true });
export const closePalette = () => uiStore.set({ paletteOpen: false });
export const openSecurityPack = () => uiStore.set({ securityPackOpen: true });
