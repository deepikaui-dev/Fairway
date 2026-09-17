import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-primary text-white hover:bg-primary/90 shadow-sm": variant === 'primary',
            "bg-secondary text-white hover:bg-secondary/90 shadow-sm": variant === 'secondary',
            "bg-accent text-white hover:bg-accent/90 shadow-sm": variant === 'accent',
            "border border-border hover:bg-background": variant === 'outline',
            "hover:bg-background hover:text-text": variant === 'ghost',
            "h-10 py-2 px-4": size === 'default',
            "h-9 px-3 rounded-md": size === 'sm',
            "h-11 px-8 rounded-md": size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
