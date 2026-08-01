import { motion } from 'framer-motion';
import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type ProfileFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
  registration: UseFormRegisterReturn;
};

export function ProfileField({ error, label, registration, ...props }: ProfileFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      <input
        {...registration}
        {...props}
        className={`mt-2 h-12 w-full rounded-lg border bg-white px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:bg-white/5 dark:text-white dark:disabled:bg-white/10 ${
          error ? 'border-rose-300' : 'border-slate-200 dark:border-white/10'
        }`}
      />
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
