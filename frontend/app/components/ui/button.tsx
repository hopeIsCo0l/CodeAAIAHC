import { clsx } from 'clsx';
import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2';
    const variants: Record<string, string> = {
      default: 'bg-accent text-slate-900 hover:bg-cyan-300 focus-visible:ring-cyan-200',
      ghost: 'bg-transparent hover:bg-slate-800 text-foreground',
      outline: 'border border-slate-600 text-foreground hover:bg-slate-800',
    };
    const sizes: Record<string, string> = {
      sm: 'px-2 py-1',
      md: 'px-3 py-2',
    };
    return (
      <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props} />
    );
  },
);
Button.displayName = 'Button';
