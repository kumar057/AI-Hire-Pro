import { motion } from 'framer-motion';
import { FiBox, FiDatabase, FiGitBranch, FiServer } from 'react-icons/fi';

import { pageTransition } from '@/animations/pageTransitions';
import { StatusBadge } from '@/components/StatusBadge';
import { APP_NAME } from '@/constants/app';
import { useAppConfig } from '@/hooks/useAppConfig';
import { useHealthCheck } from '@/hooks/useHealthCheck';

const foundationAreas = [
  { label: 'Frontend', value: 'React 19 + Vite', icon: FiBox },
  { label: 'Backend', value: 'FastAPI service layer', icon: FiServer },
  { label: 'Database', value: 'PostgreSQL + Alembic', icon: FiDatabase },
  { label: 'Workflow', value: 'Dockerized monorepo', icon: FiGitBranch },
];

export function FoundationPage() {
  const { apiBaseUrl, appEnv } = useAppConfig();
  const health = useHealthCheck();

  return (
    <motion.section
      animate="animate"
      className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
      exit="exit"
      initial="initial"
      variants={pageTransition}
    >
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
              Enterprise foundation
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              {APP_NAME}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              A production-grade monorepo foundation for an AI-powered hiring platform.
              Business workflows are intentionally left out so product development can begin on
              clean architecture.
            </p>
          </div>
          <StatusBadge status={health.status} />
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          {foundationAreas.map((area) => {
            const Icon = area.icon;

            return (
              <div
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
                key={area.label}
              >
                <dt className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Icon aria-hidden="true" className="size-4" />
                  {area.label}
                </dt>
                <dd className="mt-2 text-base font-semibold text-slate-950">{area.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>

      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold tracking-normal text-slate-950">Runtime</h2>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Environment</dt>
            <dd className="mt-1 break-words font-mono text-slate-950">{appEnv}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">API base URL</dt>
            <dd className="mt-1 break-words font-mono text-slate-950">{apiBaseUrl}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">API version</dt>
            <dd className="mt-1 break-words font-mono text-slate-950">
              {health.data?.version ?? 'Pending'}
            </dd>
          </div>
        </dl>
      </aside>
    </motion.section>
  );
}
