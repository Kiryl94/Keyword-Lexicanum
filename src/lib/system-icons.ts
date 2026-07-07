import type { GameSystemId } from '@/store/session';

export type SystemIconAsset = {
  src: string;
  label: string;
};

/** Official / canonical marks sourced from Wikimedia Commons and publisher branding. */
export const SYSTEM_ICON_ASSETS: Partial<Record<GameSystemId, SystemIconAsset>> = {
  'dnd5e-srd': {
    src: '/icons/systems/dnd5e-srd-mark.png',
    label: 'Dungeons & Dragons 5th Edition',
  },
  'wh40k-11': {
    src: '/icons/systems/wh40k-11.png',
    label: 'Warhammer 40,000',
  },
  'starcraft-mini': {
    src: '/icons/systems/starcraft-mini-mark.svg',
    label: 'StarCraft',
  },
};
