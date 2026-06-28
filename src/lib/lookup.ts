import type { GameSystemId } from '@/store/session';

export type PhaseApplicability = 'restricted' | 'general';

export type LookupHit = {
  found: true;
  keyword: string;
  explanation: string;
  phase: string;
  phaseApplicability: PhaseApplicability;
  citation: string;
};

export type LookupMiss = {
  found: false;
  query: string;
};

export type LookupResult = LookupHit | LookupMiss;

type CorpusEntry = {
  keyword: string;
  phase: string;
  applicability: PhaseApplicability;
  explanation: string;
  citation: string;
};

const SAMPLE_CORPUS: Record<GameSystemId, CorpusEntry[]> = {
  'dnd5e-srd': [
    {
      keyword: 'advantage',
      phase: 'Ability Checks & Attacks',
      applicability: 'general',
      explanation:
        'When you have advantage on a d20 roll, you roll twice and use the higher result.',
      citation: 'SRD — Advantage / Disadvantage',
    },
    {
      keyword: 'disadvantage',
      phase: 'Ability Checks & Attacks',
      applicability: 'general',
      explanation:
        'When you have disadvantage on a d20 roll, you roll twice and use the lower result.',
      citation: 'SRD — Advantage / Disadvantage',
    },
    {
      keyword: 'armor class',
      phase: 'Combat',
      applicability: 'restricted',
      explanation:
        'Armor Class (AC) represents how hard it is to land a damaging hit on a creature.',
      citation: 'SRD — Armor Class',
    },
    {
      keyword: 'concentration',
      phase: 'Spellcasting',
      applicability: 'restricted',
      explanation:
        'Some spells require concentration. Taking damage can break concentration on a Constitution save.',
      citation: 'SRD — Concentration',
    },
    {
      keyword: 'critical hit',
      phase: 'Combat',
      applicability: 'restricted',
      explanation:
        'When you roll a 20 on the d20 for an attack, you score a critical hit and roll extra damage dice.',
      citation: 'SRD — Critical Hits',
    },
    {
      keyword: 'hit points',
      phase: 'Combat',
      applicability: 'restricted',
      explanation:
        'Hit points represent durability. When you reach 0 hit points, you fall unconscious or die.',
      citation: 'SRD — Hit Points',
    },
    {
      keyword: 'initiative',
      phase: 'Combat',
      applicability: 'restricted',
      explanation:
        'Initiative determines turn order in combat. Each creature rolls a d20 plus Dexterity modifier.',
      citation: 'SRD — Initiative',
    },
    {
      keyword: 'opportunity attack',
      phase: 'Combat',
      applicability: 'restricted',
      explanation:
        'You can make an opportunity attack when a hostile creature you can see leaves your reach.',
      citation: 'SRD — Opportunity Attacks',
    },
    {
      keyword: 'proficiency bonus',
      phase: 'General',
      applicability: 'general',
      explanation:
        'Your proficiency bonus is added to rolls for skills, saves, and attacks you are proficient in.',
      citation: 'SRD — Proficiency Bonus',
    },
    {
      keyword: 'saving throw',
      phase: 'General',
      applicability: 'general',
      explanation:
        'A saving throw is a d20 roll plus the relevant ability modifier to resist spells, traps, and effects.',
      citation: 'SRD — Saving Throws',
    },
  ],
  'wh40k-11': [
    {
      keyword: 'close quarters',
      phase: 'Engagement',
      applicability: 'restricted',
      explanation:
        'Close quarters rules apply only during the Engagement phase. Outside Engagement, this keyword does not affect play.',
      citation: 'WH40k 11th ed core rules — Engagement (sample)',
    },
    {
      keyword: 'engagement',
      phase: 'Engagement',
      applicability: 'restricted',
      explanation:
        'Engagement is the phase where close-quarters and fight rules apply. Keywords tied to Engagement are irrelevant outside it.',
      citation: 'WH40k 11th ed core rules — Engagement (sample)',
    },
    {
      keyword: 'battle round',
      phase: 'Battle Round',
      applicability: 'general',
      explanation:
        'A battle round consists of alternating player turns through movement, shooting, charge, and fight phases.',
      citation: 'WH40k 11th ed core rules — Battle Round (sample)',
    },
    {
      keyword: 'charge phase',
      phase: 'Charge Phase',
      applicability: 'restricted',
      explanation:
        'During the Charge phase, eligible units declare charges against enemy units within range.',
      citation: 'WH40k 11th ed core rules — Charge Phase (sample)',
    },
    {
      keyword: 'fight phase',
      phase: 'Fight Phase',
      applicability: 'restricted',
      explanation:
        'Units that charged or are within engagement range fight in the Fight phase, alternating activations.',
      citation: 'WH40k 11th ed core rules — Fight Phase (sample)',
    },
    {
      keyword: 'movement phase',
      phase: 'Movement Phase',
      applicability: 'restricted',
      explanation:
        'Units move across the battlefield in the Movement phase, respecting coherency and terrain rules.',
      citation: 'WH40k 11th ed core rules — Movement Phase (sample)',
    },
    {
      keyword: 'morale',
      phase: 'Morale Phase',
      applicability: 'restricted',
      explanation:
        'Units that lost models may need to take a Battle-shock test during the Morale phase.',
      citation: 'WH40k 11th ed core rules — Morale (sample)',
    },
    {
      keyword: 'objective marker',
      phase: 'Battle Round',
      applicability: 'general',
      explanation:
        'Objective markers define scoring locations. Controlling them earns victory points each round.',
      citation: 'WH40k 11th ed core rules — Objectives (sample)',
    },
    {
      keyword: 'shooting phase',
      phase: 'Shooting Phase',
      applicability: 'restricted',
      explanation:
        'Units with ranged weapons attack eligible targets during the Shooting phase.',
      citation: 'WH40k 11th ed core rules — Shooting Phase (sample)',
    },
    {
      keyword: 'terrain',
      phase: 'Movement Phase',
      applicability: 'restricted',
      explanation:
        'Terrain features can block line of sight, provide cover, and restrict movement.',
      citation: 'WH40k 11th ed core rules — Terrain (sample)',
    },
  ],
  'starcraft-mini': [
    {
      keyword: 'engagement',
      phase: 'Engagement',
      applicability: 'restricted',
      explanation:
        'During Engagement, positional and close-range keyword effects are evaluated.',
      citation: 'Starcraft Miniature Game core rules (sample)',
    },
    {
      keyword: 'close quarters',
      phase: 'Engagement',
      applicability: 'restricted',
      explanation:
        'Close quarters effects only apply while units are in Engagement with enemy models.',
      citation: 'Starcraft Miniature Game core rules — Engagement (sample)',
    },
    {
      keyword: 'charge',
      phase: 'Charge Phase',
      applicability: 'restricted',
      explanation:
        'Units may charge enemy models within range during the Charge phase to enter Engagement.',
      citation: 'Starcraft Miniature Game core rules — Charge (sample)',
    },
    {
      keyword: 'cover',
      phase: 'Shooting Phase',
      applicability: 'restricted',
      explanation:
        'Models in cover receive defensive benefits against ranged attacks.',
      citation: 'Starcraft Miniature Game core rules — Cover (sample)',
    },
    {
      keyword: 'deployment',
      phase: 'Deployment',
      applicability: 'restricted',
      explanation:
        'Players place units within their deployment zone before the first battle round begins.',
      citation: 'Starcraft Miniature Game core rules — Deployment (sample)',
    },
    {
      keyword: 'line of sight',
      phase: 'Shooting Phase',
      applicability: 'restricted',
      explanation:
        'A model must have line of sight to a target to make a ranged attack against it.',
      citation: 'Starcraft Miniature Game core rules — Line of Sight (sample)',
    },
    {
      keyword: 'morale',
      phase: 'Morale Phase',
      applicability: 'restricted',
      explanation:
        'Units that take casualties may need to pass a morale test or fall back.',
      citation: 'Starcraft Miniature Game core rules — Morale (sample)',
    },
    {
      keyword: 'movement',
      phase: 'Movement Phase',
      applicability: 'restricted',
      explanation:
        'Units move up to their Movement characteristic during the Movement phase.',
      citation: 'Starcraft Miniature Game core rules — Movement (sample)',
    },
    {
      keyword: 'objective',
      phase: 'Battle Round',
      applicability: 'general',
      explanation:
        'Controlling objectives at the end of a battle round scores victory points.',
      citation: 'Starcraft Miniature Game core rules — Objectives (sample)',
    },
    {
      keyword: 'shooting',
      phase: 'Shooting Phase',
      applicability: 'restricted',
      explanation:
        'Units with ranged weapons fire at eligible targets during the Shooting phase.',
      citation: 'Starcraft Miniature Game core rules — Shooting (sample)',
    },
  ],
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export async function lookupKeyword(
  rawQuery: string,
  systemId: GameSystemId,
): Promise<LookupResult> {
  const query = normalize(rawQuery);
  if (!query) {
    return { found: false, query: rawQuery };
  }

  const entries = SAMPLE_CORPUS[systemId] ?? [];
  const match = entries.find((entry) => normalize(entry.keyword) === query);

  if (!match) {
    return { found: false, query: rawQuery.trim() || rawQuery };
  }

  return {
    found: true,
    keyword: match.keyword,
    explanation: match.explanation,
    phase: match.phase,
    phaseApplicability: match.applicability,
    citation: match.citation,
  };
}

export function getPhasesForSystem(systemId: GameSystemId): string[] {
  const phases = new Set((SAMPLE_CORPUS[systemId] ?? []).map((entry) => entry.phase));
  return [...phases].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

export function getKeywordsForPhase(phaseQuery: string, systemId: GameSystemId): string[] {
  const phase = normalize(phaseQuery);
  if (!phase) {
    return [];
  }

  return (SAMPLE_CORPUS[systemId] ?? [])
    .filter(
      (entry) =>
        normalize(entry.phase).includes(phase) || phase.includes(normalize(entry.phase)),
    )
    .map((entry) => entry.keyword)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

export function getKeywordSuggestions(
  rawQuery: string,
  systemId: GameSystemId,
  limit = 8,
): string[] {
  const query = normalize(rawQuery);
  if (!query) {
    return [];
  }

  return (SAMPLE_CORPUS[systemId] ?? [])
    .filter((entry) => normalize(entry.keyword).startsWith(query))
    .map((entry) => entry.keyword)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
    .slice(0, limit);
}
