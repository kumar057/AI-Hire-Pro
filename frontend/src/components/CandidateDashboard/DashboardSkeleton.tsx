import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Card
            className="h-40 gap-0 rounded-lg border-slate-200 bg-white p-5 py-5 dark:border-white/10 dark:bg-slate-900/70"
            key={index}
          >
            <Skeleton className="size-11 rounded-lg bg-slate-200 dark:bg-white/10" />
            <Skeleton className="mt-5 h-4 w-28 bg-slate-200 dark:bg-white/10" />
            <Skeleton className="mt-3 h-8 w-20 bg-slate-200 dark:bg-white/10" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Skeleton className="h-80 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
        <Skeleton className="h-80 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
      </div>
    </div>
  );
}
