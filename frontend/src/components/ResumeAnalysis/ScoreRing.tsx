import { motion } from 'framer-motion';

interface ScoreRingProps {
  label: string;
  score: number;
  tone?: string;
}

export function ScoreRing({ label, score, tone = '#06b6d4' }: ScoreRingProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative size-36">
        <svg aria-label={`${label}: ${score}%`} className="size-full -rotate-90" role="img" viewBox="0 0 120 120">
          <circle className="stroke-slate-200 dark:stroke-white/10" cx="60" cy="60" fill="none" r={radius} strokeWidth="9" />
          <motion.circle
            animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
            cx="60"
            cy="60"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            r={radius}
            stroke={tone}
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth="9"
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-3xl font-bold text-slate-950 dark:text-white">{score}%</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p>
    </div>
  );
}

