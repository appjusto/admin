import { AdminRole, ManagerProfile } from '@appjusto/types';

export interface BusinessManager extends ManagerProfile {
  role: string | null;
}

export interface UserWithRole {
  uid: string;
  role: string | null;
}

export interface ManagerWithPermissions {
  uid: string;
  email: string;
  permissions: AdminRole | null;
  createdOn: string;
  appVersion?: string;
}
