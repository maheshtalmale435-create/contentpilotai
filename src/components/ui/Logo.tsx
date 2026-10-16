import logoFull from '@/assets/brand/logo-full.png';
import logoFullDark from '@/assets/brand/logo-full-dark.png';
import logoIcon from '@/assets/brand/logo-icon.png';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export function Logo({
  size = 'md',
  dark = false,
  iconOnly = false,
  className = '',
}: LogoProps) {
  // Height presets for lockup and icon
  const fullSizes = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-14',
  };

  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const imgSrc = iconOnly
    ? logoIcon
    : dark
    ? logoFullDark
    : logoFull;

  return (
    <div
      className={`inline-flex items-center select-none group cursor-pointer ${className}`}
      title="ContentPilot AI - Create · Analyze · Grow"
    >
      <img
        src={imgSrc}
        alt="ContentPilot AI"
        className={`object-contain transition-all duration-300 group-hover:scale-102 group-hover:drop-shadow-sm ${
          iconOnly ? iconSizes[size] : fullSizes[size]
        }`}
        loading="eager"
      />
    </div>
  );
}

