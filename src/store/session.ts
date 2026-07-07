import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LookupHit } from '@/lib/lookup';
import { getCorpusVersion } from '@/lib/corpus/version';

export type GameSystemId =
  | 'dnd5e-srd'
  | 'pf2e-srd'
  | 'year-zero-engine'
  | 'wh40k-11'
  | 'starcraft-mini';

/** SRD = open-licensed, full lookup. Demo = public sample data only, pending publisher permission. */
export type GameSystemCategory = 'srd' | 'demo';

export type GameSystem = {
  id: GameSystemId;
  label: string;
  description: string;
  category: GameSystemCategory;
  /** When false, shown in the picker as coming soon and cannot be selected. */
  available: boolean;
};

export const GAME_SYSTEMS: GameSystem[] = [
  {
    id: 'dnd5e-srd',
    label: 'D&D 5e (SRD)',
    description: 'Open-licensed SRD 5.2.1 corpus (CC BY 4.0)',
    category: 'srd',
    available: true,
  },
  {
    id: 'pf2e-srd',
    label: 'Pathfinder 2e',
    description: 'ORC-licensed Remaster SRD — corpus coming soon',
    category: 'srd',
    available: false,
  },
  {
    id: 'year-zero-engine',
    label: 'Year Zero Engine',
    description: 'Free League third-party license — corpus coming soon',
    category: 'srd',
    available: false,
  },
  {
    id: 'wh40k-11',
    label: 'Warhammer 40k (11th ed)',
    description: 'Demo — public sample data only, pending GW permission',
    category: 'demo',
    available: true,
  },
  {
    id: 'starcraft-mini',
    label: 'StarCraft TMG',
    description: 'Demo — public sample data only, pending Archon permission',
    category: 'demo',
    available: true,
  },
];

export const GAME_SYSTEM_CATEGORIES: {
  category: GameSystemCategory;
  label: string;
  hint: string;
}[] = [
  { category: 'srd', label: 'SRD', hint: 'Open-licensed — full lookup' },
  { category: 'demo', label: 'Demo', hint: 'Public sample data only' },
];

export const DEFAULT_SYSTEM_ID: GameSystemId = 'dnd5e-srd';
export const MAX_RECENT_LOOKUPS = 10;
export const PROFILE_STORAGE_KEY = 'keyword-lexicanum-profile-v2';

const VALID_SYSTEM_IDS = new Set<GameSystemId>(GAME_SYSTEMS.map((s) => s.id));

export type RecentLookupsBySystem = Partial<Record<GameSystemId, string[]>>;
export type LookupCacheBySystem = Partial<Record<GameSystemId, Record<string, LookupHit>>>;

export function isValidGameSystemId(id: unknown): id is GameSystemId {
  return typeof id === 'string' && VALID_SYSTEM_IDS.has(id as GameSystemId);
}

function normalizeRecentKey(keyword: string): string {
  return keyword.trim().toLowerCase();
}

function sanitizeRecentList(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((keyword): keyword is string => typeof keyword === 'string')
    .slice(0, MAX_RECENT_LOOKUPS);
}

function sanitizeRecentLookupsBySystem(
  bySystem: unknown,
  legacyRecents: unknown,
  activeSystemId: GameSystemId,
): RecentLookupsBySystem {
  const result: RecentLookupsBySystem = {};

  if (bySystem && typeof bySystem === 'object' && !Array.isArray(bySystem)) {
    for (const [id, list] of Object.entries(bySystem)) {
      if (isValidGameSystemId(id)) {
        const sanitized = sanitizeRecentList(list);
        if (sanitized.length > 0) {
          result[id] = sanitized;
        }
      }
    }
  }

  const legacy = sanitizeRecentList(legacyRecents);
  if (legacy.length > 0 && !result[activeSystemId]?.length) {
    result[activeSystemId] = legacy;
  }

  return result;
}

function sanitizeLookupCacheBySystem(
  cache: unknown,
  recentsBySystem: RecentLookupsBySystem,
): LookupCacheBySystem {
  if (!cache || typeof cache !== 'object' || Array.isArray(cache)) {
    return {};
  }

  const result: LookupCacheBySystem = {};

  for (const [id, hits] of Object.entries(cache)) {
    if (!isValidGameSystemId(id) || !hits || typeof hits !== 'object' || Array.isArray(hits)) {
      continue;
    }

    const allowedKeys = new Set(
      (recentsBySystem[id] ?? []).map((keyword) => normalizeRecentKey(keyword)),
    );
    const sanitizedHits: Record<string, LookupHit> = {};

    for (const [keyword, hit] of Object.entries(hits)) {
      if (!allowedKeys.has(normalizeRecentKey(keyword))) continue;
      if (!hit || typeof hit !== 'object' || !('found' in hit) || hit.found !== true) continue;
      const lookupHit = hit as LookupHit & { phaseApplicability?: LookupHit['phaseApplicability'] };
      sanitizedHits[normalizeRecentKey(keyword)] = {
        ...lookupHit,
        phase: lookupHit.phase ?? 'General',
        phaseApplicability: lookupHit.phaseApplicability ?? 'general',
      };
    }

    if (Object.keys(sanitizedHits).length > 0) {
      result[id] = sanitizedHits;
    }
  }

  return result;
}

