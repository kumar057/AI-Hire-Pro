import { motion } from 'framer-motion';
import type { TextareaHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type ProfileTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  helper?: string;
  label: string;
  registration: UseFormRegisterReturn;
};

export function ProfileTextarea({
  error,
  helper,
  label,
  registration,
  ...props
}: ProfileTextareaProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <textarea
        {...registration}
        {...props}
        className={`mt-2 min-h-32 w-full resize-y rounded-lg border bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:bg-white/5 dark:text-white dark:disabled:bg-white/10 ${
          error ? 'border-rose-300' : 'border-slate-200 dark:border-white/10'
        }`}
      />
      {helper && !error ? (
        <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{helper}</p>
      ) : null}
      {error ? (
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-300"
          initial={{ opacity: 0, y: -4 }}
        >
          {error}
        </motion.p>
      ) : null}
    </label>
  );
}
