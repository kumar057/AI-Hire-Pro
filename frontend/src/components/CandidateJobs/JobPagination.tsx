import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Button } from '@/components/ui/button';

type JobPaginationProps = {
  onPageChange: (page: number) => void;
  page: number;
  pageSize: number;
  total: number;
};

export function JobPagination({ onPageChange, page, pageSize, total }: JobPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
      <span>
        Page {page} of {totalPages} / {total} jobs
      </span>
      <div className="flex gap-2">
        <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)} type="button" variant="outline">
          <FiChevronLeft aria-hidden="true" />
          Previous
        </Button>
        <Button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
          variant="outline"
        >
          Next
          <FiChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
