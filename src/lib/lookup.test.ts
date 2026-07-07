import { describe, expect, it } from 'vitest';
import { getCorpusVersion } from '@/lib/corpus/version';
import {
  getKeywordSuggestions,
  getKeywordsForPhase,
  getPhasesForSystem,
  lookupKeyword,
} from '@/lib/lookup';
import type { GameSystemId } from '@/store/session';
describe('lookupKeyword', () => {
  it('returns a hit for a known D&D term via alias', async () => {
    const result = await lookupKeyword('advantage', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Advantage and Disadvantage');
      expect(result.phaseApplicability).toBe('general');
      expect(result.source?.documentTitle).toContain('Reference Document');
      expect(result.source?.documentUrl).toMatch(/^https?:\/\//);
    }
  });

  it('resolves slash and alias forms to the single Advantage entry', async () => {
    const slash = await lookupKeyword('advantage/disadvantage', 'dnd5e-srd');
    const disadvantage = await lookupKeyword('disadvantage', 'dnd5e-srd');
    expect(slash.found).toBe(true);
    expect(disadvantage.found).toBe(true);
    if (slash.found && disadvantage.found) {
      expect(slash.keyword).toBe('Advantage and Disadvantage');
      expect(disadvantage.keyword).toBe('Advantage and Disadvantage');
    }
  });

  it('returns a hit for a real SRD condition', async () => {
    const result = await lookupKeyword('blinded', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Blinded');
      expect(result.source?.section).toBe('Blinded');
      expect(result.citation).toContain('Blinded');
    }
  });

  it('excludes pure numeric reference tables from the D&D corpus', async () => {
    const result = await lookupKeyword(
      'experience points by challenge rating',
      'dnd5e-srd',
    );
    expect(result.found).toBe(false);
  });

  it('strips score tables from Ability Modifiers', async () => {
    const result = await lookupKeyword('ability modifiers', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.explanation).not.toContain('|');
      expect(result.explanation).not.toMatch(/\+0|10–11/);
      expect(result.explanation).toContain('ability modifier');
    }
  });

  it('returns a hit for a known WH40k term', async () => {
    const result = await lookupKeyword('close quarters', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Close Quarters');
      expect(result.phase).toBe('Shooting Phase');
      expect(result.phaseApplicability).toBe('restricted');
      expect(result.source?.documentUrl).toContain('warhammer-community.com');
    }
  });

  it('returns a hit for Lance in the WH40k sample corpus', async () => {
    const result = await lookupKeyword('lance', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Lance');
      expect(result.explanation.length).toBeLessThan(320);
      expect(result.source?.section).toContain('24.21');
      expect(result.corpusVersion).toBeTruthy();
    }
  });

  it('returns a brief Stratagems summary without individual stratagem cards', async () => {
    const result = await lookupKeyword('stratagems', 'wh40k-11');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.explanation).toContain('favour');
      expect(result.explanation.length).toBeLessThan(320);
      expect(result.explanation).not.toMatch(/HEROIC INTERVENTION/i);
      expect(result.explanation).not.toMatch(/1CP/i);
    }
  });

  it('returns a hit for a known Starcraft term', async () => {
    const result = await lookupKeyword('engagement', 'starcraft-mini');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Engagement');
      expect(result.citation).toBeTruthy();
    }
  });

  it('returns a brief Surge summary for Starcraft', async () => {
    const result = await lookupKeyword('surge', 'starcraft-mini');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Surge');
      expect(result.explanation).toContain('Combat Tag');
      expect(result.explanation.length).toBeLessThan(320);
      expect(result.explanation).not.toMatch(/Jim Raynor|James needs/i);
    }
  });

  it('matches case-insensitively', async () => {
    const result = await lookupKeyword('  ADVANTAGE  ', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Advantage and Disadvantage');
    }
  });

  it('returns a miss for unknown terms', async () => {
    const result = await lookupKeyword('xyznotaterm', 'dnd5e-srd');
    expect(result).toEqual({ found: false, query: 'xyznotaterm' });
  });

  it('returns a miss for empty or whitespace-only queries', async () => {
    expect(await lookupKeyword('', 'dnd5e-srd')).toEqual({ found: false, query: '' });
    expect(await lookupKeyword('   ', 'dnd5e-srd')).toEqual({ found: false, query: '   ' });
  });

  it('does not return WH40k-only terms when D&D is active', async () => {
    const result = await lookupKeyword('close quarters', 'dnd5e-srd');
    expect(result).toEqual({ found: false, query: 'close quarters' });
  });

  it('scopes engagement to StarCraft — miss under D&D, hit under StarCraft', async () => {
    const dndResult = await lookupKeyword('engagement', 'dnd5e-srd');
    expect(dndResult).toEqual({ found: false, query: 'engagement' });

    const scResult = await lookupKeyword('engagement', 'starcraft-mini');
    expect(scResult.found).toBe(true);
    if (scResult.found) {
      expect(scResult.keyword).toBe('Engagement');
    }
  });

  it('stamps corpusVersion on hits for every game system', async () => {
    const cases: Array<{ query: string; systemId: GameSystemId }> = [
      { query: 'advantage', systemId: 'dnd5e-srd' },
      { query: 'strike', systemId: 'pf2e-srd' },
      { query: 'push', systemId: 'year-zero-engine' },
      { query: 'lance', systemId: 'wh40k-11' },
      { query: 'engagement', systemId: 'starcraft-mini' },
    ];

    for (const { query, systemId } of cases) {
      const result = await lookupKeyword(query, systemId);
      expect(result.found).toBe(true);
      if (result.found) {
        expect(result.corpusVersion).toBe(getCorpusVersion(systemId));
      }
    }
  });

  it('stamps pf2e-remaster-v12 and yze-srd-v13 on expanded SRD hits', async () => {
    const pf2e = await lookupKeyword('degree of success', 'pf2e-srd');
    expect(pf2e.found).toBe(true);
    if (pf2e.found) {
      expect(pf2e.corpusVersion).toBe('pf2e-remaster-v12');
      expect(pf2e.keyword).toBe('Degree of Success');
    }

    const yze = await lookupKeyword('suppressive fire', 'year-zero-engine');
    expect(yze.found).toBe(true);
    if (yze.found) {
      expect(yze.corpusVersion).toBe('yze-srd-v13');
      expect(yze.keyword).toBe('Suppressive Fire');
    }

    const detect = await lookupKeyword('detect magic', 'pf2e-srd');
    expect(detect.found).toBe(true);
    if (detect.found) {
      expect(detect.keyword).toBe('Detect Magic');
    }

    const hunger = await lookupKeyword('hunger', 'year-zero-engine');
    expect(hunger.found).toBe(true);
    if (hunger.found) {
      expect(hunger.keyword).toBe('Hunger');
    }

    const stabilize = await lookupKeyword('stabilize', 'pf2e-srd');
    expect(stabilize.found).toBe(true);
    if (stabilize.found) {
      expect(stabilize.keyword).toBe('Stabilize');
    }

    const exposure = await lookupKeyword('exposure', 'year-zero-engine');
    expect(exposure.found).toBe(true);
    if (exposure.found) {
      expect(exposure.keyword).toBe('Exposure');
    }

    const cursed = await lookupKeyword('cursed', 'pf2e-srd');
    expect(cursed.found).toBe(true);
    if (cursed.found) {
      expect(cursed.keyword).toBe('Cursed');
    }

    const loot = await lookupKeyword('loot', 'year-zero-engine');
    expect(loot.found).toBe(true);
    if (loot.found) {
      expect(loot.keyword).toBe('Loot');
    }
  });

  it('stamps 5.2.1-lookup-v5 on D&D hits after phase deepen', async () => {
    const result = await lookupKeyword('advantage', 'dnd5e-srd');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.corpusVersion).toBe('5.2.1-lookup-v5');
    }
  });

  it('resolves D&D v5 aliases for reaction, craft, and downtime', async () => {
    const reaction = await lookupKeyword('reaction', 'dnd5e-srd');
    expect(reaction.found).toBe(true);
    if (reaction.found) {
      expect(reaction.keyword).toBe('Reactions');
    }

    const craft = await lookupKeyword('craft', 'dnd5e-srd');
    expect(craft.found).toBe(true);
    if (craft.found) {
      expect(craft.keyword).toBe('Crafting');
    }

    const downtime = await lookupKeyword('downtime', 'dnd5e-srd');
    expect(downtime.found).toBe(true);
    if (downtime.found) {
      expect(downtime.keyword).toBe('Downtime Activities');
    }
  });

  it('resolves D&D deepen aliases for death saves and shove', async () => {
    const death = await lookupKeyword('death save', 'dnd5e-srd');
    expect(death.found).toBe(true);
    if (death.found) {
      expect(death.keyword).toBe('Dropping to 0 Hit Points');
    }

    const shove = await lookupKeyword('shove', 'dnd5e-srd');
    expect(shove.found).toBe(true);
    if (shove.found) {
      expect(shove.keyword).toBe('Shoving a Creature');
    }

    const save = await lookupKeyword('save', 'dnd5e-srd');
    expect(save.found).toBe(true);
    if (save.found) {
      expect(save.keyword).toBe('Saving Throws');
    }
  });

  it('returns PF2e v13 social and exploration keywords', async () => {
    const sense = await lookupKeyword('sense motive', 'pf2e-srd');
    expect(sense.found).toBe(true);
    if (sense.found) {
      expect(sense.keyword).toBe('Sense Motive');
    }

    const decipher = await lookupKeyword('decipher', 'pf2e-srd');
    expect(decipher.found).toBe(true);
    if (decipher.found) {
      expect(decipher.keyword).toBe('Decipher Writing');
    }

    const knockdown = await lookupKeyword('knockdown', 'pf2e-srd');
    expect(knockdown.found).toBe(true);
    if (knockdown.found) {
      expect(knockdown.keyword).toBe('Knockdown');
    }

    expect(await lookupKeyword('sense motive', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'sense motive',
    });
  });

  it('returns YZE v13 disarm and wound keywords', async () => {
    const disarm = await lookupKeyword('disarming', 'year-zero-engine');
    expect(disarm.found).toBe(true);
    if (disarm.found) {
      expect(disarm.keyword).toBe('Disarm');
    }

    const bleeding = await lookupKeyword('bleeding', 'year-zero-engine');
    expect(bleeding.found).toBe(true);
    if (bleeding.found) {
      expect(bleeding.keyword).toBe('Bleeding');
    }

    const concealment = await lookupKeyword('concealment', 'year-zero-engine');
    expect(concealment.found).toBe(true);
    if (concealment.found) {
      expect(concealment.keyword).toBe('Concealment');
    }
  });

  it('returns PF2e v12 perform and versatile keywords', async () => {
    const perform = await lookupKeyword('perform', 'pf2e-srd');
    expect(perform.found).toBe(true);
    if (perform.found) {
      expect(perform.keyword).toBe('Perform');
    }

    const versatile = await lookupKeyword('versatile', 'pf2e-srd');
    expect(versatile.found).toBe(true);
    if (versatile.found) {
      expect(versatile.keyword).toBe('Versatile');
    }

    const defend = await lookupKeyword('defend', 'pf2e-srd');
    expect(defend.found).toBe(true);
    if (defend.found) {
      expect(defend.keyword).toBe('Defend');
    }

    expect(await lookupKeyword('perform', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'perform',
    });
  });

  it('returns YZE v12 sensory and infection keywords', async () => {
    const blind = await lookupKeyword('blinded', 'year-zero-engine');
    expect(blind.found).toBe(true);
    if (blind.found) {
      expect(blind.keyword).toBe('Blind');
    }

    const map = await lookupKeyword('mapping', 'year-zero-engine');
    expect(map.found).toBe(true);
    if (map.found) {
      expect(map.keyword).toBe('Map');
    }

    const infection = await lookupKeyword('infection', 'year-zero-engine');
    expect(infection.found).toBe(true);
    if (infection.found) {
      expect(infection.keyword).toBe('Infection');
    }
  });

  it('returns PF2e v11 social and exploration keywords', async () => {
    const lie = await lookupKeyword('lie', 'pf2e-srd');
    expect(lie.found).toBe(true);
    if (lie.found) {
      expect(lie.keyword).toBe('Lie');
    }

    const scout = await lookupKeyword('scouting', 'pf2e-srd');
    expect(scout.found).toBe(true);
    if (scout.found) {
      expect(scout.keyword).toBe('Scout');
    }

    const manipulate = await lookupKeyword('manipulate', 'pf2e-srd');
    expect(manipulate.found).toBe(true);
    if (manipulate.found) {
      expect(manipulate.keyword).toBe('Manipulate');
    }

    expect(await lookupKeyword('lie', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'lie',
    });
  });

  it('returns YZE v11 prone and full-auto keywords', async () => {
    const prone = await lookupKeyword('prone', 'year-zero-engine');
    expect(prone.found).toBe(true);
    if (prone.found) {
      expect(prone.keyword).toBe('Prone');
    }

    const fullAuto = await lookupKeyword('full-auto', 'year-zero-engine');
    expect(fullAuto.found).toBe(true);
    if (fullAuto.found) {
      expect(fullAuto.keyword).toBe('Full Auto');
    }

    const water = await lookupKeyword('water', 'year-zero-engine');
    expect(water.found).toBe(true);
    if (water.found) {
      expect(water.keyword).toBe('Water');
    }
  });

  it('returns PF2e v10 diplomacy and weapon trait keywords', async () => {
    const gather = await lookupKeyword('gather info', 'pf2e-srd');
    expect(gather.found).toBe(true);
    if (gather.found) {
      expect(gather.keyword).toBe('Gather Information');
    }

    const sweep = await lookupKeyword('sweep', 'pf2e-srd');
    expect(sweep.found).toBe(true);
    if (sweep.found) {
      expect(sweep.keyword).toBe('Sweep');
    }

    const request = await lookupKeyword('request', 'pf2e-srd');
    expect(request.found).toBe(true);
    if (request.found) {
      expect(request.keyword).toBe('Request');
    }

    expect(await lookupKeyword('sweep', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'sweep',
    });
  });

  it('returns YZE v10 grapple and trail keywords', async () => {
    const grapple = await lookupKeyword('grappling', 'year-zero-engine');
    expect(grapple.found).toBe(true);
    if (grapple.found) {
      expect(grapple.keyword).toBe('Grapple');
    }

    const trail = await lookupKeyword('tracking', 'year-zero-engine');
    expect(trail.found).toBe(true);
    if (trail.found) {
      expect(trail.keyword).toBe('Trail');
    }

    const knock = await lookupKeyword('knockdown', 'year-zero-engine');
    expect(knock.found).toBe(true);
    if (knock.found) {
      expect(knock.keyword).toBe('Knock Down');
    }
  });

  it('returns PF2e v9 exploration and weapon trait keywords', async () => {
    const hustle = await lookupKeyword('hustle', 'pf2e-srd');
    expect(hustle.found).toBe(true);
    if (hustle.found) {
      expect(hustle.keyword).toBe('Hustle');
    }

    const agile = await lookupKeyword('agile', 'pf2e-srd');
    expect(agile.found).toBe(true);
    if (agile.found) {
      expect(agile.keyword).toBe('Agile');
    }

    const track = await lookupKeyword('track', 'pf2e-srd');
    expect(track.found).toBe(true);
    if (track.found) {
      expect(track.keyword).toBe('Track');
    }

    expect(await lookupKeyword('hustle', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'hustle',
    });
  });

  it('returns YZE v9 survival and burst-fire keywords', async () => {
    const food = await lookupKeyword('food', 'year-zero-engine');
    expect(food.found).toBe(true);
    if (food.found) {
      expect(food.keyword).toBe('Food');
    }

    const burst = await lookupKeyword('burst fire', 'year-zero-engine');
    expect(burst.found).toBe(true);
    if (burst.found) {
      expect(burst.keyword).toBe('Burst');
    }

    const swim = await lookupKeyword('swimming', 'year-zero-engine');
    expect(swim.found).toBe(true);
    if (swim.found) {
      expect(swim.keyword).toBe('Swim');
    }
  });

  it('returns PF2e v8 combat economy and athletics keywords', async () => {
    const delay = await lookupKeyword('delay', 'pf2e-srd');
    expect(delay.found).toBe(true);
    if (delay.found) {
      expect(delay.keyword).toBe('Delay');
    }

    const deadly = await lookupKeyword('deadly', 'pf2e-srd');
    expect(deadly.found).toBe(true);
    if (deadly.found) {
      expect(deadly.keyword).toBe('Deadly');
    }

    const climb = await lookupKeyword('climb', 'pf2e-srd');
    expect(climb.found).toBe(true);
    if (climb.found) {
      expect(climb.keyword).toBe('Climb');
    }

    expect(await lookupKeyword('delay', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'delay',
    });
  });

  it('returns YZE v8 ranged and movement keywords', async () => {
    const aim = await lookupKeyword('aim', 'year-zero-engine');
    expect(aim.found).toBe(true);
    if (aim.found) {
      expect(aim.keyword).toBe('Aim');
    }

    const reload = await lookupKeyword('reload', 'year-zero-engine');
    expect(reload.found).toBe(true);
    if (reload.found) {
      expect(reload.keyword).toBe('Reload');
    }

    const jump = await lookupKeyword('jumping', 'year-zero-engine');
    expect(jump.found).toBe(true);
    if (jump.found) {
      expect(jump.keyword).toBe('Jump');
    }
  });

  it('returns PF2e v7 social and equipment trait keywords', async () => {
    const coerce = await lookupKeyword('coerce', 'pf2e-srd');
    expect(coerce.found).toBe(true);
    if (coerce.found) {
      expect(coerce.keyword).toBe('Coerce');
    }

    const volley = await lookupKeyword('volley', 'pf2e-srd');
    expect(volley.found).toBe(true);
    if (volley.found) {
      expect(volley.keyword).toBe('Volley');
    }

    expect(await lookupKeyword('coerce', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'coerce',
    });
  });

  it('returns YZE v7 exploration keywords', async () => {
    const camp = await lookupKeyword('camp', 'year-zero-engine');
    expect(camp.found).toBe(true);
    if (camp.found) {
      expect(camp.keyword).toBe('Camp');
    }

    const watch = await lookupKeyword('night watch', 'year-zero-engine');
    expect(watch.found).toBe(true);
    if (watch.found) {
      expect(watch.keyword).toBe('Watch');
    }

    const navigate = await lookupKeyword('navigation', 'year-zero-engine');
    expect(navigate.found).toBe(true);
    if (navigate.found) {
      expect(navigate.keyword).toBe('Navigate');
    }
  });

  it('scopes degree of success to PF2e — miss under D&D and YZE', async () => {
    expect(await lookupKeyword('degree of success', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'degree of success',
    });
    expect(await lookupKeyword('degree of success', 'year-zero-engine')).toEqual({
      found: false,
      query: 'degree of success',
    });
  });

  it('returns PF2e v5 healing and condition keywords', async () => {
    const banishment = await lookupKeyword('banishment', 'pf2e-srd');
    expect(banishment.found).toBe(true);
    if (banishment.found) {
      expect(banishment.keyword).toBe('Banishment');
      expect(banishment.phaseApplicability).toBe('restricted');
    }

    const counteract = await lookupKeyword('counteract check', 'pf2e-srd');
    expect(counteract.found).toBe(true);
    if (counteract.found) {
      expect(counteract.keyword).toBe('Counteract');
    }

    const firstAid = await lookupKeyword('first aid', 'pf2e-srd');
    expect(firstAid.found).toBe(true);
    if (firstAid.found) {
      expect(firstAid.keyword).toBe('Administer First Aid');
    }
  });

  it('returns YZE v5 survival and stress keywords', async () => {
    const rally = await lookupKeyword('rally', 'year-zero-engine');
    expect(rally.found).toBe(true);
    if (rally.found) {
      expect(rally.keyword).toBe('Rally');
    }

    const breaking = await lookupKeyword('breaking point', 'year-zero-engine');
    expect(breaking.found).toBe(true);
    if (breaking.found) {
      expect(breaking.keyword).toBe('Breaking Point');
    }

    const thirst = await lookupKeyword('thirst', 'year-zero-engine');
    expect(thirst.found).toBe(true);
    if (thirst.found) {
      expect(thirst.keyword).toBe('Thirst');
    }
  });

  it('scopes banishment to PF2e — miss under D&D', async () => {
    expect(await lookupKeyword('banishment', 'dnd5e-srd')).toEqual({
      found: false,
      query: 'banishment',
    });
  });

  it('returns PF2e hits for remaster terms and aliases', async () => {
    const strike = await lookupKeyword('strike', 'pf2e-srd');
    expect(strike.found).toBe(true);
    if (strike.found) {
      expect(strike.keyword).toBe('Strike');
    }

    const alias = await lookupKeyword('flat-footed', 'pf2e-srd');
    expect(alias.found).toBe(true);
    if (alias.found) {
      expect(alias.keyword).toBe('Off-Guard');
    }

    const hero = await lookupKeyword('hero points', 'pf2e-srd');
    expect(hero.found).toBe(true);
    if (hero.found) {
      expect(hero.keyword).toBe('Hero Point');
    }

    const reactive = await lookupKeyword('attack of opportunity', 'pf2e-srd');
    expect(reactive.found).toBe(true);
    if (reactive.found) {
      expect(reactive.keyword).toBe('Reactive Strike');
    }
  });

  it('returns YZE SRD hits', async () => {
    const result = await lookupKeyword('push', 'year-zero-engine');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.keyword).toBe('Push');
      expect(result.explanation.toLowerCase()).toContain('push');
    }

    const hp = await lookupKeyword('hp', 'year-zero-engine');
    expect(hp.found).toBe(true);
    if (hp.found) {
      expect(hp.keyword).toBe('Hit Points');
    }

    const group = await lookupKeyword('group roll', 'year-zero-engine');
    expect(group.found).toBe(true);
    if (group.found) {
      expect(group.keyword).toBe('Group Roll');
    }
  });
});

