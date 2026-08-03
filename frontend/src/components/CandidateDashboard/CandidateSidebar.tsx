import { useEffect, useRef } from 'react';
import { FiBriefcase, FiChevronLeft, FiChevronRight, FiLogOut, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

import { CANDIDATE_NAV_ITEMS } from '@/constants/candidateDashboard';

type CandidateSidebarProps = {
  collapsed: boolean;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onToggleCollapse: () => void;
};

export function CandidateSidebar({
  collapsed,
  isOpen,
  onClose,
  onLogout,
  onToggleCollapse,
}: CandidateSidebarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let context: gsap.Context | undefined;

    async function animateNavigation() {
      const { default: gsap } = await import('gsap');
      context = gsap.context(() => {
        gsap.fromTo(
          '.candidate-nav-item',
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.38, stagger: 0.025, ease: 'power2.out' },
        );
      }, navRef);
    }

    void animateNavigation();
    return () => context?.revert();
  }, []);

  return (
    <>
      <button
        aria-label="Close sidebar"
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        type="button"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/15 backdrop-blur-xl transition-all duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:shadow-none dark:border-white/10 dark:bg-slate-950/95 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 px-4 dark:border-white/10">
          <NavLink
            className="flex min-w-0 items-center gap-3"
            onClick={onClose}
            to="/candidate/dashboard"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white shadow-lg shadow-cyan-950/15 dark:bg-white dark:text-slate-950">
              <FiBriefcase aria-hidden="true" />
            </span>
            <span
              className={`truncate text-lg font-bold text-slate-950 dark:text-white ${
                collapsed ? 'lg:sr-only' : ''
              }`}
            >
              AIHire Pro
            </span>
          </NavLink>

          <button
            aria-label="Close sidebar"
            className="grid size-10 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>

          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden size-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 lg:grid dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            onClick={onToggleCollapse}
            type="button"
          >
            {collapsed ? <FiChevronRight aria-hidden="true" /> : <FiChevronLeft aria-hidden="true" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" ref={navRef}>
          {CANDIDATE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  `candidate-nav-item flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-lg shadow-cyan-950/15 dark:bg-white dark:text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                  } ${collapsed ? 'lg:justify-center' : ''}`
                }
                end={item.end}
                key={item.id}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                to={item.to}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                <span className={`truncate ${collapsed ? 'lg:sr-only' : ''}`}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3 dark:border-white/10">
          <button
            className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-300/10 ${
              collapsed ? 'lg:justify-center' : ''
            }`}
            onClick={onLogout}
            title={collapsed ? 'Logout' : undefined}
            type="button"
          >
            <FiLogOut aria-hidden="true" className="size-5 shrink-0" />
            <span className={`truncate ${collapsed ? 'lg:sr-only' : ''}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
