import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  decorative?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export function Separator({
  className,
  decorative = true,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-orientation={orientation}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      role={decorative ? 'none' : 'separator'}
      {...props}
    />
  );
}
