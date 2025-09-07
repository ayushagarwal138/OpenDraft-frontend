import React from 'react';
import { cn } from '../../lib/utils';

const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
const variants = {
  default: 'bg-primary text-primary-foreground hover:opacity-90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};
const sizes = {
  sm: 'h-8 px-3',
  md: 'h-9 px-4',
  lg: 'h-10 px-6',
};

export function Button({ className, variant = 'default', size = 'md', ...props }) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
