interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export function Logo({ size = 'md', dark = false, iconOnly = false, className = '' }: LogoProps) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const logoSrc = dark ? `${cleanBase}logo-dark.png` : `${cleanBase}logo.png`;
  const markSrc = `${cleanBase}logo-mark.png`;

  const heightClasses = {
    sm: iconOnly ? 'w-8 h-8' : 'h-8 sm:h-9',
    md: iconOnly ? 'w-10 h-10' : 'h-10 sm:h-11',
    lg: iconOnly ? 'w-14 h-14' : 'h-12 sm:h-14',
  };

  if (iconOnly) {
    return (
      <div className={`relative inline-flex items-center justify-center select-none group cursor-pointer ${className}`}>
        <img
          src={markSrc}
          alt="ContentPilot AI"
          className={`${heightClasses[size]} object-contain drop-shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none group cursor-pointer ${className}`}>
      <img
        src={logoSrc}
        alt="ContentPilot AI — Create • Analyze • Grow"
        className={`${heightClasses[size]} w-auto max-w-[220px] sm:max-w-[260px] object-contain transition-transform duration-300 group-hover:scale-102`}
      />
    </div>
  );
}
