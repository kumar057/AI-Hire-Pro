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
const ResumeAnalyzerPage = lazy(() =>
  import('@/pages/candidate/ResumeAnalyzerPage').then((module) => ({
    default: module.ResumeAnalyzerPage,
  })),
);
const JobsPage = lazy(() =>
  import('@/pages/candidate/JobsPage').then((module) => ({ default: module.JobsPage })),
);
const JobDiscoveryPage = lazy(() =>
  import('@/pages/candidate/JobDiscoveryPage').then((module) => ({
    default: module.JobDiscoveryPage,
  })),
);
const JobDetailsPage = lazy(() =>
  import('@/pages/candidate/JobDetailsPage').then((module) => ({
    default: module.JobDetailsPage,
  })),
);
const ApplyJobPage = lazy(() =>
  import('@/pages/candidate/ApplyJobPage').then((module) => ({ default: module.ApplyJobPage })),
);
const CandidateApplicationDetailPage = lazy(() =>
  import('@/pages/candidate/CandidateApplicationDetailPage').then((module) => ({
    default: module.CandidateApplicationDetailPage,
  })),
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
const CompanyDashboardLayout = lazy(() =>
  import('@/layouts/CompanyDashboardLayout').then((module) => ({
    default: module.CompanyDashboardLayout,
  })),
);
const CompanyDashboardHome = lazy(() =>
  import('@/pages/company/CompanyDashboardHome').then((module) => ({
    default: module.CompanyDashboardHome,
  })),
);
const CompanyProfilePage = lazy(() =>
  import('@/pages/company/CompanyProfilePage').then((module) => ({
    default: module.CompanyProfilePage,
  })),
);
const PostJobPage = lazy(() =>
  import('@/pages/company/PostJobPage').then((module) => ({ default: module.PostJobPage })),
);
const ManageJobsPage = lazy(() =>
  import('@/pages/company/ManageJobsPage').then((module) => ({
    default: module.ManageJobsPage,
  })),
);
const EditJobPage = lazy(() =>
  import('@/pages/company/EditJobPage').then((module) => ({ default: module.EditJobPage })),
);
const JobPreviewPage = lazy(() =>
  import('@/pages/company/JobPreviewPage').then((module) => ({ default: module.JobPreviewPage })),
);
const JobAnalyticsPage = lazy(() =>
  import('@/pages/company/JobAnalyticsPage').then((module) => ({ default: module.JobAnalyticsPage })),
);
const ApplicantsPage = lazy(() =>
  import('@/pages/company/ApplicantsPage').then((module) => ({
    default: module.ApplicantsPage,
  })),
);
const CompanyApplicationDetailPage = lazy(() =>
  import('@/pages/company/CompanyApplicationDetailPage').then((module) => ({
    default: module.CompanyApplicationDetailPage,
  })),
);
const RecruiterPipelinePage = lazy(() =>
  import('@/pages/company/RecruiterPipelinePage').then((module) => ({ default: module.RecruiterPipelinePage })),
);
const RecruiterCandidatesPage = lazy(() =>
  import('@/pages/company/RecruiterCandidatesPage').then((module) => ({ default: module.RecruiterCandidatesPage })),
);
const RecruiterCandidateProfilePage = lazy(() =>
  import('@/pages/company/RecruiterCandidateProfilePage').then((module) => ({ default: module.RecruiterCandidateProfilePage })),
);
const RecruiterInterviewsPage = lazy(() => import('@/pages/company/RecruiterWorkspacePages').then((module) => ({ default: module.RecruiterInterviewsPage })));
const HiringPipelinePage = lazy(() => import('@/pages/company/RecruiterWorkspacePages').then((module) => ({ default: module.HiringPipelinePage })));
const RecruiterNotesPage = lazy(() => import('@/pages/company/RecruiterWorkspacePages').then((module) => ({ default: module.RecruiterNotesPage })));
const TeamCollaborationPage = lazy(() => import('@/pages/company/RecruiterWorkspacePages').then((module) => ({ default: module.TeamCollaborationPage })));
const HiringCalendarPage = lazy(() => import('@/pages/company/RecruiterWorkspacePages').then((module) => ({ default: module.HiringCalendarPage })));
const CompanyAnalyticsPage = lazy(() =>
  import('@/pages/company/CompanyAnalyticsPage').then((module) => ({
    default: module.CompanyAnalyticsPage,
  })),
);
const CompanyMessagesPage = lazy(() =>
  import('@/pages/company/CompanyWorkspacePages').then((module) => ({ default: module.CompanyMessagesPage })),
);
const CompanyNotificationsPage = lazy(() =>
  import('@/pages/company/CompanyWorkspacePages').then((module) => ({ default: module.CompanyNotificationsPage })),
);
const CompanySubscriptionPage = lazy(() =>
  import('@/pages/company/CompanyWorkspacePages').then((module) => ({ default: module.CompanySubscriptionPage })),
);
const CompanySettingsPage = lazy(() =>
  import('@/pages/company/CompanyWorkspacePages').then((module) => ({ default: module.CompanySettingsPage })),
);
const CompanyHelpPage = lazy(() =>
  import('@/pages/company/CompanyWorkspacePages').then((module) => ({ default: module.CompanyHelpPage })),
);
const AdminDashboardLayout = lazy(() =>
  import('@/layouts/AdminDashboardLayout').then((module) => ({ default: module.AdminDashboardLayout })),
);
const AdminDashboardHome = lazy(() =>
  import('@/pages/admin/AdminDashboardHome').then((module) => ({ default: module.AdminDashboardHome })),
);
const AdminManagementPage = lazy(() =>
  import('@/pages/admin/AdminManagementPage').then((module) => ({ default: module.AdminManagementPage })),
);
const AdminAnalyticsPage = lazy(() =>
  import('@/pages/admin/AdminAnalyticsPage').then((module) => ({ default: module.AdminAnalyticsPage })),
);
const AdminReportsPage = lazy(() =>
  import('@/pages/admin/AdminReportsPage').then((module) => ({ default: module.AdminReportsPage })),
);
const AdminActivityPage = lazy(() => import('@/pages/admin/AdminOperationsPages').then((module) => ({ default: module.AdminActivityPage })));
const AdminAuditPage = lazy(() => import('@/pages/admin/AdminOperationsPages').then((module) => ({ default: module.AdminAuditPage })));
const AdminSupportPage = lazy(() => import('@/pages/admin/AdminOperationsPages').then((module) => ({ default: module.AdminSupportPage })));
const AdminNotificationsPage = lazy(() => import('@/pages/admin/AdminOperationsPages').then((module) => ({ default: module.AdminNotificationsPage })));
const AdminFeedbackPage = lazy(() => import('@/pages/admin/AdminOperationsPages').then((module) => ({ default: module.AdminFeedbackPage })));
const AdminAISettingsPage = lazy(() => import('@/pages/admin/AdminOperationsPages').then((module) => ({ default: module.AdminAISettingsPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminOperationsPages').then((module) => ({ default: module.AdminSettingsPage })));

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
            <Route element={<ResumeAnalyzerPage />} path="resume-analyzer" />
            <Route element={<JobsPage />} path="jobs" />
            <Route element={<JobDiscoveryPage mode="search" />} path="jobs/search" />
            <Route element={<JobDiscoveryPage mode="featured" />} path="jobs/featured" />
            <Route element={<JobDiscoveryPage mode="similar" />} path="jobs/:jobId/similar" />
            <Route element={<JobDetailsPage />} path="jobs/:jobId" />
            <Route element={<ApplyJobPage />} path="jobs/:jobId/apply" />
            <Route element={<SavedJobsPage />} path="saved-jobs" />
            <Route element={<AppliedJobsPage />} path="applied-jobs" />
            <Route element={<ApplicationHistoryPage />} path="application-history" />
            <Route element={<CandidateApplicationDetailPage />} path="applications/:applicationId" />
            <Route element={<NotificationsPage />} path="notifications" />
            <Route element={<MessagesPage />} path="messages" />
            <Route element={<SettingsPage />} path="settings" />
            <Route element={<HelpPage />} path="help" />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['company']} />}>
          <Route element={<CompanyDashboardLayout />} path="/company/dashboard">
            <Route element={<CompanyDashboardHome />} index />
            <Route element={<CompanyProfilePage />} path="profile" />
            <Route element={<PostJobPage />} path="post-job" />
            <Route element={<ManageJobsPage />} path="jobs" />
            <Route element={<EditJobPage />} path="jobs/:jobId/edit" />
            <Route element={<JobPreviewPage />} path="jobs/:jobId/preview" />
            <Route element={<JobAnalyticsPage />} path="jobs/:jobId/analytics" />
            <Route element={<ApplicantsPage />} path="applicants" />
            <Route element={<CompanyApplicationDetailPage />} path="applicants/:applicationId" />
            <Route element={<RecruiterPipelinePage />} path="pipeline" />
            <Route element={<RecruiterCandidatesPage />} path="candidates" />
            <Route element={<RecruiterCandidateProfilePage />} path="candidates/:candidateId" />
            <Route element={<RecruiterInterviewsPage />} path="interviews" />
            <Route element={<HiringPipelinePage />} path="hiring-pipeline" />
            <Route element={<RecruiterNotesPage />} path="recruiter-notes" />
            <Route element={<TeamCollaborationPage />} path="recruiter-team" />
            <Route element={<HiringCalendarPage />} path="hiring-calendar" />
            <Route element={<CompanyMessagesPage />} path="messages" />
            <Route element={<CompanyNotificationsPage />} path="notifications" />
            <Route element={<CompanyAnalyticsPage />} path="analytics" />
            <Route element={<CompanySubscriptionPage />} path="subscription" />
            <Route element={<CompanySettingsPage />} path="settings" />
            <Route element={<CompanyHelpPage />} path="help" />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminDashboardLayout />} path="/admin/dashboard">
            <Route element={<AdminDashboardHome />} index />
            <Route element={<AdminManagementPage resource="users" />} path="users" />
            <Route element={<AdminManagementPage resource="companies" />} path="companies" />
            <Route element={<AdminManagementPage resource="jobs" />} path="jobs" />
            <Route element={<AdminManagementPage resource="applications" />} path="applications" />
            <Route element={<AdminReportsPage />} path="reports" />
            <Route element={<AdminAnalyticsPage />} path="analytics" />
            <Route element={<AdminNotificationsPage />} path="notifications" />
            <Route element={<AdminActivityPage />} path="activity" />
            <Route element={<AdminAuditPage />} path="audit" />
            <Route element={<AdminSupportPage />} path="support" />
            <Route element={<AdminFeedbackPage />} path="feedback" />
            <Route element={<AdminAISettingsPage />} path="ai-settings" />
            <Route element={<AdminSettingsPage />} path="settings" />
          </Route>
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  );
}
