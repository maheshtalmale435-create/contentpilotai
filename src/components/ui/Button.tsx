import { Link } from 'react-router-dom';
import { type ReactNode, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'coral' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-cobalt-500 text-white hover:bg-cobalt-600 active:bg-cobalt-700 shadow-sm shadow-cobalt-500/20',
  secondary: 'bg-lavender-100 text-ink hover:bg-lavender-200 active:bg-lavender-300',
  ghost: 'text-ink hover:bg-lavender-100 active:bg-lavender-200',
  outline: 'border border-ink/15 text-ink hover:border-ink/30 hover:bg-lavender-50',
  coral: 'bg-coral-500 text-white hover:bg-coral-600 active:bg-coral-700 shadow-sm shadow-coral-500/20',
  dark: 'bg-ink text-white hover:bg-ink/90 active:bg-ink/80',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  loading?: boolean;
}

interface ButtonProps extends Omit<BaseProps, 'children'>, ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  to?: never;
}

interface LinkButtonProps extends BaseProps {
  to: string;
  onClick?: never;
}

type CombinedProps = ButtonProps | LinkButtonProps;

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  disabled,
  ...props
}: CombinedProps) {
  const classes = `inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500/40 focus-visible:ring-offset-2 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  const { to: _to, onClick: _onClick, ...buttonProps } = props as ButtonProps;
  return (
    <button className={classes} disabled={disabled || loading} {...buttonProps}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
