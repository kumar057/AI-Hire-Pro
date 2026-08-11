export function DiscoverySkeleton() {
  return <div aria-label="Loading jobs" className="grid gap-4 lg:grid-cols-2" role="status">{Array.from({ length: 6 }, (_, index) => <div className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900" key={index}><div className="size-12 rounded-lg bg-slate-200 dark:bg-white/10"/><div className="mt-5 h-5 w-2/3 rounded bg-slate-200 dark:bg-white/10"/><div className="mt-3 h-3 w-1/3 rounded bg-slate-200 dark:bg-white/10"/><div className="mt-8 h-16 rounded bg-slate-100 dark:bg-white/5"/></div>)}</div>;
}
