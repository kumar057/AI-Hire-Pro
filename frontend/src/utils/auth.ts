import type { UserRole } from '@/types/api';

export function roleDashboardPath(role: UserRole) {
  return `/${role}/dashboard`;
}

export function readableRole(role: UserRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

