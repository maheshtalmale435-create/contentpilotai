import { type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const baseInput = 'w-full px-4 py-2.5 text-sm bg-white border border-ink/10 rounded-xl text-ink placeholder:text-ink/30 transition-all focus:outline-none focus:border-cobalt-500 focus:ring-2 focus:ring-cobalt-500/10';

export function Input({ label, error, hint, className = '', ...props }: {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink/70 mb-1.5">{label}</span>}
      <input className={`${baseInput} ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10' : ''} ${className}`} {...props} />
      {error && <span className="block text-xs text-error-500 mt-1">{error}</span>}
      {hint && !error && <span className="block text-xs text-ink/40 mt-1">{hint}</span>}
    </label>
  );
}

export function Textarea({ label, error, hint, className = '', ...props }: {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink/70 mb-1.5">{label}</span>}
      <textarea className={`${baseInput} resize-none ${error ? 'border-error-500' : ''} ${className}`} {...props} />
      {error && <span className="block text-xs text-error-500 mt-1">{error}</span>}
      {hint && !error && <span className="block text-xs text-ink/40 mt-1">{hint}</span>}
    </label>
  );
}

export function Select({ label, error, children, className = '', ...props }: {
  label?: string;
  error?: string;
  children: ReactNode;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink/70 mb-1.5">{label}</span>}
      <select className={`${baseInput} cursor-pointer ${error ? 'border-error-500' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <span className="block text-xs text-error-500 mt-1">{error}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3"
      role="switch"
      aria-checked={checked}
    >
      <span className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-cobalt-500' : 'bg-lavender-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </span>
      {label && <span className="text-sm font-medium text-ink/70">{label}</span>}
    </button>
  );
}
