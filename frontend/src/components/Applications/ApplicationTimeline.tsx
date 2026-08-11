import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

import type { ApplicationTimelineEvent } from '@/types/applications';

export function ApplicationTimeline({ events }: { events: ApplicationTimelineEvent[] }) {
  if (!events.length) return <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/15">Timeline starts when the draft is submitted.</div>;
  return <ol className="space-y-0">{events.map((event, index) => <motion.li animate={{ opacity: 1, x: 0 }} className="relative grid grid-cols-[32px_1fr] gap-3 pb-6" initial={{ opacity: 0, x: -10 }} key={event.id} transition={{ delay: index * 0.06 }}><div className="relative flex justify-center"><span className="z-10 grid size-7 place-items-center rounded-full bg-cyan-600 text-white"><FiCheck className="size-4" /></span>{index < events.length - 1 && <span className="absolute top-7 h-full w-px bg-cyan-200 dark:bg-cyan-300/20" />}</div><div><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-slate-950 dark:text-white">{event.title}</p><time className="text-xs font-semibold text-slate-500">{new Date(event.occurred_at).toLocaleDateString()}</time></div><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.description}</p></div></motion.li>)}</ol>;
}
