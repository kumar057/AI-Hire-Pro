import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface InsightListProps {
  items: string[];
  title: string;
  variant?: 'positive' | 'warning';
}

export function InsightList({ items, title, variant = 'positive' }: InsightListProps) {
  const Icon = variant === 'positive' ? FiCheckCircle : FiAlertCircle;
  const iconTone = variant === 'positive' ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300';

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300" key={item}>
            <Icon className={`mt-1 size-4 shrink-0 ${iconTone}`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
