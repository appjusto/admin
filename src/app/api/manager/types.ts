import { ManagerProfile } from 'appjusto-types';

export interface BusinessManager extends ManagerProfile {
  role: string | null;
}

export interface UserWithRole {
  uid: string;
  role: string | null;
}

export interface ManagerWithRole {
  uid: string;
  email: string;
  role: string | null;
  createdOn: string;
}
