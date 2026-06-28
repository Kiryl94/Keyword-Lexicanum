import { create } from 'zustand';

export type GameSystemId = 'dnd5e-srd' | 'wh40k-11' | 'starcraft-mini';

export type GameSystem = {
  id: GameSystemId;
  label: string;
  description: string;
};

export const GAME_SYSTEMS: GameSystem[] = [
  {
    id: 'dnd5e-srd',
    label: 'D&D 5e (SRD)',
    description: 'Basic rules / SRD corpus for v1',
  },
  {
    id: 'wh40k-11',
    label: 'Warhammer 40k (11th ed)',
    description: 'Core rules — license-free version',
  },
  {
    id: 'starcraft-mini',
    label: 'Starcraft Miniature Game',
    description: 'Core rules corpus',
  },
];

type SessionState = {
  activeSystemId: GameSystemId | null;
  recentLookups: string[];
  setActiveSystem: (id: GameSystemId) => void;
  addRecentLookup: (keyword: string) => void;
  getActiveSystem: () => GameSystem | undefined;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  activeSystemId: 'dnd5e-srd',
  recentLookups: [],
  setActiveSystem: (id) => set({ activeSystemId: id }),
  addRecentLookup: (keyword) =>
    set((state) => ({
      recentLookups: [keyword, ...state.recentLookups.filter((k) => k !== keyword)].slice(
        0,
        10,
      ),
    })),
  getActiveSystem: () => {
    const id = get().activeSystemId;
    return GAME_SYSTEMS.find((s) => s.id === id);
  },
}));
