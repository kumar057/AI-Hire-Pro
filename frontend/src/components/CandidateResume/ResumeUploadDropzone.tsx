import { motion } from 'framer-motion';
import type { ChangeEvent, DragEvent } from 'react';
import { FiFileText, FiUploadCloud } from 'react-icons/fi';

type ResumeUploadDropzoneProps = {
  disabled: boolean;
  isDragging: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onFileSelect: (file: File) => void;
  progress: number;
};

export function ResumeUploadDropzone({
  disabled,
  isDragging,
  onDragStateChange,
  onFileSelect,
  progress,
}: ResumeUploadDropzoneProps) {
  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    onDragStateChange(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    onDragStateChange(true);
  }

  return (
    <motion.label
      animate={{ borderColor: isDragging ? 'rgba(6, 182, 212, 0.75)' : undefined }}
      className={`group relative block overflow-hidden rounded-lg border border-dashed p-6 shadow-sm transition dark:border-white/10 ${
        disabled
          ? 'cursor-not-allowed bg-slate-100 opacity-75 dark:bg-white/5'
          : 'cursor-pointer bg-white hover:border-cyan-300 hover:bg-cyan-50/50 dark:bg-slate-900/70 dark:hover:border-cyan-300/50 dark:hover:bg-cyan-300/5'
      } ${isDragging ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-300/10' : 'border-slate-300'}`}
      onDragLeave={() => onDragStateChange(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      whileHover={disabled ? undefined : { y: -2 }}
    >
      <input
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        disabled={disabled}
        onChange={handleFileInput}
        type="file"
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-lg bg-cyan-50 text-cyan-700 shadow-lg shadow-cyan-950/10 transition group-hover:scale-105 dark:bg-cyan-300/10 dark:text-cyan-200">
          <FiUploadCloud aria-hidden="true" className="size-8" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
          Drag and drop your resume
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Upload a PDF or DOCX resume. You can replace the current resume at any time.
        </p>
        <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-cyan-950/15 dark:bg-white dark:text-slate-950">
          <FiFileText aria-hidden="true" />
          Choose Resume
        </span>
      </div>

      {progress > 0 ? (
        <div className="relative z-10 mt-6">
          <div className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200">
            <span>Upload progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
              initial={{ width: 0 }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </div>
      ) : null}
    </motion.label>
  );
}
