import { LuHeart, LuHeartHandshake, LuCircleHelp } from 'react-icons/lu';
import type { CategorySide } from '../../types';

interface GuestSideIconProps {
  side: CategorySide;
  size?: string | number;
  className?: string;
}

export function GuestSideIcon({ side, size = '1rem', className }: GuestSideIconProps) {
  const iconProps = {
    size,
    className,
    'aria-hidden': true,
  };

  switch (side) {
    case 'bride':
      return (
        <LuHeart 
          {...iconProps}
          style={{ color: 'var(--color-bride)' }}
          aria-label="Bride side"
        />
      );
    case 'groom':
      return (
        <LuHeart 
          {...iconProps}
          style={{ color: 'var(--color-groom)' }}
          aria-label="Groom side"
        />
      );
    case 'both':
      return (
        <LuHeartHandshake 
          {...iconProps}
          style={{ color: 'var(--color-accent)' }}
          aria-label="Both sides"
        />
      );
    case 'unspecified':
    default:
      return (
        <LuCircleHelp 
          {...iconProps}
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Unspecified side"
        />
      );
  }
} 