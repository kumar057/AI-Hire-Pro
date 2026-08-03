import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { CandidateBreadcrumbs } from '@/components/CandidateDashboard/CandidateBreadcrumbs';
import { CandidateFooter } from '@/components/CandidateDashboard/CandidateFooter';
import { CandidateSidebar } from '@/components/CandidateDashboard/CandidateSidebar';
import { CandidateTopbar } from '@/components/CandidateDashboard/CandidateTopbar';
import { useAuth } from '@/hooks/useAuth';

export function CandidateDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate('/candidate/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <CandidateSidebar
          collapsed={isCollapsed}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
          onToggleCollapse={() => setIsCollapsed((current) => !current)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <CandidateTopbar
            onLogout={handleLogout}
            onMenuToggle={() => setIsSidebarOpen((current) => !current)}
          />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <CandidateBreadcrumbs />
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: 10 }}
                  key={location.pathname}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <CandidateFooter />
        </div>
      </div>
    </div>
  );
}
