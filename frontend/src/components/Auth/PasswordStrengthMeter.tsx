type PasswordStrengthMeterProps = {
  password?: string;
};

const checks = [
  { label: '12+ characters', test: (value: string) => value.length >= 12 },
  { label: 'Uppercase', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Lowercase', test: (value: string) => /[a-z]/.test(value) },
  { label: 'Number', test: (value: string) => /\d/.test(value) },
  { label: 'Special', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const score = checks.filter((check) => check.test(password)).length;
  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {checks.map((check, index) => (
          <span
            className={`h-1.5 flex-1 rounded-full transition ${
              index < score ? 'bg-cyan-500 dark:bg-cyan-300' : 'bg-slate-200 dark:bg-white/10'
            }`}
            key={check.label}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>Password strength: {strengthLabels[score]}</span>
        <span>{score}/5 requirements</span>
      </div>
    </div>
  );
}

