import type { GameSystemId } from '@/store/session';

type SystemIconProps = {
  systemId: GameSystemId;
  className?: string;
};

export function SystemIcon({ systemId, className = 'h-7 w-7' }: SystemIconProps) {
  switch (systemId) {
    case 'dnd5e-srd':
      return (
        <svg
          viewBox="0 0 32 32"
          className={className}
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M16 4 L27 10 V22 L16 28 L5 22 V10 Z" />
          <circle cx="16" cy="16" r="3.5" fill="currentColor" stroke="none" />
          <path d="M16 7 V13 M22 10 L18 14 M22 22 L18 18 M16 25 V19 M10 22 L14 18 M10 10 L14 14" />
        </svg>
      );
    case 'wh40k-11':
      return (
        <svg
          viewBox="0 0 32 32"
          className={className}
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M16 5 L20 11 H26 L21 16 L23 24 L16 20 L9 24 L11 16 L6 11 H12 Z" />
          <circle cx="16" cy="14" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'starcraft-mini':
      return (
        <svg
          viewBox="0 0 32 32"
          className={className}
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M16 4 L28 16 L22 28 H10 L4 16 Z" />
          <path d="M16 9 L21 16 L16 23 L11 16 Z" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
