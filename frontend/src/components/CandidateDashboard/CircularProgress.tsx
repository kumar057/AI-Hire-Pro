import { motion } from 'framer-motion';

type CircularProgressProps = {
  value: number;
  label: string;
};

export function CircularProgress({ label, value }: CircularProgressProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-5">
      <div className="relative size-32 shrink-0">
        <svg aria-hidden="true" className="size-full -rotate-90" viewBox="0 0 120 120">
          <circle
            className="stroke-slate-200 dark:stroke-white/10"
            cx="60"
            cy="60"
            fill="none"
            r={radius}
            strokeWidth="10"
          />
          <motion.circle
            animate={{ strokeDashoffset: offset }}
            className="stroke-cyan-500 dark:stroke-cyan-300"
            cx="60"
            cy="60"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            r={radius}
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth="10"
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-3xl font-bold text-slate-950 dark:text-white">{value}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
          {label}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Complete your profile to improve match quality and recruiter confidence.
        </p>
      </div>
    </div>
  );
}