export function sanitizePersistedProfile(state: {
  activeSystemId?: unknown;
  recentLookups?: unknown;
  recentLookupsBySystem?: unknown;
  recentLookupCacheBySystem?: unknown;
}): {
  activeSystemId: GameSystemId;
  recentLookupsBySystem: RecentLookupsBySystem;
  recentLookupCacheBySystem: LookupCacheBySystem;
} {
  const activeSystemId =
    isValidGameSystemId(state.activeSystemId) &&
    GAME_SYSTEMS.find((s) => s.id === state.activeSystemId)?.available
      ? state.activeSystemId
      : DEFAULT_SYSTEM_ID;

  const recentLookupsBySystem = sanitizeRecentLookupsBySystem(
    state.recentLookupsBySystem,
    state.recentLookups,
    activeSystemId,
  );

  const recentLookupCacheBySystem = sanitizeLookupCacheBySystem(
    state.recentLookupCacheBySystem,
    recentLookupsBySystem,
  );

  return { activeSystemId, recentLookupsBySystem, recentLookupCacheBySystem };
}

type SessionState = {
  activeSystemId: GameSystemId | null;
  recentLookupsBySystem: RecentLookupsBySystem;
  recentLookupCacheBySystem: LookupCacheBySystem;
  setActiveSystem: (id: GameSystemId) => void;
  recordSuccessfulLookup: (systemId: GameSystemId, hit: LookupHit) => void;
  getRecentLookups: (systemId: GameSystemId) => string[];
  getCachedLookup: (systemId: GameSystemId, keyword: string) => LookupHit | undefined;
  clearRecentLookups: (systemId: GameSystemId) => void;
  getActiveSystem: () => GameSystem | undefined;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSystemId: DEFAULT_SYSTEM_ID,
      recentLookupsBySystem: {},
      recentLookupCacheBySystem: {},
      setActiveSystem: (id) => {
        const system = GAME_SYSTEMS.find((s) => s.id === id);
        if (!system?.available) return;
        set({ activeSystemId: id });
      },
      recordSuccessfulLookup: (systemId, hit) =>
        set((state) => {
          const recents = state.recentLookupsBySystem[systemId] ?? [];
          const updatedRecents = [
            hit.keyword,
            ...recents.filter((keyword) => keyword !== hit.keyword),
          ].slice(0, MAX_RECENT_LOOKUPS);

          const cacheKey = normalizeRecentKey(hit.keyword);
          const nextCache: Record<string, LookupHit> = {};
          for (const keyword of updatedRecents) {
            const key = normalizeRecentKey(keyword);
            const cached =
              key === cacheKey
                ? hit
                : state.recentLookupCacheBySystem[systemId]?.[key];
            if (cached) {
              nextCache[key] = cached;
            }
          }

          return {
            recentLookupsBySystem: {
              ...state.recentLookupsBySystem,
              [systemId]: updatedRecents,
            },
            recentLookupCacheBySystem: {
              ...state.recentLookupCacheBySystem,
              [systemId]: nextCache,
            },
          };
        }),
      getRecentLookups: (systemId) => get().recentLookupsBySystem[systemId] ?? [],
      getCachedLookup: (systemId, keyword) => {
        const cached =
          get().recentLookupCacheBySystem[systemId]?.[normalizeRecentKey(keyword)];
        if (!cached) return undefined;
        if (!cached.corpusVersion || cached.corpusVersion !== getCorpusVersion(systemId)) {
          return undefined;
        }
        return cached;
      },
      clearRecentLookups: (systemId) =>
        set((state) => {
          const recentLookupsBySystem = { ...state.recentLookupsBySystem };
          delete recentLookupsBySystem[systemId];
          const recentLookupCacheBySystem = { ...state.recentLookupCacheBySystem };
          delete recentLookupCacheBySystem[systemId];
          return { recentLookupsBySystem, recentLookupCacheBySystem };
        }),
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
        recentLookupsBySystem: state.recentLookupsBySystem,
        recentLookupCacheBySystem: state.recentLookupCacheBySystem,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizePersistedProfile(
          (persisted ?? {}) as {
            activeSystemId?: unknown;
            recentLookups?: unknown;
            recentLookupsBySystem?: unknown;
            recentLookupCacheBySystem?: unknown;
          },
        ),
      }),
    },
  ),
);
