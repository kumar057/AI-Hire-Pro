export function NotificationSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-label="Loading notifications" className="animate-pulse space-y-3">
      {Array.from({ length: compact ? 3 : 6 }, (_, index) => (
        <div
          className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/70"
          key={index}
        >
          <div className="size-10 shrink-0 rounded-md bg-slate-200 dark:bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/5 rounded bg-slate-200 dark:bg-white/10" />
            <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
