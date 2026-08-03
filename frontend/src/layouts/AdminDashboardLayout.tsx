import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AdminBreadcrumbs, AdminSidebar, AdminTopbar } from '@/components/AdminDashboard/AdminShell';
import { useAuth } from '@/hooks/useAuth';

export function AdminDashboardLayout() {
  const [open, setOpen] = useState(false); const [collapsed, setCollapsed] = useState(false); const { logout } = useAuth(); const location = useLocation(); const navigate = useNavigate();
  useEffect(() => setOpen(false), [location.pathname]);
  async function handleLogout() { await logout(); navigate('/candidate/login', { replace: true }); }
  return <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white"><div className="flex min-h-screen"><AdminSidebar collapsed={collapsed} onClose={() => setOpen(false)} onLogout={handleLogout} onToggle={() => setCollapsed((value) => !value)} open={open} /><div className="flex min-w-0 flex-1 flex-col"><AdminTopbar onLogout={handleLogout} onMenu={() => setOpen((value) => !value)} /><main className="flex-1 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><AdminBreadcrumbs /><AnimatePresence mode="wait"><motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: 10 }} key={location.pathname}><Outlet /></motion.div></AnimatePresence></div></main><footer className="border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500 dark:border-white/10">AIHire Pro Administration / Secure platform operations</footer></div></div></div>;
}
