interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
  markOnly?: boolean;
  className?: string;
}

export function Logo({ size = 'md', dark = false, markOnly = false, className = '' }: LogoProps) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const logoSrc = dark ? `${cleanBase}logo-dark.png` : `${cleanBase}logo.png`;
  const markSrc = `${cleanBase}logo-mark.png`;

  const heights = {
    sm: 'h-7',
    md: 'h-8.5',
    lg: 'h-11',
    xl: 'h-14',
  };

  const markSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  if (markOnly) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 select-none group cursor-pointer ${className}`}>
        <img
          src={markSrc}
          alt="ContentPilot AI"
          className={`${markSizes[size]} object-contain group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300 drop-shadow-xs`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none group cursor-pointer ${className}`}>
      <img
        src={logoSrc}
        alt="ContentPilot AI — Create • Analyze • Grow"
        className={`${heights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-102`}
      />
    </div>
  );
}

