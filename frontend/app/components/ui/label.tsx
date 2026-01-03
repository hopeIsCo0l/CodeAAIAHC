import { clsx } from 'clsx';
import * as React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label className={clsx('text-sm font-medium text-slate-300', className)} {...props} />
  );
}
