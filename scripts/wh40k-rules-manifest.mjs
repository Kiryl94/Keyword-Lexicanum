/**
 * Curated WH40k 11th ed core rules keywords.
 * Summaries are brief paraphrases for quick lookup; full rule text lives in the linked PDF.
 */

/** @typedef {{ keyword: string, phase: string, applicability: 'general' | 'restricted', labels: string[], summary: string, ruleRef?: string }} Wh40kRule */

/** @type {Wh40kRule[]} */
export const WH40K_RULES = [
  // —— Turn structure ——
  {
    keyword: 'Battle Round',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['THE BATTLE ROUND', '07.01'],
    ruleRef: '07.01',
    summary:
      'One full cycle in which each player completes a turn. When both players have taken a turn, the battle round ends and the next one begins.',
  },
  {
    keyword: 'Command Phase',
    phase: 'Command Phase',
    applicability: 'restricted',
    labels: ['COMMAND PHASE', '08.01'],
    ruleRef: '08.01',
    summary:
      'The first phase of your turn. You gain Command Points, resolve Battleshock tests, and trigger any start-of-turn abilities before moving on.',
  },
  {
    keyword: 'Movement Phase',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['MOVEMENT PHASE', '09.01'],
    ruleRef: '09.01',
    summary:
      'Units move across the battlefield, including normal moves, advances, and fall-back moves, following coherency, terrain, and transport rules.',
  },
  {
    keyword: 'Shooting Phase',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['SHOOTING PHASE', '10.01'],
    ruleRef: '10.01',
    summary:
      'Units with eligible ranged weapons select targets and resolve shooting attacks, following visibility, range, and weapon ability restrictions.',
  },
  {
    keyword: 'Charge Phase',
    phase: 'Charge Phase',
    applicability: 'restricted',
    labels: ['CHARGE PHASE', '11.01'],
    ruleRef: '11.01',
    summary:
      'Eligible units declare charges against enemy units within range and attempt to move into engagement range using a charge roll.',
  },
  {
    keyword: 'Fight Phase',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['FIGHT PHASE', 'START OF FIGHT PHASE', '12.01'],
    ruleRef: '12.01',
    summary:
      'Units within engagement range (including those that charged) make close-combat attacks, with players alternating unit activations.',
  },
  {
    keyword: 'Stratagems',
    phase: 'Command Phase',
    applicability: 'general',
    labels: ['Stratagems can be used', '15.01'],
    ruleRef: '15.01',
    summary:
      'Players spend Command Points on stratagems to create epic tactical moments when a critical point in the battle is reached, where extra effects can tip the balance in their favour. See the core rules PDF (rule 15.01) for how to use them and for individual stratagem cards.',
  },

  // —— Core concepts ——
  {
    keyword: 'Engagement Range',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['03.04', 'engagement range is the area'],
    ruleRef: '03.04',
    summary:
      'The area within 2" horizontally and 5" vertically of a model. Models in engagement range of enemies can fight in the Fight Phase.',
  },
  {
    keyword: 'Engagement',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['WITHIN ENGAGEMENT RANGE', '03.04'],
    ruleRef: '03.04',
    summary:
      'Models that are within engagement range of enemy models are engaged and can make close-combat attacks during the Fight Phase.',
  },
  {
    keyword: 'Coherency',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['COHERENCY', '02.03'],
    ruleRef: '02.03',
    summary:
      'Each model in a unit must stay within 2" horizontally and 5" vertically of at least two other models from the same unit.',
  },
  {
    keyword: 'Line of Sight',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['VISIBILITY 06.01', 'line of sight'],
    ruleRef: '06.01',
    summary:
      'A model has line of sight to another if a 1 mm line can be drawn from any part of one model to any part of the other, ignoring models in their own units.',
  },
  {
    keyword: 'Cover',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['COVER 13.08', 'benefit of cover'],
    ruleRef: '13.08',
    summary:
      'Models that have cover gain +1 to their saving throws against ranged attacks that meet the cover conditions in the terrain rules.',
  },
  {
    keyword: 'Objectives',
    phase: 'Battle Round',
    applicability: 'general',
    labels: ['CONTROLLING A TERRAIN OBJECTIVE', '14.01'],
    ruleRef: '14.01',
    summary:
      'Players score victory points by controlling objective markers on the battlefield, checked at the end of each battle round unless a mission says otherwise.',
  },
  {
    keyword: 'Battle-shock',
    phase: 'Command Phase',
    applicability: 'restricted',
    labels: ['BATTLE-SHOCK', '08.01'],
    ruleRef: '08.01',
    summary:
      'At the start of your Command Phase, units below Starting Strength take a Battleshock test; failing units suffer penalties until your next Command Phase.',
  },
  {
    keyword: 'Reserves',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['20.01', 'STRATEGIC RESERVES'],
    ruleRef: '20.01',
    summary:
      'Units held off the board in Strategic Reserves can arrive during the battle from board edges or via abilities such as Deep Strike, subject to mission limits.',
  },
  {
    keyword: 'Transports',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['18.01', 'TRANSPORTS'],
    ruleRef: '18.01',
    summary:
      'Transport vehicles can embark and disembark friendly infantry models, with specific rules for when passengers can shoot, fight, or arrive from Reserves.',
  },
  {
    keyword: 'Terrain',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['TERRAIN AND MOVEMENT', '13.01'],
    ruleRef: '13.01',
    summary:
      'Terrain features affect how models move, what they can see, and whether they gain cover or other benefits during the battle.',
  },
  {
    keyword: 'Pile-in',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['PILE-IN MOVES 12.02', 'PILE-IN MOVE'],
    ruleRef: '12.02',
    summary:
      'At the start of a unit\'s fight activation, each model may move up to 3" toward the closest enemy model before making attacks.',
  },
  {
    keyword: 'Consolidate',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['CONSOLIDATION MOVE 12.08', 'ONGOING CONSOLIDATION'],
    ruleRef: '12.08',
    summary:
      'After a unit finishes its close-combat attacks, each model may move up to 3" to reposition or move toward the nearest enemy model.',
  },

  // —— Core abilities (section 24) ——
  {
    keyword: 'Anti',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['[ANTI] 24.03'],
    ruleRef: '24.03',
    summary:
      'Anti weapons have an improved critical wound roll against targets with a specified keyword (written as Anti X+).',
  },
  {
    keyword: 'Assault',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[ASSAULT] 24.04'],
    ruleRef: '24.04',
    summary:
      'Assault weapons can be fired after the unit advances, though other restrictions on advancing units still apply.',
  },
  {
    keyword: 'Blast',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[BLAST] 24.05'],
    ruleRef: '24.05',
    summary:
      'When gathering attack dice for a Blast weapon, add one extra attack die for every five models in the target unit (rounding down).',
  },
  {
    keyword: 'Cleave',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['[CLEAVE] 24.06'],
    ruleRef: '24.06',
    summary:
      'When a Cleave weapon scores a critical hit, the attacking model may immediately make additional attacks against the same target.',
  },
  {
    keyword: 'Close Quarters',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[CLOSE-QUARTERS] 24.07'],
    ruleRef: '24.07',
    summary:
      'While engaged, a unit can only shoot with Close Quarters weapons and may only target enemy units it is engaged with.',
  },
  {
    keyword: 'Deadly Demise',
    phase: 'General',
    applicability: 'general',
    labels: ['DEADLY DEMISE 24.08'],
    ruleRef: '24.08',
    summary:
      'When a model with Deadly Demise is destroyed, roll a D6; on a specified result it inflicts mortal wounds on nearby units.',
  },
  {
    keyword: 'Deep Strike',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['DEEP STRIKE 24.09'],
    ruleRef: '24.09',
    summary:
      'Units with Deep Strike can be set up from Reserves more than 9" horizontally away from all enemy models during the Movement phase.',
  },
  {
    keyword: 'Devastating Wounds',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['[DEVASTATING WOUNDS] 24.10'],
    ruleRef: '24.10',
    summary:
      'A critical wound with a Devastating Wounds weapon inflicts mortal wounds equal to that weapon\'s Damage characteristic.',
  },
  {
    keyword: 'Extra Attacks',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['[EXTRA ATTACKS] 24.11'],
    ruleRef: '24.11',
    summary:
      'Models with Extra Attacks weapons may make additional attacks under the conditions stated on their datasheet or ability.',
  },
  {
    keyword: 'Feel No Pain',
    phase: 'General',
    applicability: 'general',
    labels: ['FEEL NO PAIN 24.12'],
    ruleRef: '24.12',
    summary:
      'Each time a model with Feel No Pain X+ would lose a wound, roll one D6; on X+ that wound is ignored.',
  },
  {
    keyword: 'Fights First',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['FIGHTS FIRST 24.13'],
    ruleRef: '24.13',
    summary:
      'Units with Fights First are selected to fight before other eligible units when resolving the Fight Phase.',
  },
  {
    keyword: 'Firing Deck',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['FIRING DECK 24.14'],
    ruleRef: '24.14',
    summary:
      'Embarked models with Firing Deck can shoot from a transport as if they were disembarked, subject to the ability\'s stated limits.',
  },
  {
    keyword: 'Hazardous',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[HAZARDOUS] 24.15'],
    ruleRef: '24.15',
    summary:
      'After a unit shoots or fights with Hazardous weapons, test each one; on a failure the firing model suffers mortal wounds.',
  },
  {
    keyword: 'Heavy',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[HEAVY] 24.16'],
    ruleRef: '24.16',
    summary:
      'If the unit remained stationary this turn, Heavy weapons gain +1 to hit when they shoot.',
  },
  {
    keyword: 'Hover',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['HOVER 24.17'],
    ruleRef: '24.17',
    summary:
      'Hover vehicles can move over other models and terrain more freely than standard ground vehicles, as detailed in the ability.',
  },
  {
    keyword: 'Ignores Cover',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[IGNORES COVER] 24.18'],
    ruleRef: '24.18',
    summary:
      'Targets cannot claim the benefit of cover against attacks made with Ignores Cover weapons.',
  },
  {
    keyword: 'Indirect Fire',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[INDIRECT FIRE] 24.19'],
    ruleRef: '24.19',
    summary:
      'Indirect Fire weapons can target units not visible to the attacker, but those attacks suffer additional hit-roll restrictions and cover benefits for the target.',
  },
  {
    keyword: 'Infiltrators',
    phase: 'Deployment',
    applicability: 'restricted',
    labels: ['INFILTRATORS 24.20'],
    ruleRef: '24.20',
    summary:
      'If every model in the unit has Infiltrators, it can deploy anywhere more than 8" horizontally from the enemy deployment zone and all enemy units.',
  },
  {
    keyword: 'Lance',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['[LANCE] 24.21'],
    ruleRef: '24.21',
    summary:
      'When attacking with a Lance weapon, add 1 to the wound roll if the attacking unit made a charge move this turn.',
  },
  {
    keyword: 'Leader',
    phase: 'Command Phase',
    applicability: 'general',
    labels: ['LEADER 24.22'],
    ruleRef: '24.22',
    summary:
      'Leader models can attach to bodyguard units, forming an Attached unit that moves and fights together; see the Attached Units rules for details.',
  },
  {
    keyword: 'Lethal Hits',
    phase: 'Fight Phase',
    applicability: 'restricted',
    labels: ['[LETHAL HITS] 24.23'],
    ruleRef: '24.23',
    summary:
      'When a Lethal Hits weapon scores a critical hit, you may choose for that attack to automatically wound the target.',
  },
  {
    keyword: 'Lone Operative',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['LONE OPERATIVE 24.24'],
    ruleRef: '24.24',
    summary:
      'Unless part of an Attached unit, this unit is not visible to enemy models beyond 12" and cannot be targeted by Indirect Fire beyond that range.',
  },
  {
    keyword: 'Melta',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[MELTA] 24.25'],
    ruleRef: '24.25',
    summary:
      'Melta weapons add X to their Damage characteristic when the target was within half range during the Select Targets step (written as Melta X).',
  },
  {
    keyword: 'One Shot',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[ONE SHOT] 24.26'],
    ruleRef: '24.26',
    summary:
      'Each One Shot weapon can only be fired once per battle; mark it once used.',
  },
  {
    keyword: 'Pistol',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[PISTOL] 24.27', 'Pistols can be wielded even at point-blank range'],
    ruleRef: '24.27',
    summary:
      'Pistol weapons can be fired while engaged, like Close Quarters. [PISTOL] and [CLOSE-QUARTERS] are identical for all rules purposes.',
  },
  {
    keyword: 'Precision',
    phase: 'General',
    applicability: 'restricted',
    labels: ['[PRECISION] 24.28', 'Precision attacks can pick high-value targets'],
    ruleRef: '24.28',
    summary:
      'When attacking with Precision weapons, if the target unit has visible CHARACTER models, you may allocate hits to a CHARACTER group first during the Allocation Order step.',
  },
  {
    keyword: 'Psychic',
    phase: 'General',
    applicability: 'restricted',
    labels: ['[PSYCHIC] 24.29', 'Some weapons can channel the bearer'],
    ruleRef: '24.29',
    summary:
      'Psychic weapons ignore BS/WS and hit-roll modifiers. Attacks made with them count as psychic attacks for triggering other rules.',
  },
  {
    keyword: 'Rapid Fire',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[RAPID FIRE] 24.30', 'Rapid fire weapons are capable'],
    ruleRef: '24.30',
    summary:
      'Rapid Fire X adds X extra attack dice when gathering attacks if the target was within half range during the Select Targets step.',
  },
  {
    keyword: 'Sustained Hits',
    phase: 'General',
    applicability: 'restricted',
    labels: ['[SUSTAINED HITS] 24.36', 'Some weapons possess a punishing rate of fire'],
    ruleRef: '24.36',
    summary:
      'Sustained Hits X: each critical hit with the weapon scores X additional hits on the target beyond the critical hit itself.',
  },
  {
    keyword: 'Torrent',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['[TORRENT] 24.37', 'Torrent weapons project clouds of fire'],
    ruleRef: '24.37',
    summary:
      'Each attack made with a Torrent weapon automatically hits the target.',
  },
  {
    keyword: 'Twin-linked',
    phase: 'General',
    applicability: 'restricted',
    labels: ['[TWIN-LINKED] 24.38', 'Dual weapons are often grafted'],
    ruleRef: '24.38',
    summary:
      'Each time an attack is made with a Twin-linked weapon, you can re-roll the wound roll.',
  },
  {
    keyword: 'Scouts',
    phase: 'Deployment',
    applicability: 'restricted',
    labels: ['SCOUTS 24.31'],
    ruleRef: '24.31',
    summary:
      'Units with Scouts can make a Scout move before the first turn, repositioning up to 6" subject to deployment restrictions.',
  },
  {
    keyword: 'Scout Move',
    phase: 'Deployment',
    applicability: 'restricted',
    labels: ['SCOUT MOVE 24.32'],
    ruleRef: '24.32',
    summary:
      'The pre-battle move granted by the Scouts ability, allowing eligible units to adjust their starting positions before turn one.',
  },
  {
    keyword: 'Stealth',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['STEALTH 24.33'],
    ruleRef: '24.33',
    summary:
      'Ranged attacks targeting a Stealth unit subtract 1 from the hit roll unless the attacker is within 12".',
  },
  {
    keyword: 'Support',
    phase: 'Shooting Phase',
    applicability: 'restricted',
    labels: ['SUPPORT 24.34'],
    ruleRef: '24.34',
    summary:
      'Support weapons on vehicles let crew fire additional ranged weapons from the transport, following the Support ability\'s targeting rules.',
  },
  {
    keyword: 'Super-heavy Walker',
    phase: 'Movement Phase',
    applicability: 'restricted',
    labels: ['SUPER-HEAVY WALKER 24.35'],
    ruleRef: '24.35',
    summary:
      'Super-heavy Walker models count as both MONSTER and VEHICLE for rules purposes, combining aspects of both unit types.',
  },
];
