import type { InputHTMLAttributes, ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type FloatingInputProps = {
  error?: string;
  icon?: ReactNode;
  label: string;
  registration: UseFormRegisterReturn;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'>;

export function FloatingInput({
  error,
  icon,
  id,
  label,
  registration,
  type = 'text',
  ...props
}: FloatingInputProps) {
  return (
    <div>
      <label className="relative block" htmlFor={id}>
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          className={`peer h-14 w-full rounded-md border bg-white/80 px-4 pt-5 text-sm font-medium text-slate-950 outline-none transition placeholder:text-transparent focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15 ${icon ? 'pl-11' : ''} ${
            error ? 'border-rose-300' : 'border-slate-200'
          } dark:bg-white/5 dark:text-white dark:focus:border-cyan-300`}
          id={id}
          placeholder={label}
          type={type}
          {...registration}
          {...props}
        />
        <span
          className={`pointer-events-none absolute top-2 text-xs font-semibold text-slate-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-cyan-700 ${icon ? 'left-11' : 'left-4'} dark:text-slate-400 dark:peer-focus:text-cyan-200`}
        >
          {label}
        </span>
      </label>
      {error ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
    </div>
  );
}

