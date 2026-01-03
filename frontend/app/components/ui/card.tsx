import { clsx } from 'clsx';
import * as React from 'react';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg backdrop-blur', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mb-4 flex items-center justify-between gap-2', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx('text-lg font-semibold text-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('space-y-3 text-sm text-slate-200', className)} {...props} />;
}
