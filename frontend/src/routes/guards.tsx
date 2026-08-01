import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/api';
import { roleDashboardPath } from '@/utils/auth';

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

function RouteLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
    </div>
  );
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isInitializing, user } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <RouteLoader />;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/candidate/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate replace to={roleDashboardPath(user.role)} />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isInitializing, user } = useAuth();

  if (isInitializing) {
    return <RouteLoader />;
  }

  if (user) {
    return <Navigate replace to={roleDashboardPath(user.role)} />;
  }

  return <Outlet />;
}

