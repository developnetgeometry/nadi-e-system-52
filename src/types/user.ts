
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  USER = 'user'
}

export interface User {
  id: string;
  email: string;
  role?: UserRole;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
