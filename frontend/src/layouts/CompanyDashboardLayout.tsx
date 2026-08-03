import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { CompanyBreadcrumbs } from '@/components/CompanyDashboard/CompanyBreadcrumbs';
import { CompanySidebar } from '@/components/CompanyDashboard/CompanySidebar';
import { CompanyTopbar } from '@/components/CompanyDashboard/CompanyTopbar';
import { useAuth } from '@/hooks/useAuth';

export function CompanyDashboardLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => setOpen(false), [location.pathname]);
  async function handleLogout() { await logout(); navigate('/company/login', { replace: true }); }
  return <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white"><div className="flex min-h-screen">
    <CompanySidebar collapsed={collapsed} isOpen={open} onClose={() => setOpen(false)} onLogout={handleLogout} onToggleCollapse={() => setCollapsed((value) => !value)} />
    <div className="flex min-w-0 flex-1 flex-col"><CompanyTopbar onLogout={handleLogout} onMenuToggle={() => setOpen((value) => !value)} /><main className="flex-1 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><CompanyBreadcrumbs /><AnimatePresence mode="wait"><motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: 10 }} key={location.pathname}><Outlet /></motion.div></AnimatePresence></div></main><footer className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500 dark:border-white/10">AIHire Pro Company Workspace / Enterprise hiring operations</footer></div>
  </div></div>;
}