describe('getKeywordSuggestions', () => {
  it('returns an empty list for empty or whitespace-only queries', () => {
    expect(getKeywordSuggestions('', 'dnd5e-srd')).toEqual([]);
    expect(getKeywordSuggestions('   ', 'dnd5e-srd')).toEqual([]);
  });

  it('matches prefixes case-insensitively', () => {
    expect(getKeywordSuggestions('adv', 'dnd5e-srd').length).toBeGreaterThan(0);
    expect(getKeywordSuggestions('ADV', 'dnd5e-srd').length).toBeGreaterThan(0);
  });

  it('returns an empty list when no keyword matches the prefix', () => {
    expect(getKeywordSuggestions('xyznotaterm999', 'dnd5e-srd')).toEqual([]);
  });

  it('scopes D&D suggestions to the real SRD corpus', () => {
    expect(getKeywordSuggestions('bl', 'dnd5e-srd')).toContain('Blinded');
  });

  it('scopes results to the active game system', () => {
    expect(getKeywordSuggestions('close', 'dnd5e-srd')).toEqual([]);
    expect(getKeywordSuggestions('close', 'wh40k-11')).toContain('Close Quarters');
  });

  it('suggests PF2e Reactive Strike from react prefix', () => {
    expect(getKeywordSuggestions('react', 'pf2e-srd')).toContain('Reactive Strike');
    expect(getKeywordSuggestions('react', 'dnd5e-srd')).not.toContain('Reactive Strike');
  });

  it('suggests PF2e Counteract and Detect Magic from v5 prefixes', () => {
    expect(getKeywordSuggestions('count', 'pf2e-srd')).toContain('Counteract');
    expect(getKeywordSuggestions('det', 'pf2e-srd')).toContain('Detect Magic');
    expect(getKeywordSuggestions('count', 'dnd5e-srd')).not.toContain('Counteract');
  });

  it('suggests PF2e Sense Motive and YZE Disarm from v13 prefixes', () => {
    expect(getKeywordSuggestions('sen', 'pf2e-srd')).toContain('Sense Motive');
    expect(getKeywordSuggestions('dis', 'year-zero-engine')).toContain('Disarm');
    expect(getKeywordSuggestions('sen', 'dnd5e-srd')).not.toContain('Sense Motive');
  });

  it('suggests PF2e Perform and YZE Map from v12 prefixes', () => {
    expect(getKeywordSuggestions('per', 'pf2e-srd')).toContain('Perform');
    expect(getKeywordSuggestions('map', 'year-zero-engine')).toContain('Map');
    expect(getKeywordSuggestions('per', 'dnd5e-srd')).not.toContain('Perform');
  });

  it('suggests PF2e Scout and YZE Full Auto from v11 prefixes', () => {
    expect(getKeywordSuggestions('sco', 'pf2e-srd')).toContain('Scout');
    expect(getKeywordSuggestions('ful', 'year-zero-engine')).toContain('Full Auto');
    expect(getKeywordSuggestions('sco', 'dnd5e-srd')).not.toContain('Scout');
  });

  it('suggests PF2e Gather Information and YZE Grapple from v10 prefixes', () => {
    expect(getKeywordSuggestions('gat', 'pf2e-srd')).toContain('Gather Information');
    expect(getKeywordSuggestions('gra', 'year-zero-engine')).toContain('Grapple');
    expect(getKeywordSuggestions('gra', 'pf2e-srd')).toContain('Grapple');
    expect(getKeywordSuggestions('gra', 'dnd5e-srd')).not.toContain('Grapple');
  });

  it('suggests PF2e Hustle and YZE Burst from v9 prefixes', () => {
    expect(getKeywordSuggestions('hus', 'pf2e-srd')).toContain('Hustle');
    expect(getKeywordSuggestions('bur', 'year-zero-engine')).toContain('Burst');
    expect(getKeywordSuggestions('hus', 'dnd5e-srd')).not.toContain('Hustle');
  });

  it('suggests PF2e Delay and YZE Aim from v8 prefixes', () => {
    expect(getKeywordSuggestions('del', 'pf2e-srd')).toContain('Delay');
    expect(getKeywordSuggestions('aim', 'year-zero-engine')).toContain('Aim');
    expect(getKeywordSuggestions('del', 'dnd5e-srd')).not.toContain('Delay');
  });

  it('suggests YZE Loot and PF2e Cursed from v7 prefixes', () => {
    expect(getKeywordSuggestions('loo', 'year-zero-engine')).toContain('Loot');
    expect(getKeywordSuggestions('cur', 'pf2e-srd')).toContain('Cursed');
    expect(getKeywordSuggestions('loo', 'dnd5e-srd')).not.toContain('Loot');
  });

  it('respects the result limit', () => {
    const allMatches = getKeywordSuggestions('a', 'dnd5e-srd');
    expect(allMatches.length).toBeGreaterThan(1);
    expect(getKeywordSuggestions('a', 'dnd5e-srd', 1)).toHaveLength(1);
  });

  it('matches multi-word keywords by prefix on the first word', () => {
    expect(getKeywordSuggestions('close', 'wh40k-11')).toContain('Close Quarters');
  });
});

