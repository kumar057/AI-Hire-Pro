export function Highlight({ query, text }: { query: string; text: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return <>{text.split(new RegExp(`(${escaped})`, 'ig')).map((part, index) => part.toLowerCase() === query.toLowerCase() ? <mark className="bg-amber-200 text-slate-950" key={`${part}-${index}`}>{part}</mark> : part)}</>;
}
