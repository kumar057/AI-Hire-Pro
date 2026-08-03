import { FiDownload, FiFileText, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

import type { CandidateResumeFile } from '@/types/candidateResume';
import { formatDate, formatFileSize } from '@/utils/resumeFormat';

type ResumeInfoCardProps = {
  resume: CandidateResumeFile | null;
  onDelete: () => void;
  onDownload: () => void;
  onReplace: () => void;
  isDeleting: boolean;
};

export function ResumeInfoCard({
  isDeleting,
  onDelete,
  onDownload,
  onReplace,
  resume,
}: ResumeInfoCardProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
          <FiFileText aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Resume Information
          </p>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Current file</h2>
        </div>
      </div>

      {resume ? (
        <div className="mt-5 space-y-4">
          <InfoRow label="File Name" value={resume.file_name} />
          <InfoRow label="Upload Date" value={formatDate(resume.upload_date)} />
          <InfoRow label="File Size" value={formatFileSize(resume.file_size)} />
          <InfoRow label="Format" value={resume.file_type} />

          <div className="grid gap-2 pt-2">
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-cyan-950/15 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              onClick={onDownload}
              type="button"
            >
              <FiDownload aria-hidden="true" />
              Download Resume
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
              onClick={onReplace}
              type="button"
            >
              <FiRefreshCw aria-hidden="true" />
              Replace Resume
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200"
              disabled={isDeleting}
              onClick={onDelete}
              type="button"
            >
              <FiTrash2 aria-hidden="true" />
              {isDeleting ? 'Deleting...' : 'Delete Resume'}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">
          No resume is attached. Upload a PDF or DOCX file to prepare this workspace for future
          parsing and AI review.
        </p>
      )}
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
      <p className="text-xs font-bold uppercase tracking-normal text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
