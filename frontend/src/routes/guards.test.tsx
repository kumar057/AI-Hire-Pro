import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { vi } from 'vitest';

import { AuthContext, type AuthContextValue } from '@/context/authContextValue';
import { GuestRoute, ProtectedRoute } from '@/routes/guards';
import type { UserProfile } from '@/types/api';

function LocationProbe() {
  const location = useLocation();
  return <div>location:{location.pathname}</div>;
}

function makeUser(role: UserProfile['role']): UserProfile {
  return {
    avatar: null,
    company: null,
    created_at: new Date().toISOString(),
    email: `${role}@example.com`,
    first_name: 'Test',
    is_active: true,
    is_verified: true,
    last_name: 'User',
    permissions: [],
    phone: null,
    role,
    updated_at: new Date().toISOString(),
    uuid: `${role}-uuid`,
  };
}

function renderWithAuth(
  value: Partial<AuthContextValue>,
  initialPath: string,
  routes: React.ReactNode,
) {
  const authValue: AuthContextValue = {
    isAuthenticated: Boolean(value.user),
    isInitializing: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    register: vi.fn(),
    updateProfile: vi.fn(),
    user: null,
    ...value,
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        {routes}
        <LocationProbe />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('route guards', () => {
  it('redirects unauthenticated users from protected routes', () => {
    renderWithAuth(
      { user: null },
      '/candidate/dashboard',
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route element={<div>candidate dashboard</div>} path="/candidate/dashboard" />
        </Route>
        <Route element={<div>candidate login</div>} path="/candidate/login" />
      </Routes>,
    );

    expect(screen.getByText('candidate login')).toBeInTheDocument();
    expect(screen.getByText('location:/candidate/login')).toBeInTheDocument();
  });

  it('redirects authenticated guests to their dashboard', () => {
    renderWithAuth(
      { user: makeUser('admin'), isAuthenticated: true },
      '/candidate/login',
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<div>candidate login</div>} path="/candidate/login" />
        </Route>
        <Route element={<div>admin dashboard</div>} path="/admin/dashboard" />
      </Routes>,
    );

    expect(screen.getByText('admin dashboard')).toBeInTheDocument();
    expect(screen.getByText('location:/admin/dashboard')).toBeInTheDocument();
  });

  it('redirects authenticated users away from unauthorized role routes', () => {
    renderWithAuth(
      { user: makeUser('company'), isAuthenticated: true },
      '/candidate/dashboard',
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route element={<div>candidate dashboard</div>} path="/candidate/dashboard" />
        </Route>
        <Route element={<div>company dashboard</div>} path="/company/dashboard" />
      </Routes>,
    );

    expect(screen.getByText('company dashboard')).toBeInTheDocument();
    expect(screen.getByText('location:/company/dashboard')).toBeInTheDocument();
  });
});

