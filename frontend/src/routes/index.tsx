import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { GuestRoute, ProtectedRoute } from '@/routes/guards';

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((module) => ({ default: module.LandingPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ResetPasswordPage').then((module) => ({
    default: module.ResetPasswordPage,
  })),
);
const ProfileSetupPage = lazy(() =>
  import('@/pages/auth/ProfileSetupPage').then((module) => ({
    default: module.ProfileSetupPage,
  })),
);
const DashboardPage = lazy(() =>
  import('@/pages/auth/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const CandidateDashboardLayout = lazy(() =>
  import('@/layouts/CandidateDashboardLayout').then((module) => ({
    default: module.CandidateDashboardLayout,
  })),
);
const CandidateDashboardHome = lazy(() =>
  import('@/pages/candidate/CandidateDashboardHome').then((module) => ({
    default: module.CandidateDashboardHome,
  })),
);
const MyProfilePage = lazy(() =>
  import('@/pages/candidate/MyProfilePage').then((module) => ({ default: module.MyProfilePage })),
);
const ResumePage = lazy(() =>
  import('@/pages/candidate/ResumePage').then((module) => ({ default: module.ResumePage })),
);
const JobsPage = lazy(() =>
  import('@/pages/candidate/JobsPage').then((module) => ({ default: module.JobsPage })),
);
const SavedJobsPage = lazy(() =>
  import('@/pages/candidate/SavedJobsPage').then((module) => ({ default: module.SavedJobsPage })),
);
const AppliedJobsPage = lazy(() =>
  import('@/pages/candidate/AppliedJobsPage').then((module) => ({
    default: module.AppliedJobsPage,
  })),
);
const ApplicationHistoryPage = lazy(() =>
  import('@/pages/candidate/ApplicationHistoryPage').then((module) => ({
    default: module.ApplicationHistoryPage,
  })),
);
const NotificationsPage = lazy(() =>
  import('@/pages/candidate/NotificationsPage').then((module) => ({
    default: module.NotificationsPage,
  })),
);
const MessagesPage = lazy(() =>
  import('@/pages/candidate/MessagesPage').then((module) => ({ default: module.MessagesPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/candidate/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const HelpPage = lazy(() =>
  import('@/pages/candidate/HelpPage').then((module) => ({ default: module.HelpPage })),
);

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<GuestRoute />}>
          <Route element={<LoginPage role="candidate" />} path="/candidate/login" />
          <Route element={<RegisterPage role="candidate" />} path="/candidate/register" />
          <Route element={<LoginPage role="company" />} path="/company/login" />
          <Route element={<RegisterPage role="company" />} path="/company/register" />
          <Route element={<ForgotPasswordPage />} path="/forgot-password" />
          <Route element={<ResetPasswordPage />} path="/reset-password" />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<ProfileSetupPage />} path="/profile/setup" />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route element={<CandidateDashboardLayout />} path="/candidate/dashboard">
            <Route element={<CandidateDashboardHome />} index />
            <Route element={<MyProfilePage />} path="profile" />
            <Route element={<ResumePage />} path="resume" />
            <Route element={<JobsPage />} path="jobs" />
            <Route element={<SavedJobsPage />} path="saved-jobs" />
            <Route element={<AppliedJobsPage />} path="applied-jobs" />
            <Route element={<ApplicationHistoryPage />} path="application-history" />
            <Route element={<NotificationsPage />} path="notifications" />
            <Route element={<MessagesPage />} path="messages" />
            <Route element={<SettingsPage />} path="settings" />
            <Route element={<HelpPage />} path="help" />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['company']} />}>
          <Route element={<DashboardPage role="company" />} path="/company/dashboard" />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardPage role="admin" />} path="/admin/dashboard" />
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  );
}
