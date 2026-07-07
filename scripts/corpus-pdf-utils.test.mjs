import { describe, expect, it } from 'vitest';
import { trimAtNextWh40kKeywordEntry, trimAtNextNumberedRuleHeader, trimAtWh40kChapterCatalog } from './corpus-pdf-utils.mjs';

describe('trimAtNextWh40kKeywordEntry', () => {
  it('stops before the next bracketed ability header', () => {
    const text = [
      'Many armies employ reconnaissance units.',
      'During deployment, if every model in a unit has this ability, it can be set up anywhere.',
      '[LANCE] 24.21',
      'With the momentum of a warrior at full-tilt, lance weapons are deadly on the charge.',
    ].join('\n');

    expect(trimAtNextWh40kKeywordEntry(text, 'Infiltrators')).toBe(
      'Many armies employ reconnaissance units.\nDuring deployment, if every model in a unit has this ability, it can be set up anywhere.',
    );
  });

  it('stops before the next unbracketed ability header in section 24', () => {
    const text = [
      'Mighty heroes fight at the forefront of battle.',
      'LEADER 24.22',
      'See Attached Units (19).',
    ].join('\n');

    expect(trimAtNextWh40kKeywordEntry(text, 'Lance')).toBe(
      'Mighty heroes fight at the forefront of battle.',
    );
  });

  it('keeps inline bracket cross-references within the same entry', () => {
    const text = [
      'You can only select [CLOSE-QUARTERS] weapons to make attacks with.',
      'AFTER SHOOTING: Until the end of the phase, your unit is not eligible to start an action.',
    ].join('\n');

    expect(trimAtNextWh40kKeywordEntry(text, 'Blast')).toBe(text);
  });

  it('does not stop at non-glossary section numbers', () => {
    const text = [
      'Resolve the fight phase sequence.',
      'PILE-IN MOVES 12.02',
      'Each unit piles in toward the closest enemy model.',
    ].join('\n');

    expect(trimAtNextWh40kKeywordEntry(text, 'Fight Phase')).toBe(text);
  });

  it('stops before the next numbered rule header outside section 24', () => {
    const text = [
      'Line of sight is used to determine visibility between models.',
      'Note that terrain applies additional rules to visibility (13.07).',
      'MORTAL\u0008WOUNDS\u000806.02',
      'Some attacks or rules inflict mortal wounds on units.',
    ].join('\n');

    expect(trimAtNextNumberedRuleHeader(text, 'Line of Sight')).toBe(
      'Line of sight is used to determine visibility between models.\nNote that terrain applies additional rules to visibility (13.07).',
    );
  });

  it('stops stratagems intro before chapter banners and stratagem cards', () => {
    const text = [
      'Stratagems can be used by spending Command Points, to create epic moments',
      'of tactical brilliance or peerless martial might. They are used when a player',
      'deems that a critical point in the battle is reached, where extra combat prowess',
      'or fleeting but powerful effects are required to tip the balance in their favour.',
      '15',
      '++ HATRED STEELS OUR RESOLVE ++',
      'HEROIC INTERVENTION 15.11 1CP',
      'Voices raised in furious war cries.',
    ].join('\n');

    expect(trimAtWh40kChapterCatalog(text)).toBe(
      [
        'Stratagems can be used by spending Command Points, to create epic moments',
        'of tactical brilliance or peerless martial might. They are used when a player',
        'deems that a critical point in the battle is reached, where extra combat prowess',
        'or fleeting but powerful effects are required to tip the balance in their favour.',
      ].join('\n'),
    );
  });
});
