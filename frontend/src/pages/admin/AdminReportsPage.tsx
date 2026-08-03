import { useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/AdminDashboard/AdminPageHeader';
import { AdminSkeleton } from '@/components/AdminDashboard/AdminSkeleton';
import { AdminTable } from '@/components/AdminDashboard/AdminTable';
import { adminService } from '@/services/adminService';
import type { AdminRecord } from '@/types/admin';
export function AdminReportsPage() { const [reports, setReports] = useState<AdminRecord[] | null>(null); useEffect(() => { void adminService.getReports().then((response) => setReports(response.reports)); }, []); if (!reports) return <AdminSkeleton />; return <div className="mt-6 space-y-6"><AdminPageHeader description="Generate and review platform operations, growth, and revenue reports." title="Reports" /><AdminTable columns={[{ key: 'name', label: 'Report' }, { key: 'category', label: 'Category' }, { key: 'period', label: 'Period' }, { key: 'status', label: 'Status' }]} data={reports} filterKey="status" title="Generated Reports" /></div>; }
