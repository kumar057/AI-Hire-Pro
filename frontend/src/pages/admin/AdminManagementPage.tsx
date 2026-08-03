import { useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/AdminDashboard/AdminPageHeader';
import { AdminSkeleton } from '@/components/AdminDashboard/AdminSkeleton';
import { AdminTable, type AdminColumn } from '@/components/AdminDashboard/AdminTable';
import { adminService } from '@/services/adminService';
import type { AdminRecord } from '@/types/admin';

type Resource = 'applications' | 'companies' | 'jobs' | 'users';
const config: Record<Resource, { title: string; description: string; filterKey: string; columns: AdminColumn[]; load: () => Promise<{ items: AdminRecord[] }> }> = {
  users: { title: 'User Management', description: 'Review accounts, roles, status, and platform access.', filterKey: 'status', columns: [{ key: 'name', label: 'User' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' }], load: adminService.getUsers },
  companies: { title: 'Company Management', description: 'Monitor employer verification, subscriptions, and marketplace activity.', filterKey: 'status', columns: [{ key: 'name', label: 'Company' }, { key: 'industry', label: 'Industry' }, { key: 'jobs', label: 'Jobs' }, { key: 'plan', label: 'Plan' }, { key: 'status', label: 'Status' }], load: adminService.getCompanies },
  jobs: { title: 'Job Management', description: 'Moderate job posts, visibility, and marketplace status.', filterKey: 'status', columns: [{ key: 'title', label: 'Job' }, { key: 'company', label: 'Company' }, { key: 'applications', label: 'Applications' }, { key: 'status', label: 'Status' }, { key: 'posted', label: 'Posted' }], load: adminService.getJobs },
  applications: { title: 'Application Management', description: 'Inspect application flow and lifecycle status across the platform.', filterKey: 'status', columns: [{ key: 'candidate', label: 'Candidate' }, { key: 'job', label: 'Job' }, { key: 'company', label: 'Company' }, { key: 'status', label: 'Status' }, { key: 'applied', label: 'Applied' }], load: adminService.getApplications },
};

export function AdminManagementPage({ resource }: { resource: Resource }) {
  const [data, setData] = useState<AdminRecord[] | null>(null); const selected = config[resource];
  useEffect(() => { void selected.load().then((response) => setData(response.items)); }, [selected]);
  if (!data) return <AdminSkeleton />;
  return <div className="mt-6 space-y-6"><AdminPageHeader description={selected.description} title={selected.title} /><AdminTable columns={selected.columns} data={data} filterKey={selected.filterKey} title={selected.title} /></div>;
}

