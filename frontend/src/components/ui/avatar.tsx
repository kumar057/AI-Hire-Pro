import type { HTMLAttributes, ImgHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} {...props} />
  );
}

export function AvatarImage({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn('aspect-square size-full object-cover', className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  );
}
