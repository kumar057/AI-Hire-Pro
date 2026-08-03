export function ResumeSkeleton() {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
        <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
      </div>
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
        <div className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
      </div>
    </div>
  );
}
