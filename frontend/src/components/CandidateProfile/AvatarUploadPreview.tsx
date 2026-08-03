import { FiCamera, FiUploadCloud } from 'react-icons/fi';
import type { ChangeEvent } from 'react';

type AvatarUploadPreviewProps = {
  disabled: boolean;
  fullName: string;
  onPreviewChange: (preview: string) => void;
  preview?: string;
};

export function AvatarUploadPreview({
  disabled,
  fullName,
  onPreviewChange,
  preview,
}: AvatarUploadPreviewProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        onPreviewChange(reader.result);
      }
    });
    reader.readAsDataURL(file);
  }

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="relative size-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-950/10 dark:border-white/10">
        {preview ? (
          <img alt={`${fullName} avatar preview`} className="size-full object-cover" src={preview} />
        ) : (
          <div className="grid size-full place-items-center text-3xl font-bold text-white">
            {initials || 'AP'}
          </div>
        )}
        <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-md bg-white text-cyan-700 shadow-lg dark:bg-slate-950 dark:text-cyan-200">
          <FiCamera aria-hidden="true" />
        </span>
      </div>

      <div className="min-w-0">
        <p className="font-bold text-slate-950 dark:text-white">Profile Photo Upload</p>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
          Preview a new candidate avatar before saving. Real file upload will be connected in a
          later implementation step.
        </p>
        <label
          className={`mt-4 inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition dark:border-white/10 dark:bg-white/10 dark:text-white ${
            disabled
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer hover:border-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-200'
          }`}
        >
          <FiUploadCloud aria-hidden="true" />
          Choose image
          <input
            accept="image/*"
            className="sr-only"
            disabled={disabled}
            onChange={handleFileChange}
            type="file"
          />
        </label>
      </div>
    </div>
  );
}
