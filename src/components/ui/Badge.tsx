import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'cobalt' | 'coral' | 'success' | 'warning' | 'error' | 'lavender' | 'dark';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-lavender-100 text-ink/70',
  cobalt: 'bg-cobalt-50 text-cobalt-600',
  coral: 'bg-coral-50 text-coral-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  error: 'bg-error-50 text-error-600',
  lavender: 'bg-lavender-200 text-ink/80',
  dark: 'bg-ink text-white',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; dot: string }> = {
    published: { variant: 'success', dot: 'bg-success-500' },
    scheduled: { variant: 'cobalt', dot: 'bg-cobalt-500' },
    draft: { variant: 'default', dot: 'bg-lavender-500' },
    archived: { variant: 'default', dot: 'bg-ink/30' },
    active: { variant: 'success', dot: 'bg-success-500' },
    paused: { variant: 'warning', dot: 'bg-warning-500' },
    completed: { variant: 'lavender', dot: 'bg-lavender-500' },
    connected: { variant: 'success', dot: 'bg-success-500' },
    disconnected: { variant: 'default', dot: 'bg-ink/30' },
    open: { variant: 'coral', dot: 'bg-coral-500' },
    'in-progress': { variant: 'warning', dot: 'bg-warning-500' },
    resolved: { variant: 'success', dot: 'bg-success-500' },
    suspended: { variant: 'error', dot: 'bg-error-500' },
    trial: { variant: 'cobalt', dot: 'bg-cobalt-500' },
  };
  const config = map[status] ?? { variant: 'default' as BadgeVariant, dot: 'bg-ink/30' };
  return (
    <Badge variant={config.variant}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="capitalize">{status}</span>
    </Badge>
  );
}
