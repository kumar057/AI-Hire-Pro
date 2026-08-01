import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const LABELS: Record<string, string> = {
  profile: 'My Profile',
  resume: 'Resume',
  jobs: 'Jobs',
  'saved-jobs': 'Saved Jobs',
  'applied-jobs': 'Applied Jobs',
  notifications: 'Notifications',
  messages: 'Messages',
  settings: 'Settings',
  help: 'Help',
};

export function CandidateBreadcrumbs() {
  const { pathname } = useLocation();
  const section = pathname.replace('/candidate/dashboard', '').split('/').filter(Boolean)[0];

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
      <Link
        className="inline-flex items-center gap-2 font-semibold text-slate-500 transition hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-200"
        to="/candidate/dashboard"
      >
        <FiHome aria-hidden="true" className="size-4" />
        Dashboard
      </Link>
      {section ? (
        <>
          <FiChevronRight aria-hidden="true" className="size-4 text-slate-400" />
          <span className="font-bold text-slate-950 dark:text-white">
            {LABELS[section] ?? 'Workspace'}
          </span>
        </>
      ) : null}
    </nav>
  );
}
