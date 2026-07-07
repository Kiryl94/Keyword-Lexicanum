/**
 * Curated Pathfinder 2e Remaster (ORC) keyword manifest.
 * Brief paraphrased summaries — not verbatim Paizo text.
 * @see https://paizo.com/licenses
 */

export const PF2E_DOCUMENT_TITLE = 'Pathfinder Player Core (Remaster)';
export const PF2E_DOCUMENT_URL = 'https://2e.aonprd.com/Rules.aspx';

/** @type {import('../src/lib/corpus/types.ts').CorpusEntry[]} */
export const PF2E_RULES = [
  {
    keyword: 'Off-Guard',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'You are flat-footed to attackers you cannot see or who have you at a serious positional disadvantage; they often gain benefits against your AC.',
    ruleRef: 'Conditions — Off-Guard',
    aliases: ['flat-footed', 'flat footed'],
  },
  {
    keyword: 'Frightened',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Shaken by fear; your frightened value reduces all your checks and DCs until it decreases at the end of your turn.',
    ruleRef: 'Conditions — Frightened',
  },
  {
    keyword: 'Grabbed',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Held by another creature; you are off-guard and cannot move until you Escape or the grab ends.',
    ruleRef: 'Conditions — Grabbed',
  },
  {
    keyword: 'Immobilized',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'You cannot use any action with the move trait; external forces or magic pin you in place.',
    ruleRef: 'Conditions — Immobilized',
  },
  {
    keyword: 'Prone',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'You are lying on the ground; melee attacks against you can be easier while ranged attacks can be harder until you Stand.',
    ruleRef: 'Conditions — Prone',
  },
  {
    keyword: 'Restrained',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Bound or entangled; you are off-guard, cannot use move actions, and have limited options until you break free.',
    ruleRef: 'Conditions — Restrained',
  },
  {
    keyword: 'Stunned',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Dazed or reeling; you lose actions at the start of your turn based on your stunned value.',
    ruleRef: 'Conditions — Stunned',
  },
  {
    keyword: 'Sickened',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Nauseated or ill; your sickened value penalizes your checks and DCs until it decreases.',
    ruleRef: 'Conditions — Sickened',
  },
  {
    keyword: 'Slowed',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'You have fewer actions at the start of your turn because of hindering magic or effects.',
    ruleRef: 'Conditions — Slowed',
  },
  {
    keyword: 'Strike',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Make a melee or ranged attack with a weapon or unarmed attack; roll against the target’s AC.',
    ruleRef: 'Actions — Strike',
  },
  {
    keyword: 'Stride',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Move up to your Speed; basic movement action used to reposition on the battlefield.',
    ruleRef: 'Actions — Stride',
  },
  {
    keyword: 'Step',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Move 5 feet without triggering reactions that care about your movement leaving a square.',
    ruleRef: 'Actions — Step',
  },
  {
    keyword: 'Raise Shield',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Gain your shield’s circumstance bonus to AC until the start of your next turn.',
    ruleRef: 'Actions — Raise Shield',
  },
  {
    keyword: 'Cast a Spell',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Use the spellcasting action appropriate to the spell’s casting time to produce a magical effect.',
    ruleRef: 'Actions — Cast a Spell',
  },
  {
    keyword: 'Seek',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Scan for hidden or undetected creatures and objects using Perception.',
    ruleRef: 'Actions — Seek',
  },
  {
    keyword: 'Hide',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Attempt to become hidden using Stealth against observers’ Perception.',
    ruleRef: 'Actions — Hide',
  },
  {
    keyword: 'Sneak',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Move while trying to stay undetected, rolling Stealth against observers.',
    ruleRef: 'Actions — Sneak',
  },
  {
    keyword: 'Demoralize',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Use Intimidation to frighten a foe within range who can perceive you.',
    ruleRef: 'Actions — Demoralize',
  },
  {
    keyword: 'Trip',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Athletics check to knock a target prone if you succeed against their Reflex DC.',
    ruleRef: 'Actions — Trip',
  },
  {
    keyword: 'Grapple',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Athletics check to grab a foe; success imposes the grabbed condition until it ends.',
    ruleRef: 'Actions — Grapple',
  },
  {
    keyword: 'Disarm',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Athletics check to knock an item from a foe’s grasp on a success.',
    ruleRef: 'Actions — Disarm',
  },
  {
    keyword: 'Shove',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Athletics check to push a foe back 5 feet or knock them prone.',
    ruleRef: 'Actions — Shove',
  },
  {
    keyword: 'Multiple Attack Penalty',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Each attack action after the first in your turn imposes a cumulative penalty on later attack rolls until your turn ends.',
    ruleRef: 'Combat — MAP',
    aliases: ['map'],
  },
  {
    keyword: 'Attack Roll',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'd20 roll plus modifiers versus a target’s AC (or other defense) to see if an attack hits.',
    ruleRef: 'Core — Attack Rolls',
  },
  {
    keyword: 'Saving Throw',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Fortitude, Reflex, or Will defense roll against an effect’s DC to resist harm or conditions.',
    ruleRef: 'Core — Saving Throws',
    aliases: ['save'],
  },
  {
    keyword: 'Perception',
    phase: 'Exploration',
    applicability: 'general',
    summary:
      'Wisdom-based skill for noticing threats, searching, and rolling initiative in many encounters.',
    ruleRef: 'Skills — Perception',
  },
  {
    keyword: 'Recall Knowledge',
    phase: 'Exploration',
    applicability: 'general',
    summary:
      'Use a Lore or relevant skill to remember useful facts about a creature, object, or topic.',
    ruleRef: 'Actions — Recall Knowledge',
  },
  {
    keyword: 'Flanking',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'You and an ally opposite a foe give each other flanking, making the target off-guard to your melee attacks.',
    ruleRef: 'Combat — Flanking',
  },
  {
    keyword: 'Cover',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Terrain or obstacles grant a circumstance bonus to AC and Reflex saves against area effects.',
    ruleRef: 'Combat — Cover',
  },
  {
    keyword: 'Reaction',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Special action triggered by a defined event; you get one reaction per round unless an effect says otherwise.',
    ruleRef: 'Core — Reactions',
  },
  {
    keyword: 'Free Action',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Costs no actions to use; only available when a rule or ability explicitly grants it.',
    ruleRef: 'Core — Free Actions',
  },
  {
    keyword: 'Three-Action Economy',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'On your turn you usually have three actions and one reaction; most activities cost one or more actions.',
    ruleRef: 'Core — Actions',
    aliases: ['actions'],
  },
  {
    keyword: 'Critical Success',
    phase: 'General',
    applicability: 'general',
    summary: 'Beat the DC or AC by 10 or more (or roll a natural 20 on an attack) for an improved outcome.',
    ruleRef: 'Core — Degrees of Success',
  },
  {
    keyword: 'Critical Failure',
    phase: 'General',
    applicability: 'general',
    summary: 'Miss the DC or AC by 10 or more (or roll a natural 1 on an attack) for a worse outcome.',
    ruleRef: 'Core — Degrees of Success',
  },
  {
    keyword: 'Persistent Damage',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Damage that repeats at the end of your turn until you succeed at a flat check to end it.',
    ruleRef: 'Combat — Persistent Damage',
  },
  {
    keyword: 'Shield Block',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Reaction when you take damage while your shield is raised to reduce damage with hardness.',
    ruleRef: 'Feats — Shield Block',
  },
  {
    keyword: 'Aid',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Prepare to help an ally; if your roll beats the DC, they gain a bonus to their check.',
    ruleRef: 'Actions — Aid',
  },
  {
    keyword: 'Ready',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Spend an action to define a trigger; you use a reaction when the trigger occurs.',
    ruleRef: 'Actions — Ready',
  },
  {
    keyword: 'Point-Out',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Indicate a hidden creature’s location so allies know where to target or seek.',
    ruleRef: 'Actions — Point Out',
  },
  {
    keyword: 'Treat Wounds',
    phase: 'Exploration',
    applicability: 'restricted',
    summary: 'Medicine activity to heal hit points outside combat over a span of time.',
    ruleRef: 'Actions — Treat Wounds',
  },
  {
    keyword: 'Identify Magic',
    phase: 'Exploration',
    applicability: 'general',
    summary: 'Use a magical tradition skill to learn the properties of a magic item or effect.',
    ruleRef: 'Actions — Identify Magic',
  },
  {
    keyword: 'Blinded',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Cannot see; you automatically fail sight-based checks and attacks against you may gain benefits.',
    ruleRef: 'Conditions — Blinded',
  },
  {
    keyword: 'Dazzled',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Visual overload; you take a penalty on sight-based Perception checks until the effect ends.',
    ruleRef: 'Conditions — Dazzled',
  },
  {
    keyword: 'Deafened',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Cannot hear; you automatically fail hearing-based checks and some auditory effects fail.',
    ruleRef: 'Conditions — Deafened',
  },
  {
    keyword: 'Clumsy',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Your clumsy value penalizes Dexterity-based checks and DCs until it decreases.',
    ruleRef: 'Conditions — Clumsy',
  },
  {
    keyword: 'Drained',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Life force sapped; your drained value reduces your maximum Hit Points until it decreases.',
    ruleRef: 'Conditions — Drained',
  },
  {
    keyword: 'Enfeebled',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Weakened physically; your enfeebled value penalizes Strength-based checks and DCs.',
    ruleRef: 'Conditions — Enfeebled',
  },
  {
    keyword: 'Stupefied',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Mentally dulled; your stupefied value penalizes mental checks, DCs, and spell rolls.',
    ruleRef: 'Conditions — Stupefied',
  },
  {
    keyword: 'Quickened',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'You gain an extra action at the start of your turn from a spell or effect.',
    ruleRef: 'Conditions — Quickened',
  },
  {
    keyword: 'Fatigued',
    phase: 'Exploration',
    applicability: 'general',
    summary: 'Worn out from exertion; you cannot gain temporary Hit Points and may take other penalties.',
    ruleRef: 'Conditions — Fatigued',
  },
  {
    keyword: 'Unconscious',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Knocked out; you cannot act and are off-guard until you regain consciousness.',
    ruleRef: 'Conditions — Unconscious',
  },
  {
    keyword: 'Dying',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'At 0 HP and losing life; you must attempt recovery checks or worsen toward death each round.',
    ruleRef: 'Conditions — Dying',
  },
  {
    keyword: 'Wounded',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Serious injury stacks when you regain consciousness from dying, making future recovery harder.',
    ruleRef: 'Conditions — Wounded',
  },
  {
    keyword: 'Flat Check',
    phase: 'General',
    applicability: 'general',
    summary:
      'Roll d20 against a fixed DC with no modifiers; used to end persistent damage and similar effects.',
    ruleRef: 'Core — Flat Checks',
  },
  {
    keyword: 'Hero Point',
    phase: 'General',
    applicability: 'general',
    summary:
      'Spend to reroll a check, avoid death, or use a class feat — usually one per session unless you earn more.',
    ruleRef: 'Core — Hero Points',
    aliases: ['hero points'],
  },
  {
    keyword: 'Initiative',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Perception roll at combat start to determine turn order for all participants.',
    ruleRef: 'Combat — Initiative',
  },
  {
    keyword: 'Interact',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Draw, stow, pick up, or manipulate an object you can reach — one action in most cases.',
    ruleRef: 'Actions — Interact',
  },
  {
    keyword: 'Escape',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Athletics or Acrobatics check to break free from grab, restraint, or similar immobilization.',
    ruleRef: 'Actions — Escape',
  },
  {
    keyword: 'Stand',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Rise from prone to standing; costs an action unless an ability says otherwise.',
    ruleRef: 'Actions — Stand',
  },
  {
    keyword: 'Take Cover',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Hunker behind cover to gain its circumstance bonus until you move away.',
    ruleRef: 'Actions — Take Cover',
  },
  {
    keyword: 'Sustain a Spell',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Spend an action to extend the duration of a spell you are already concentrating on.',
    ruleRef: 'Actions — Sustain a Spell',
  },
  {
    keyword: 'Feint',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Deception check to make a foe off-guard to your melee attacks until the end of your turn.',
    ruleRef: 'Actions — Feint',
  },
  {
    keyword: 'Concealed',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Harder to see clearly; creatures must succeed at a flat check to target you with some effects.',
    ruleRef: 'Conditions — Concealed',
  },
  {
    keyword: 'Invisible',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Cannot be seen; you are undetected to creatures that cannot perceive you otherwise.',
    ruleRef: 'Conditions — Invisible',
  },
  {
    keyword: 'Hidden',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Undetected by some creatures; they must Seek or guess your square to target you.',
    ruleRef: 'Conditions — Hidden',
  },
  {
    keyword: 'Leap',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Jump horizontally or vertically up to your maximum Leap distance without a check.',
    ruleRef: 'Actions — Leap',
  },
  {
    keyword: 'Reactive Strike',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Reaction when a foe triggers it by moving or manipulating within reach; make a melee Strike against that creature.',
    ruleRef: 'Actions — Reactive Strike',
    aliases: ['attack of opportunity', 'aoo'],
  },
  {
    keyword: 'Reach',
    phase: 'General',
    applicability: 'general',
    summary:
      'How many squares away you can Strike with a melee weapon; most reach weapons extend your threat beyond adjacent squares.',
    ruleRef: 'Equipment — Reach',
  },
  {
    keyword: 'Confused',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Mentally disoriented; you may attack the wrong target or act unpredictably until the condition ends.',
    ruleRef: 'Conditions — Confused',
  },
  {
    keyword: 'Fascinated',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Captivated by something; you cannot use concentrate actions except to focus on the source until it ends.',
    ruleRef: 'Conditions — Fascinated',
  },
  {
    keyword: 'Petrified',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Turned to stone; you are immobilized, cannot act, and have object immunities until the effect is removed.',
    ruleRef: 'Conditions — Petrified',
  },
  {
    keyword: 'Fortitude Save',
    phase: 'General',
    applicability: 'general',
    summary:
      'Resist physical effects such as poison, disease, or bodily harm using your Constitution modifier.',
    ruleRef: 'Core — Fortitude',
    aliases: ['fortitude', 'fortitude saving throw'],
  },
  {
    keyword: 'Reflex Save',
    phase: 'General',
    applicability: 'general',
    summary:
      'Dodge sudden danger such as explosions or traps using your Dexterity modifier.',
    ruleRef: 'Core — Reflex',
    aliases: ['reflex', 'reflex saving throw'],
  },
  {
    keyword: 'Will Save',
    phase: 'General',
    applicability: 'general',
    summary:
      'Resist mental effects such as charms or fear using your Wisdom modifier.',
    ruleRef: 'Core — Will',
    aliases: ['will', 'will saving throw'],
  },
  {
    keyword: 'Degree of Success',
    phase: 'General',
    applicability: 'general',
    summary:
      'Compare your roll to the DC: critical success beats by 10+, success meets DC, failure misses, critical failure fails by 10+.',
    ruleRef: 'Core — Degrees of Success',
    aliases: ['degrees of success'],
  },
  {
    keyword: 'Detect Magic',
    phase: 'Exploration',
    applicability: 'restricted',
    summary:
      'Sense magical auras within range; reveals presence, school, and strength of magic on objects or creatures.',
    ruleRef: 'Spells — Detect Magic',
  },
  {
    keyword: 'Treat Poison',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Medicine check to help a poisoned ally; may reduce stage or grant a bonus on their next save against the poison.',
    ruleRef: 'Actions — Treat Poison',
  },
  {
    keyword: 'Administer First Aid',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Stabilize a dying creature or grant temporary hit points with a Medicine check during combat.',
    ruleRef: 'Actions — Administer First Aid',
    aliases: ['first aid'],
  },
  {
    keyword: 'Banishment',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Sent to another plane or dimension; you cannot act on your current plane until the effect ends.',
    ruleRef: 'Conditions — Banishment',
  },
  {
    keyword: 'Doomed',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Fate turns against you; your doomed value makes death more likely when you reach dying.',
    ruleRef: 'Conditions — Doomed',
  },
  {
    keyword: 'Counteract',
    phase: 'General',
    applicability: 'general',
    summary:
      'Use spell rank and a skill check to end an ongoing spell or magical effect on a target.',
    ruleRef: 'Core — Counteract',
    aliases: ['counteract check'],
  },
  {
    keyword: 'Controlled',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Another creature directs your actions; you follow their orders until the effect ends.',
    ruleRef: 'Conditions — Controlled',
  },
  {
    keyword: 'Paralyzed',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Frozen in place; you cannot act and are off-guard until the paralysis ends.',
    ruleRef: 'Conditions — Paralyzed',
  },
  {
    keyword: 'Stabilize',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Medicine check to keep a dying creature from losing more Hit Points before healing.',
    ruleRef: 'Actions — Stabilize',
  },
  {
    keyword: 'Command',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Direct an animal companion or similar ally to take a specific action on its turn.',
    ruleRef: 'Actions — Command an Animal',
    aliases: ['command an animal'],
  },
  {
    keyword: 'Finesse',
    phase: 'General',
    applicability: 'general',
    summary:
      'Weapon trait letting you use Dexterity instead of Strength on attack and damage rolls.',
    ruleRef: 'Equipment — Finesse',
  },
  {
    keyword: 'Cursed',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Afflicted by a curse; your cursed value imposes penalties until the curse is removed.',
    ruleRef: 'Conditions — Cursed',
  },
  {
    keyword: 'Avert Gaze',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Look away from a visual threat to avoid its worst effect, often at the cost of awareness.',
    ruleRef: 'Actions — Avert Gaze',
  },
  {
    keyword: 'Coerce',
    phase: 'General',
    applicability: 'restricted',
    summary:
      'Intimidation check to bully someone into cooperating for a short time.',
    ruleRef: 'Actions — Coerce',
  },
  {
    keyword: 'Volley',
    phase: 'General',
    applicability: 'general',
    summary:
      'Ranged weapon trait penalizing shots made against targets closer than the listed distance.',
    ruleRef: 'Equipment — Volley',
  },
  {
    keyword: 'Thrown',
    phase: 'General',
    applicability: 'general',
    summary:
      'Weapon trait for items designed to be hurled; uses a thrown range increment.',
    ruleRef: 'Equipment — Thrown',
  },
  {
    keyword: 'Delay',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Push your turn later in the initiative order so you can act after allies or react to foes.',
    ruleRef: 'Actions — Delay',
  },
  {
    keyword: 'Crawl',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Move while prone at half Speed without standing up first.',
    ruleRef: 'Actions — Crawl',
  },
  {
    keyword: 'Climb',
    phase: 'General',
    applicability: 'restricted',
    summary:
      'Athletics check to scale a surface; failure may mean a fall or no progress.',
    ruleRef: 'Actions — Climb',
  },
  {
    keyword: 'Swim',
    phase: 'General',
    applicability: 'restricted',
    summary:
      'Athletics check to move through water; currents and armor can impose penalties.',
    ruleRef: 'Actions — Swim',
  },
  {
    keyword: 'Deadly',
    phase: 'General',
    applicability: 'general',
    summary:
      'Weapon trait that adds extra damage dice on a critical hit.',
    ruleRef: 'Equipment — Deadly',
  },
  {
    keyword: 'Hustle',
    phase: 'Exploration',
    applicability: 'restricted',
    summary:
      'Move faster than a normal Stride while exploring, often at the cost of Perception or stealth.',
    ruleRef: 'Actions — Hustle',
  },
  {
    keyword: 'Track',
    phase: 'Exploration',
    applicability: 'restricted',
    summary:
      'Survival check to follow signs of a creature or party through the wilderness.',
    ruleRef: 'Actions — Track',
  },
  {
    keyword: 'Balance',
    phase: 'General',
    applicability: 'restricted',
    summary:
      'Acrobatics check to move across a narrow or unstable surface without falling.',
    ruleRef: 'Actions — Balance',
  },
  {
    keyword: 'Agile',
    phase: 'General',
    applicability: 'general',
    summary:
      'Weapon trait that reduces the multiple attack penalty on later Strikes with that weapon.',
    ruleRef: 'Equipment — Agile',
  },
  {
    keyword: 'Forceful',
    phase: 'General',
    applicability: 'general',
    summary:
      'Weapon trait that can push a target back on a critical hit.',
    ruleRef: 'Equipment — Forceful',
  },
];
