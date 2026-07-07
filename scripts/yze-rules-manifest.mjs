/**
 * Curated Year Zero Engine SRD keyword manifest (FTL).
 * Brief paraphrased summaries — not verbatim Free League text.
 * @see https://freeleaguepublishing.com/community-content/free-tabletop-licenses/
 */

export const YZE_DOCUMENT_TITLE = 'Year Zero Engine Standard Reference Document';
export const YZE_DOCUMENT_URL =
  'https://freeleaguepublishing.com/wp-content/uploads/2023/11/YZE-Standard-Reference-Document.pdf';

/** @type {import('../src/lib/corpus/types.ts').CorpusEntry[]} */
export const YZE_RULES = [
  {
    keyword: 'Attribute',
    phase: 'General',
    applicability: 'general',
    summary:
      'Core physical and mental stats (Strength, Agility, Wits, Empathy) that define what your character is good at.',
    ruleRef: 'SRD — Attributes',
  },
  {
    keyword: 'Skill',
    phase: 'General',
    applicability: 'general',
    summary:
      'Trained ability tied to an attribute; you roll attribute + skill when attempting related tasks.',
    ruleRef: 'SRD — Skills',
  },
  {
    keyword: 'Skill Roll',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Roll a pool of base dice plus skill dice; each six counts as a success toward the difficulty.',
    ruleRef: 'SRD — Dice Pool Rolls',
    aliases: ['roll'],
  },
  {
    keyword: 'Push',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'After a roll you may push to reroll unset dice, but you suffer a condition or stress for the risk.',
    ruleRef: 'SRD — Push',
  },
  {
    keyword: 'Condition',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Temporary state such as Exhausted or Scared that imposes penalties until cleared or reduced.',
    ruleRef: 'SRD — Conditions',
  },
  {
    keyword: 'Slow Action',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'One of your two actions per round; used for heavier activities like aiming or moving far.',
    ruleRef: 'SRD — Actions',
  },
  {
    keyword: 'Fast Action',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Quick action such as drawing a weapon, ducking, or reloading in many YZE games.',
    ruleRef: 'SRD — Actions',
  },
  {
    keyword: 'Critical',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Exceptional success on a roll — often extra damage or a bonus effect depending on the game.',
    ruleRef: 'SRD — Critical Hits',
  },
  {
    keyword: 'Damage',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Harm applied when an attack succeeds; may reduce hit points or inflict critical injuries.',
    ruleRef: 'SRD — Damage',
  },
  {
    keyword: 'Cover',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Terrain that makes you harder to hit; attackers suffer penalties or lose dice.',
    ruleRef: 'SRD — Cover',
  },
  {
    keyword: 'Initiative',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Roll at the start of combat to determine turn order for the round.',
    ruleRef: 'SRD — Initiative',
  },
  {
    keyword: 'Range',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Distance bands (point-blank, short, long) that affect whether attacks are possible and how hard they are.',
    ruleRef: 'SRD — Range',
  },
  {
    keyword: 'Step Dice',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Alternate YZE mode using polyhedral step dice instead of d6 pools; used in several newer titles.',
    ruleRef: 'SRD — Step Dice',
  },
  {
    keyword: 'Gear',
    phase: 'Exploration',
    applicability: 'general',
    summary: 'Equipment and supplies tracked on your sheet; may provide bonuses or consumable uses.',
    ruleRef: 'SRD — Gear',
  },
  {
    keyword: 'Experience',
    phase: 'Downtime',
    applicability: 'general',
    summary: 'Points earned from play spent to improve skills or gain talents between sessions.',
    ruleRef: 'SRD — Experience',
  },
  {
    keyword: 'Talent',
    phase: 'Downtime',
    applicability: 'general',
    summary: 'Special ability or edge purchased with experience that bends the core rules in your favor.',
    ruleRef: 'SRD — Talents',
  },
  {
    keyword: 'Stress',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Mental strain from horror or pressure; in many YZE games pushing rolls adds stress that must be relieved.',
    ruleRef: 'SRD — Stress',
  },
  {
    keyword: 'Block',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Defensive reaction that spends an action to reduce or negate an incoming attack before it lands.',
    ruleRef: 'SRD — Block',
  },
  {
    keyword: 'Dodge',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Defensive reaction to avoid an attack entirely on a successful opposed roll.',
    ruleRef: 'SRD — Dodge',
  },
  {
    keyword: 'Travel',
    phase: 'Exploration',
    applicability: 'restricted',
    summary: 'Overland movement between scenes; may consume time, supplies, and trigger encounters.',
    ruleRef: 'SRD — Travel',
  },
  {
    keyword: 'Vehicle',
    phase: 'Exploration',
    applicability: 'restricted',
    summary: 'Mounted or driven transport with its own stats, damage tracks, and maneuver rules.',
    ruleRef: 'SRD — Vehicles',
  },
  {
    keyword: 'Chase',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Structured pursuit where participants roll to close distance or escape each round.',
    ruleRef: 'SRD — Chases',
  },
  {
    keyword: 'Magic',
    phase: 'Encounter',
    applicability: 'restricted',
    summary:
      'Supernatural powers defined by the specific YZE game; usually costs willpower or similar resource.',
    ruleRef: 'SRD — Magic',
  },
  {
    keyword: 'Willpower',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Resource spent to resist fear, use powers, or push beyond normal limits in many YZE games.',
    ruleRef: 'SRD — Willpower',
  },
  {
    keyword: 'Difficulty',
    phase: 'General',
    applicability: 'general',
    summary: 'Target number of successes the GM sets for a task based on how hard the action is.',
    ruleRef: 'SRD — Difficulty',
  },
  {
    keyword: 'Hit Points',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Health pool; when reduced to zero you risk critical injuries or death depending on the game.',
    ruleRef: 'SRD — Hit Points',
    aliases: ['hp'],
  },
  {
    keyword: 'Armor',
    phase: 'General',
    applicability: 'general',
    summary: 'Protective gear that reduces damage taken or makes you harder to hit in many YZE games.',
    ruleRef: 'SRD — Armor',
  },
  {
    keyword: 'Weapon',
    phase: 'General',
    applicability: 'general',
    summary: 'Gear used to attack; defines damage, range, and special traits for combat rolls.',
    ruleRef: 'SRD — Weapons',
  },
  {
    keyword: 'Base Dice',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'd6 dice from your attribute rating added to every skill roll in the classic dice-pool mode.',
    ruleRef: 'SRD — Base Dice',
  },
  {
    keyword: 'Skill Dice',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Extra d6 dice from your trained skill level, rolled alongside base dice on skill checks.',
    ruleRef: 'SRD — Skill Dice',
  },
  {
    keyword: 'Panicked',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Overwhelmed by fear; you must flee or cower and cannot act normally until the condition clears.',
    ruleRef: 'SRD — Panicked',
  },
  {
    keyword: 'Encumbered',
    phase: 'Exploration',
    applicability: 'general',
    summary: 'Carrying too much; movement and physical rolls may suffer until you drop weight.',
    ruleRef: 'SRD — Encumbrance',
  },
  {
    keyword: 'Stealth',
    phase: 'Exploration',
    applicability: 'restricted',
    summary: 'Skill to move quietly and stay unseen; opposed by observers’ perception in many scenes.',
    ruleRef: 'SRD — Stealth',
  },
  {
    keyword: 'Supply',
    phase: 'Exploration',
    applicability: 'general',
    summary: 'Food, ammo, or consumables tracked on the sheet; depletes during travel and downtime.',
    ruleRef: 'SRD — Supplies',
    aliases: ['supplies'],
  },
  {
    keyword: 'Relieve Stress',
    phase: 'Downtime',
    applicability: 'restricted',
    summary: 'Rest, comfort, or downtime activity that removes accumulated stress between intense scenes.',
    ruleRef: 'SRD — Stress Relief',
  },
  {
    keyword: 'Opposed Roll',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Both sides roll; the higher number of successes wins the contest.',
    ruleRef: 'SRD — Opposed Rolls',
  },
  {
    keyword: 'Botch',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Catastrophic failure on a roll — often when no successes are rolled and at least one die shows 1.',
    ruleRef: 'SRD — Botch',
    aliases: ['fumble'],
  },
  {
    keyword: 'Ammo',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Ranged attacks consume ammunition tracked on your sheet unless the weapon says otherwise.',
    ruleRef: 'SRD — Ammunition',
    aliases: ['ammunition'],
  },
  {
    keyword: 'Broken',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Serious harm state from a critical injury; imposes lasting penalties until treated or healed.',
    ruleRef: 'SRD — Broken',
  },
  {
    keyword: 'Exhausted',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Fatigued from exertion or hardship; physical rolls suffer until you rest or recover.',
    ruleRef: 'SRD — Exhausted',
  },
  {
    keyword: 'Scared',
    phase: 'Encounter',
    applicability: 'general',
    summary: 'Frightened condition that penalizes composure rolls until the source of fear passes.',
    ruleRef: 'SRD — Scared',
  },
  {
    keyword: 'Critical Injury',
    phase: 'Encounter',
    applicability: 'general',
    summary:
      'Severe wound from a critical hit; roll on the injury table for lasting effects or broken state.',
    ruleRef: 'SRD — Critical Injuries',
  },
  {
    keyword: 'Melee Combat',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Close-quarters fighting using hand-to-hand weapons or brawling at short range.',
    ruleRef: 'SRD — Melee',
  },
  {
    keyword: 'Ranged Combat',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Attacks at a distance using firearms, bows, or thrown weapons with range penalties.',
    ruleRef: 'SRD — Ranged Combat',
  },
  {
    keyword: 'Sneak Attack',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Strike an unaware or surprised foe for extra damage or an easier hit in many YZE games.',
    ruleRef: 'SRD — Sneak Attack',
  },
  {
    keyword: 'Ambush',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Surprise opening where prepared attackers act before defenders can react.',
    ruleRef: 'SRD — Ambush',
  },
  {
    keyword: 'Combat Round',
    phase: 'Encounter',
    applicability: 'restricted',
    summary: 'Structured slice of battle where each participant takes fast and slow actions in turn order.',
    ruleRef: 'SRD — Combat Round',
  },
  {
    keyword: 'Rest',
    phase: 'Downtime',
    applicability: 'restricted',
    summary: 'Extended downtime to recover hit points, clear conditions, or relieve stress between scenes.',
    ruleRef: 'SRD — Rest',
  },
  {
    keyword: 'Heal',
    phase: 'Downtime',
    applicability: 'restricted',
    summary: 'Medical care or first aid that restores hit points or stabilizes critical injuries.',
    ruleRef: 'SRD — Healing',
  },
  {
    keyword: 'Repair',
    phase: 'Downtime',
    applicability: 'restricted',
    summary: 'Fix damaged gear, vehicles, or equipment using appropriate skills and spare parts.',
    ruleRef: 'SRD — Repair',
  },
  {
    keyword: 'Craft',
    phase: 'Downtime',
    applicability: 'restricted',
    summary: 'Create or modify gear during downtime using skills, materials, and time.',
    ruleRef: 'SRD — Crafting',
  },
  {
    keyword: 'Rot',
    phase: 'Exploration',
    applicability: 'general',
    summary:
      'Decay track for food and supplies in horror-themed YZE games; spoiled goods impose risk if used.',
    ruleRef: 'SRD — Rot',
  },
  {
    keyword: 'Darkness',
    phase: 'Exploration',
    applicability: 'general',
    summary: 'Low visibility that penalizes sight-based rolls and may hide threats until they close in.',
    ruleRef: 'SRD — Darkness',
  },
];
