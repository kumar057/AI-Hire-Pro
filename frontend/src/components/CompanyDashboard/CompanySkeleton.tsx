export function CompanySkeleton() {
  return <div className="mt-6 animate-pulse space-y-6"><div className="h-40 rounded-lg bg-slate-200 dark:bg-white/10" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div className="h-32 rounded-lg bg-slate-200 dark:bg-white/10" key={index} />)}</div></div>;
}

