import { FiActivity, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

type StatusBadgeProps = {
  status: 'checking' | 'healthy' | 'unavailable';
};

const styles = {
  checking: 'border-slate-300 bg-white text-slate-700',
  healthy: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  unavailable: 'border-rose-300 bg-rose-50 text-rose-800',
};

const icons = {
  checking: FiActivity,
  healthy: FiCheckCircle,
  unavailable: FiAlertCircle,
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const Icon = icons[status];

  return (
    <span
      className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${styles[status]}`}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span className="capitalize">{status}</span>
    </span>
  );
}

