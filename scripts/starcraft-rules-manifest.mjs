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

  // —— Actions & combat resolution ——
  {
    keyword: 'Charge',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['8.7.7 CHARGE'],
    ruleRef: '8.7.7',
    summary:
      'An unengaged ground unit moves into the Engagement Range of declared enemy units, crossing open ground with a charge move.',
  },
  {
    keyword: 'Disengage',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['8.5.4 DISENGAGE'],
    ruleRef: '8.5.4',
    summary:
      'An engaged unit withdraws from melee during the Movement Phase. Disengaging triggers the Tactical Mass penalty for that activation.',
  },
  {
    keyword: 'Deploy',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['8.5.5 DEPLOY'],
    ruleRef: '8.5.5',
    summary:
      'A unit in Reserves enters the battlefield during the Movement Phase if its Current Supply fits within your Available Supply.',
  },
  {
    keyword: 'Run',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['8.7.1 RUN'],
    ruleRef: '8.7.1',
    summary:
      'During the Assault Phase, a unit repositions without attacking—often to claim Mission Markers or improve its firing angle.',
  },
  {
    keyword: 'Flying',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['7.1.4 FLYING UNITS AND COVER'],
    ruleRef: '7.1.4',
    summary:
      'When checking line of sight to or from a Flying model, ignore Full Cover. For cover purposes, treat its Effective Size as higher than any terrain on the table.',
  },
  {
    keyword: 'Reaction',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['Reaction Abilities allow a player to act outside'],
    ruleRef: '2.7.3',
    summary:
      'Reaction Abilities let a player respond to specific events outside the normal activation sequence, as defined on the ability card.',
  },
  {
    keyword: 'Burrow',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['BURROWED is classified as a Status'],
    ruleRef: '11',
    summary:
      'Burrowed units gain HIDDEN, have Size treated as 0, and refresh HIDDEN at the start of each round while burrowed.',
  },
  {
    keyword: 'Tactical Mass',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['TACTICAL MASS'],
    ruleRef: '8.5.4',
    summary:
      'A unit that Disengages suffers Tactical Mass: it cannot make Ranged Attacks during that activation.',
  },
  {
    keyword: 'First Player Marker',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['FIRST PLAYER MARKER'],
    ruleRef: '8.6',
    summary:
      'Physical token tracking initiative. The roll-off winner holds it at game start; the first player to Pass in a phase takes it for the next phase.',
  },
  {
    keyword: 'Sidearm',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['When this Unit performs a Ranged Attack or Close'],
    ruleRef: '11',
    summary:
      'Sidearm weapons can be fired alongside a model\'s primary weapon, ignoring the normal one-weapon-per-model restriction.',
  },
  {
    keyword: 'Combat Tag',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['Combat Tags identify a Unit'],
    ruleRef: '11',
    summary:
      'Combat Tags identify a unit\'s physical nature and tactical class (e.g. Armoured, Biological, Light). Many weapon keywords such as Surge and Pierce apply only against matching tags.',
  },
  {
    keyword: 'Critical Hit',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['CRITICAL HIT (X)'],
    ruleRef: '11',
    summary:
      'Critical Hit (X) moves up to X dice from the Armour Pool directly to the Damage Pool, bypassing armour rolls.',
  },
  {
    keyword: 'Evade',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['A Null Value (-): The Unit cannot make Evade Rolls'],
    ruleRef: '5',
    summary:
      'After armour rolls, the defender may Evade to discard dice from the Damage Pool. A unit with Evade (-) cannot make Evade rolls unless an ability explicitly grants one.',
  },
  {
    keyword: 'Rate of Attack',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['Rate of Attack: Dice rolled per firing model'],
    ruleRef: '5',
    summary:
      'Rate of Attack (RoA) is the number of dice rolled per firing model when making a ranged attack profile.',
  },
  {
    keyword: 'Armour Roll',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['3. ARMOUR ROLLS'],
    ruleRef: '8.7.3',
    summary:
      'The defender rolls all dice in the Armour Pool; each die meeting or exceeding the unit\'s Armour characteristic is discarded as a successful save.',
  },
  {
    keyword: 'Attack Pool',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['three-pool system: dice move from the Attack Pool'],
    ruleRef: '8.7.3',
    summary:
      'Ranged attacks resolve through three pools: dice start in the Attack Pool (hit rolls), move to the Armour Pool, then to the Damage Pool.',
  },
  {
    keyword: 'Damage Pool',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['DAMAGE POOL. Each die remaining in this pool inflicts'],
    ruleRef: '8.7.3',
    summary:
      'Each die remaining in the Damage Pool after armour (and any Evade rolls) inflicts Damage equal to the weapon\'s Damage characteristic.',
  },
  {
    keyword: 'Pierce',
    phase: 'Assault Phase',
    applicability: 'restricted',
    labels: ['PIERCE (X) often apply only against specific tags'],
    ruleRef: '11',
    summary:
      'Pierce (X) often applies only against specific Combat Tags, increasing the Damage each successful die deals when the target matches.',
  },
  {
    keyword: 'Scoring Phase',
    phase: 'Battle Round',
    applicability: 'restricted',
    labels: ['Score, cleanup, set initiative'],
    ruleRef: '8.9',
    summary:
      'Phase 4 of each round: determine Mission Marker control, score victory points, resolve end-of-round effects, and refresh activation markers.',
  },
];
