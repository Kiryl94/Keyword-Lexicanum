import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

export const DEFAULT_SYSTEM_ID: GameSystemId = 'dnd5e-srd';
export const MAX_RECENT_LOOKUPS = 10;
export const PROFILE_STORAGE_KEY = 'keyword-lexicanum-profile';

const VALID_SYSTEM_IDS = new Set<GameSystemId>(GAME_SYSTEMS.map((s) => s.id));

export function isValidGameSystemId(id: unknown): id is GameSystemId {
  return typeof id === 'string' && VALID_SYSTEM_IDS.has(id as GameSystemId);
}

export function sanitizePersistedProfile(state: {
  activeSystemId?: unknown;
  recentLookups?: unknown;
}): { activeSystemId: GameSystemId; recentLookups: string[] } {
  const activeSystemId = isValidGameSystemId(state.activeSystemId)
    ? state.activeSystemId
    : DEFAULT_SYSTEM_ID;

  const recentLookups = Array.isArray(state.recentLookups)
    ? state.recentLookups
        .filter((keyword): keyword is string => typeof keyword === 'string')
        .slice(0, MAX_RECENT_LOOKUPS)
    : [];

  return { activeSystemId, recentLookups };
}

type SessionState = {
  activeSystemId: GameSystemId | null;
  recentLookups: string[];
  setActiveSystem: (id: GameSystemId) => void;
  addRecentLookup: (keyword: string) => void;
  getActiveSystem: () => GameSystem | undefined;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSystemId: DEFAULT_SYSTEM_ID,
      recentLookups: [],
      setActiveSystem: (id) => set({ activeSystemId: id }),
      addRecentLookup: (keyword) =>
        set((state) => ({
          recentLookups: [
            keyword,
            ...state.recentLookups.filter((k) => k !== keyword),
          ].slice(0, MAX_RECENT_LOOKUPS),
        })),
      getActiveSystem: () => {
        const id = get().activeSystemId;
        return GAME_SYSTEMS.find((s) => s.id === id);
      },
    }),
    {
      name: PROFILE_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        activeSystemId: state.activeSystemId,
        recentLookups: state.recentLookups,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizePersistedProfile(
          (persisted ?? {}) as { activeSystemId?: unknown; recentLookups?: unknown },
        ),
      }),
    },
  ),
);
