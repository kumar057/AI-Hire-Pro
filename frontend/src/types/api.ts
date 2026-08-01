export type HealthResponse = {
  service: string;
  status: 'ok';
  version: string;
};

export type UserRole = 'candidate' | 'company' | 'admin';

export type CompanyProfile = {
  id: number;
  company_name: string;
  website?: string | null;
  logo?: string | null;
  industry?: string | null;
  company_size?: string | null;
  location?: string | null;
  description?: string | null;
};

export type UserProfile = {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company?: CompanyProfile | null;
  permissions: string[];
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: UserProfile;
};

export type ApiMessageResponse = {
  message: string;
};
