import { SYSTEM_ICON_ASSETS } from '@/lib/system-icons';
import type { GameSystemId } from '@/store/session';

type SystemIconProps = {
  systemId: GameSystemId;
  className?: string;
};

export function SystemIcon({ systemId, className = 'h-7 w-7' }: SystemIconProps) {
  const asset = SYSTEM_ICON_ASSETS[systemId];
  if (!asset) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local SVG/PNG marks with mixed aspect ratios
    <img
      src={asset.src}
      alt=""
      aria-hidden="true"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