describe('getPhasesForSystem', () => {
  it('returns sorted unique phases for a system', () => {
    const phases = getPhasesForSystem('wh40k-11');
    expect(phases).toContain('Fight Phase');
    expect(phases).toContain('Charge Phase');
    expect(new Set(phases).size).toBe(phases.length);
    expect(phases).toEqual([...phases].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
  });

  it('includes Downtime and Social for D&D after phase deepen', () => {
    const phases = getPhasesForSystem('dnd5e-srd');
    expect(phases).toContain('Downtime');
    expect(phases).toContain('Social');
    expect(phases).toContain('Combat');
  });

  it('returns D&D downtime keywords from the deepened corpus', () => {
    const keywords = getKeywordsForPhase('downtime', 'dnd5e-srd');
    expect(keywords).toContain('Downtime Activities');
    expect(keywords).toContain('Crafting');
    expect(keywords).toContain('Recuperating');
    expect(keywords).not.toContain('Strike');
  });

  it('includes Encounter and Exploration for Pathfinder 2e SRD', () => {
    const phases = getPhasesForSystem('pf2e-srd');
    expect(phases).toContain('Encounter');
    expect(phases).toContain('Exploration');
    expect(phases).not.toContain('Fight Phase');
  });

  it('includes core YZE phase buckets', () => {
    const phases = getPhasesForSystem('year-zero-engine');
    expect(phases).toContain('Encounter');
    expect(phases).toContain('Exploration');
    expect(phases).toContain('Downtime');
    expect(phases).toContain('General');
  });
});

describe('getKeywordsForPhase', () => {
  it('returns an empty list for empty or whitespace-only queries', () => {
    expect(getKeywordsForPhase('', 'wh40k-11')).toEqual([]);
    expect(getKeywordsForPhase('   ', 'dnd5e-srd')).toEqual([]);
  });

  it('returns keywords matching the phase case-insensitively', () => {
    expect(getKeywordsForPhase('shooting', 'wh40k-11')).toContain('Close Quarters');
    expect(getKeywordsForPhase('fight', 'wh40k-11')).toContain('Engagement');
  });

  it('scopes results to the active game system', () => {
    expect(getKeywordsForPhase('engagement', 'dnd5e-srd')).toEqual([]);
    expect(getKeywordsForPhase('combat', 'dnd5e-srd')).toContain('Attack');
  });

  it('returns results sorted alphabetically', () => {
    const keywords = getKeywordsForPhase('battle round', 'wh40k-11');
    expect(keywords.length).toBeGreaterThan(1);
    expect(keywords).toEqual([...keywords].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
  });

  it('returns PF2e exploration keywords from the ORC corpus', () => {
    const keywords = getKeywordsForPhase('exploration', 'pf2e-srd');
    expect(keywords).toContain('Detect Magic');
    expect(keywords).toContain('Hustle');
    expect(keywords).toContain('Track');
    expect(keywords).toContain('Gather Information');
    expect(keywords).toContain('Avoid Notice');
    expect(keywords).toContain('Scout');
    expect(keywords).toContain('Subsist');
    expect(keywords).toContain('Defend');
    expect(keywords).toContain('Decipher Writing');
    expect(keywords).not.toContain('Reactive Strike');
  });

  it('returns PF2e encounter keywords from the ORC corpus', () => {
    const keywords = getKeywordsForPhase('encounter', 'pf2e-srd');
    expect(keywords).toContain('Strike');
    expect(keywords).toContain('Off-Guard');
    expect(keywords).toContain('Reactive Strike');
    expect(keywords).toContain('Paralyzed');
    expect(keywords).toContain('Stabilize');
    expect(keywords).toContain('Delay');
    expect(keywords).toContain('Crawl');
    expect(keywords).toContain('Release');
    expect(keywords).not.toContain('Close Quarters');
  });

  it('returns YZE encounter keywords without PF2e-only terms', () => {
    const keywords = getKeywordsForPhase('encounter', 'year-zero-engine');
    expect(keywords).toContain('Push');
    expect(keywords).toContain('Skill Roll');
    expect(keywords).toContain('Sneak Attack');
    expect(keywords).toContain('Group Roll');
    expect(keywords).toContain('Suppressive Fire');
    expect(keywords).toContain('Aim');
    expect(keywords).toContain('Reload');
    expect(keywords).toContain('Burst');
    expect(keywords).toContain('Grapple');
    expect(keywords).toContain('Knock Down');
    expect(keywords).toContain('Full Auto');
    expect(keywords).toContain('Prone');
    expect(keywords).toContain('Blind');
    expect(keywords).toContain('Deaf');
    expect(keywords).toContain('Disarm');
    expect(keywords).toContain('Bleeding');
    expect(keywords).not.toContain('Strike');
  });

  it('returns YZE downtime keywords from the FTL corpus', () => {
    const keywords = getKeywordsForPhase('downtime', 'year-zero-engine');
    expect(keywords).toContain('Rest');
    expect(keywords).toContain('Craft');
    expect(keywords).not.toContain('Reactive Strike');
  });

  it('returns YZE exploration keywords from the FTL corpus', () => {
    const keywords = getKeywordsForPhase('exploration', 'year-zero-engine');
    expect(keywords).toContain('Hunger');
    expect(keywords).toContain('Thirst');
    expect(keywords).toContain('Recon');
    expect(keywords).toContain('Loot');
    expect(keywords).toContain('Camp');
    expect(keywords).toContain('Navigate');
    expect(keywords).toContain('Climb');
    expect(keywords).toContain('Swim');
    expect(keywords).toContain('Food');
    expect(keywords).toContain('Trail');
    expect(keywords).toContain('Disease');
    expect(keywords).toContain('Water');
    expect(keywords).toContain('Map');
    expect(keywords).toContain('Infection');
    expect(keywords).toContain('Concealment');
    expect(keywords).not.toContain('Detect Magic');
  });

  it('does not return D&D combat keywords when browsing PF2e phases', () => {
    expect(getKeywordsForPhase('combat', 'pf2e-srd')).not.toContain('Advantage');
    expect(getKeywordsForPhase('combat', 'pf2e-srd').length).toBe(0);
  });
});
