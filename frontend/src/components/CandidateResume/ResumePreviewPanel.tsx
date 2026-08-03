import { FiEye, FiFileText } from 'react-icons/fi';

import type { CandidateResumeFile, LocalResumePreview } from '@/types/candidateResume';

type ResumePreviewPanelProps = {
  localPreview: LocalResumePreview | null;
  resume: CandidateResumeFile | null;
};

export function ResumePreviewPanel({ localPreview, resume }: ResumePreviewPanelProps) {
  const fileType = localPreview?.fileType ?? resume?.file_type;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Preview Resume
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Document preview</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
          <FiEye aria-hidden="true" />
          {fileType ?? 'No file'}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
        {localPreview?.fileType === 'PDF' ? (
          <iframe
            className="h-[32rem] w-full bg-white"
            src={localPreview.objectUrl}
            title="Resume PDF preview"
          />
        ) : (
          <div className="grid min-h-[32rem] place-items-center p-8 text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-lg bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-200">
                <FiFileText aria-hidden="true" className="size-8" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                {resume || localPreview ? 'Preview placeholder ready' : 'No resume selected'}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                PDF uploads can render in-browser after selection. DOCX and stored dummy resumes
                show this preview placeholder until real document rendering is connected.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
