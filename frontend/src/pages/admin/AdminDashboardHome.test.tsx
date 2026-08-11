import { cloneElement, type ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { AdminDashboardHome } from '@/pages/admin/AdminDashboardHome';

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactElement<{ height?: number; width?: number }> }) =>
      cloneElement(children, { height: 288, width: 720 }),
  };
});

vi.mock('@/services/adminService', () => ({
  adminService: {
    getDashboard: vi.fn().mockResolvedValue({
      summary: {
        total_users: 128420,
        candidates: 112860,
        companies: 15560,
        jobs: 48320,
        applications: 684250,
        revenue: 1240000,
        daily_active_users: 28460,
        system_health: '99.98%',
      },
      user_growth: [
        { label: 'Jul', users: 112 },
        { label: 'Aug', users: 128 },
      ],
      job_growth: [
        { label: 'Jul', jobs: 44 },
        { label: 'Aug', jobs: 48 },
      ],
      application_trend: [{ label: 'Aug', applications: 684 }],
      top_companies: [
        { name: 'Northstar Labs', jobs: 84 },
        { name: 'SignalWorks', jobs: 72 },
      ],
      most_applied_jobs: [{ name: 'Frontend Engineer', applications: 3840 }],
      active_users: [{ label: 'Fri', users: 28460 }],
    }),
  },
}));

describe('AdminDashboardHome', () => {
  it('loads dashboard cards and charts without React warnings', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warningSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <MemoryRouter>
        <AdminDashboardHome />
      </MemoryRouter>,
    );

    expect(screen.getByRole('status', { name: 'Loading admin dashboard' })).toBeInTheDocument();
    expect(await screen.findByText('Platform overview')).toBeInTheDocument();
    expect(screen.getByText('User growth')).toBeInTheDocument();
    expect(screen.getByText('Top companies')).toBeInTheDocument();

    await waitFor(() => {
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warningSpy).not.toHaveBeenCalled();
    });

    errorSpy.mockRestore();
    warningSpy.mockRestore();
  });
});
