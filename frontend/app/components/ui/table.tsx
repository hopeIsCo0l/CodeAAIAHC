import * as React from 'react';
import { clsx } from 'clsx';

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={clsx('w-full text-left text-sm text-slate-200', className)} {...props} />;
}
export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}
export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-b border-slate-800 last:border-none" {...props} />;
}
export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400" {...props} />;
}
export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-3 py-2 align-middle" {...props} />;
}
