export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            className="h-40 animate-pulse rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70"
            key={index}
          >
            <div className="size-11 rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="mt-5 h-4 w-28 rounded bg-slate-200 dark:bg-white/10" />
            <div className="mt-3 h-8 w-20 rounded bg-slate-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
        <div className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
      </div>
    </div>
  );
}
