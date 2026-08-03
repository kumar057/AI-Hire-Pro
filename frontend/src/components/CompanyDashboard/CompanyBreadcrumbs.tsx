import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const labels: Record<string, string> = { profile: 'Company Profile', 'post-job': 'Create Job', jobs: 'My Jobs', applicants: 'Applicants', interviews: 'Interviews', messages: 'Messages', notifications: 'Notifications', analytics: 'Analytics', subscription: 'Subscription', settings: 'Settings', help: 'Help' };

export function CompanyBreadcrumbs() {
  const section = useLocation().pathname.replace('/company/dashboard', '').split('/').filter(Boolean)[0];
  return <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm"><Link className="flex items-center gap-2 font-semibold text-slate-500 hover:text-cyan-700 dark:text-slate-400" to="/company/dashboard"><FiHome />Dashboard</Link>{section ? <><FiChevronRight className="text-slate-400" /><span className="font-bold text-slate-950 dark:text-white">{labels[section] ?? 'Workspace'}</span></> : null}</nav>;
}
