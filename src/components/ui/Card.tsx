import type { ReactNode, CSSProperties } from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
  style,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-white rounded-2xl border border-ink/8 ${hover ? 'transition-all duration-200 hover:shadow-lg hover:shadow-ink/5 hover:border-ink/15 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  change,
  icon,
  accent = 'cobalt',
}: {
  label: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon?: ReactNode;
  accent?: 'cobalt' | 'coral' | 'success' | 'warning';
}) {
  const accentMap = {
    cobalt: 'bg-cobalt-50 text-cobalt-500',
    coral: 'bg-coral-50 text-coral-500',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink/50 font-medium">{label}</p>
          <p className="text-2xl font-bold text-ink mt-1 font-display tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentMap[accent]}`}>
            {icon}
          </div>
        )}
      </div>
      {change && (
        <p className={`text-xs font-semibold mt-3 ${change.positive ? 'text-success-600' : 'text-error-500'}`}>
          {change.positive ? '+' : ''}{change.value} <span className="text-ink/40 font-normal">vs last period</span>
        </p>
      )}
    </Card>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-xl font-bold text-ink font-display tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-ink/50 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
