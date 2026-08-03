import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value?: number;
};

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      role="progressbar"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      {...props}
    >
      <div
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </div>
  );
}
