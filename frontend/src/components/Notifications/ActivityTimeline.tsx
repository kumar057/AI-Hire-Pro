import { motion } from 'framer-motion';
import { FiActivity, FiCalendar, FiShield, FiUser } from 'react-icons/fi';
import type { ActivityItem } from '@/types/notifications';

const icons = { activity: FiActivity, calendar: FiCalendar, shield: FiShield, user: FiUser };

export function ActivityTimeline({
  items,
  compact = false,
}: {
  items: ActivityItem[];
  compact?: boolean;
}) {
  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const Icon = icons[item.icon as keyof typeof icons] ?? FiActivity;
        return (
          <motion.article
            animate={{ opacity: 1, x: 0 }}
            className="relative flex gap-3 py-3"
            initial={{ opacity: 0, x: -10 }}
            key={item.id}
            transition={{ delay: index * 0.05 }}
          >
            <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-300">
              <Icon />
            </span>
            {index < items.length - 1 ? (
              <span className="absolute bottom-0 left-[18px] top-10 w-px bg-slate-200 dark:bg-white/10" />
            ) : null}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2">
                <h3 className="text-sm font-bold">{item.title}</h3>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500 dark:bg-white/10">
                  {item.category}
                </span>
              </div>
              {!compact ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-slate-500">
                {item.user} / {new Date(item.occurred_at).toLocaleString()}
              </p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
