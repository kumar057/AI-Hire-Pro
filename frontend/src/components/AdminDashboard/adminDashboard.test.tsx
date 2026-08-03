import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AdminBreadcrumbs, AdminSidebar } from '@/components/AdminDashboard/AdminShell';
import { AdminSkeleton } from '@/components/AdminDashboard/AdminSkeleton';
import { AdminTable } from '@/components/AdminDashboard/AdminTable';
import { useThemeMode } from '@/hooks/useThemeMode';
import type { AdminRecord } from '@/types/admin';

const records: AdminRecord[] = [
  { id: '1', name: 'Zeta User', status: 'Active', joined: 'Aug 1' },
  { id: '2', name: 'Alpha User', status: 'Pending', joined: 'Aug 2' },
  { id: '3', name: 'Beta User', status: 'Active', joined: 'Aug 3' },
  { id: '4', name: 'Gamma User', status: 'Suspended', joined: 'Aug 4' },
  { id: '5', name: 'Delta User', status: 'Active', joined: 'Aug 5' },
  { id: '6', name: 'Epsilon User', status: 'Pending', joined: 'Aug 6' },
];
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'joined', label: 'Joined' },
];

describe('admin dashboard components', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('supports table search, filtering, sorting, and pagination', async () => {
    const user = userEvent.setup();
    render(<AdminTable columns={columns} data={records} filterKey="status" title="Users" />);

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Gamma User')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search users...'), 'Zeta');
    expect(screen.getByText('Zeta User')).toBeInTheDocument();
    expect(screen.queryByText('Alpha User')).not.toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText('Search users...'));
    await user.selectOptions(screen.getByRole('combobox'), 'Pending');
    expect(screen.getByText('Alpha User')).toBeInTheDocument();
    expect(screen.queryByText('Beta User')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox'), 'all');
    await user.click(screen.getByRole('button', { name: /Name/ }));
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Zeta User')).toBeInTheDocument();
  });

  it('updates breadcrumbs from the current admin route', () => {
    render(<MemoryRouter initialEntries={['/admin/dashboard/audit']}><AdminBreadcrumbs /></MemoryRouter>);
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('href', '/admin/dashboard');
  });

  it('exposes sidebar close, collapse, and logout controls', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn(); const onLogout = vi.fn(); const onToggle = vi.fn();
    render(<MemoryRouter><AdminSidebar collapsed={false} onClose={onClose} onLogout={onLogout} onToggle={onToggle} open /></MemoryRouter>);
    await user.click(screen.getAllByRole('button', { name: 'Close sidebar' })[0]);
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    await user.click(screen.getByRole('button', { name: 'Logout' }));
    expect(onClose).toHaveBeenCalled(); expect(onToggle).toHaveBeenCalled(); expect(onLogout).toHaveBeenCalled();
  });

  it('toggles dark mode and persists the preference', async () => {
    function ThemeProbe() { const { isDark, toggleTheme } = useThemeMode(); return <button onClick={toggleTheme}>{isDark ? 'Dark' : 'Light'}</button>; }
    const user = userEvent.setup(); render(<ThemeProbe />);
    await user.click(screen.getByRole('button', { name: 'Light' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });

  it('renders an accessible loading skeleton', () => {
    render(<AdminSkeleton />);
    expect(screen.getByRole('status', { name: 'Loading admin dashboard' })).toBeInTheDocument();
  });
});
