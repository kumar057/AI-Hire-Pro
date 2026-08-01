import type { ButtonHTMLAttributes, ReactNode } from 'react';

type LoadingButtonProps = {
  children: ReactNode;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function LoadingButton({
  children,
  className = '',
  disabled,
  isLoading = false,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 ${className}`}
      disabled={disabled || isLoading}
      type="submit"
      {...props}
    >
      {isLoading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-slate-950/30 dark:border-t-slate-950" />
      ) : null}
      {children}
    </button>
  );
}

