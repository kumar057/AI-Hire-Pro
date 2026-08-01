import { Navigate, Route, Routes } from 'react-router-dom';

import { LandingPage } from '@/pages/LandingPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
