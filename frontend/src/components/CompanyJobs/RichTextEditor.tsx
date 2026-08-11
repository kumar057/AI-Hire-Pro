import { FiBold, FiItalic, FiList } from 'react-icons/fi';

interface Props {
  onChange: (value: string) => void;
  value: string;
}

export function RichTextEditor({ onChange, value }: Props) {
  function wrapSelection(prefix: string, suffix = prefix) {
    const editor = document.querySelector<HTMLTextAreaElement>('[data-job-description]');
    if (!editor) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const next = `${value.slice(0, start)}${prefix}${value.slice(start, end)}${suffix}${value.slice(end)}`;
    onChange(next);
    window.requestAnimationFrame(() => editor.focus());
  }

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-cyan-500 dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center gap-1 border-b border-slate-200 p-2 dark:border-white/10">
        <button aria-label="Bold text" className="grid size-9 place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => wrapSelection('**')} type="button"><FiBold /></button>
        <button aria-label="Italic text" className="grid size-9 place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => wrapSelection('_')} type="button"><FiItalic /></button>
        <button aria-label="Bulleted list" className="grid size-9 place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => wrapSelection('\n- ', '')} type="button"><FiList /></button>
        <span className="ml-2 text-xs text-slate-500">Formatted text editor</span>
      </div>
      <textarea data-job-description className="min-h-44 w-full resize-y bg-transparent p-3 text-sm leading-6 outline-none" onChange={(event) => onChange(event.target.value)} placeholder="Describe the role, impact, team, and opportunity..." value={value} />
    </div>
  );
}
