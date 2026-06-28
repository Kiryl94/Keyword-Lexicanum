/**
 * Curated StarCraft TMG core rules keywords.
 * Summaries are brief paraphrases for quick lookup; full rule text lives in the linked PDF.
 */

/** @typedef {{ keyword: string, phase: string, applicability: 'general' | 'restricted', labels: string[], summary: string, ruleRef?: string }} StarcraftRule */

/** @type {StarcraftRule[]} */
export const STARCRAFT_RULES = [
  {
    keyword: 'Supply',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['Every Unit Card includes a Supply Profile', 'THE SUPPLY PROFILE'],
    ruleRef: '6.1',
    summary:
      'Each unit\'s Current Supply value depends on how many models it has left. The total Supply of your units on the table cannot exceed the mission Supply Pool (except in the final round, when it is unlimited).',
  },
  {
    keyword: 'Reserves',
    phase: 'Deployment',
    applicability: 'restricted',
    labels: ['No Units begin on the battlefield', '8.3 DEPLOYMENT AND RESERVES'],
    ruleRef: '8.3',
    summary:
      'All units in your army list start in Reserves—not on the table. You bring them on during the Movement Phase when you have enough Available Supply.',
  },
  {
    keyword: 'Alternating Activations',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['decides which player activates first each Phase', '8.6.1 ACTIVATIONS'],
    ruleRef: '8.1',
    summary:
      'In each phase, the first player activates one unit, then players alternate activating a single unit at a time until both players pass.',
  },
  {
    keyword: 'Passing',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['At any point during a turn, the Active Player may Pass', 'PASSING AND INITIATIVE'],
    ruleRef: '8.6.2',
    summary:
      'The active player may Pass instead of activating a unit. The first player to Pass in a phase takes the First Player Marker for the next phase and cannot activate further units that phase.',
  },
  {
    keyword: 'Surge',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['Check if the target Unit', 'Surge can never move more dice than are currently'],
    ruleRef: '8.7.4',
    summary:
      'When a weapon\'s Surge triggers, check whether the target\'s Combat Tag matches the weapon\'s Surge Type. If it matches, move dice equal to the Surge result from the Armour Pool directly to the Damage Pool, bypassing armour; otherwise discard the Surge die.',
  },
  {
    keyword: 'Objective Control',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['IDENTIFY CONTESTING UNITS', 'A Unit may Contest a Mission Marker only if all three'],
    ruleRef: '8.9.1',
    summary:
      'In the Scoring Phase, determine which units contest each Mission Marker and who controls them for victory points. A unit must meet all contesting requirements listed in the core rules.',
  },
  {
    keyword: 'Movement Phase',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['8.5.1 HOLD', 'The Unit performs no action. Set an Activation Marker'],
    ruleRef: '8.5',
    summary:
      'Phase 1 of each round. Units with a Movement-side activation marker may Hold, Move, Disengage, or Deploy from Reserves, then receive an Assault-side marker for the next phase.',
  },
  {
    keyword: 'Assault Phase',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['Assault Phase is when the Damage is done', 'line finally breaks'],
    ruleRef: '8.6',
    summary:
      'Phase 2 of each round. Activated units may Run, Hold, Charge, or make Ranged Attacks. This is where most shooting damage and charges happen before melee.',
  },
  {
    keyword: 'Shooting Phase',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['Fire is the language of the Assault Phase', 'Every ranged weapon on the battlefield'],
    ruleRef: '8.7.3',
    summary:
      'StarCraft TMG has no separate shooting phase—ranged attacks are Ranged Attack actions taken during the Assault Phase after units have moved into position.',
  },
  {
    keyword: 'Combat Phase',
    phase: 'Engagement',
    applicability: 'restricted',
    labels: ['There is no room for tactics at arm', 'PHASE 3: THE COMBAT PHASE'],
    ruleRef: '8.8',
    summary:
      'Phase 3 of each round. Every unit that is Engaged must fight in close combat; unlike earlier phases, these activations are mandatory for all Engaged units.',
  },
  {
    keyword: 'Deployment',
    phase: 'Deployment',
    applicability: 'restricted',
    labels: ['draft is complete and both cards have been', 'BATTLEFIELD SETUP'],
    ruleRef: '9.3',
    summary:
      'After the draft picks the Mission and Deployment cards, set up the battlefield—terrain, objectives, and zones—according to those cards before Round 1 begins.',
  },
  {
    keyword: 'Line of Sight',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['Every shot, every ability, and every order that requires', 'LINE OF SIGHT'],
    ruleRef: '7.1',
    summary:
      'Trace an imaginary line from any part of the attacker\'s base to any part of the target\'s base from a top-down view. If blocking terrain does not stop the line, the target is visible.',
  },
  {
    keyword: 'Cover',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['Full Cover: A terrain piece blocks Line of Sight', 'Direct Cover: If the Line of Sight trace passes'],
    ruleRef: '7.1.1',
    summary:
      'Terrain can grant Full Cover (blocks line of sight when the piece is large enough relative to both models) or Direct Cover (blocks LoS when a model is within 1" of terrain tall enough for that model).',
  },
  {
    keyword: 'Engagement',
    phase: 'Engagement',
    applicability: 'restricted',
    labels: ['The Engagement Range extends 1', 'When two Enemy models are Within 1'],
    ruleRef: '7.2',
    summary:
      'Engagement Range extends 1" horizontally from a model\'s base. Enemy models within that range are Engaged; if any models in two units are Engaged, both units count as Engaged.',
  },
  {
    keyword: 'Draft System',
    phase: 'Deployment',
    applicability: 'restricted',
    labels: ['Before the game starts, players use a short draft', 'DRAFT'],
    ruleRef: '9.2',
    summary:
      'Before the battle, players draft Mission and Deployment cards from face-up options so both sides help choose what is played and where, without a preset advantage.',
  },
  {
    keyword: 'Minerals',
    phase: 'Army Building',
    applicability: 'general',
    labels: ['Spend Minerals to recruit Units and purchase Upgrades', 'MINERALS'],
    ruleRef: '9.1.3',
    summary:
      'Minerals are spent during army building to recruit units and buy upgrades. Total Mineral cost cannot exceed your engagement scale limit; unspent Minerals are lost.',
  },
  {
    keyword: 'Vespene Gas',
    phase: 'Army Building',
    applicability: 'general',
    labels: ['Spend Vespene Gas exclusively on Tactical Cards', 'VESPENE GAS'],
    ruleRef: '9.1.4',
    summary:
      'Vespene Gas is spent only on Tactical Cards during army building. It cannot be converted into Minerals, and unspent Vespene is lost.',
  },
];
