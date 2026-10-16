import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-lavender-100 flex items-center justify-center text-ink/30 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-ink/50 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-3 border-cobalt-200 border-t-cobalt-500 rounded-full animate-spin" />
      <p className="text-sm text-ink/40 mt-3">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-error-50 flex items-center justify-center text-error-500 mb-4 text-2xl font-bold">
        !
      </div>
      <h3 className="text-base font-semibold text-ink">Something went wrong</h3>
      <p className="text-sm text-ink/50 mt-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 px-4 py-2 text-sm font-semibold text-cobalt-500 hover:bg-cobalt-50 rounded-lg transition-colors">
          Try again
        </button>
      )}
    </div>
  );
}
