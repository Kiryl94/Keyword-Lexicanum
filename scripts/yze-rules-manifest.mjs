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
];
