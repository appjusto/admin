import { AdminRole, ManagerProfile } from '@appjusto/types';

export interface BusinessManager extends ManagerProfile {
  role: string | null;
}

export interface UserWithRole {
  uid: string;
  role: string | null;
}

export interface ManagerWithRole {
  id: string;
  email: string;
  role: AdminRole | null;
  createdOn: string;
  appVersion?: string;
}
