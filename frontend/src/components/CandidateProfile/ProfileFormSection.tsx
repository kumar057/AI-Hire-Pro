import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';

type ProfileFormSectionProps = PropsWithChildren<{
  description: string;
  icon: IconType;
  title: string;
}>;

export function ProfileFormSection({
  children,
  description,
  icon: Icon,
  title,
}: ProfileFormSectionProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="profile-form-section rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20"
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-5 flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}
