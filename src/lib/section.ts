import { createStore, useStore } from './store';

export const sectionStore = createStore<{ id: string | null }>({ id: null });
export const useCurrentSection = () => useStore(sectionStore).id;
