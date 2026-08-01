import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

type PasswordInputProps = {
  error?: string;
  label: string;
  registration: UseFormRegisterReturn;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'type'>;

export function PasswordInput({ error, id, label, registration, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label className="relative block" htmlFor={id}>
        <FiLock
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
        />
        <input
          className={`peer h-14 w-full rounded-md border bg-white/80 px-11 pt-5 text-sm font-medium text-slate-950 outline-none transition placeholder:text-transparent focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15 ${
            error ? 'border-rose-300' : 'border-slate-200'
          } dark:bg-white/5 dark:text-white dark:focus:border-cyan-300`}
          id={id}
          placeholder={label}
          type={isVisible ? 'text' : 'password'}
          {...registration}
          {...props}
        />
        <span className="pointer-events-none absolute left-11 top-2 text-xs font-semibold text-slate-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-cyan-700 dark:text-slate-400 dark:peer-focus:text-cyan-200">
          {label}
        </span>
        <button
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={() => setIsVisible((current) => !current)}
          type="button"
        >
          {isVisible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
        </button>
      </label>
      {error ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
    </div>
  );
}

