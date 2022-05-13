import { ManagerProfile } from '@appjusto/types';

export interface BusinessManager extends ManagerProfile {
  role: string | null;
}

export interface UserWithRole {
  uid: string;
  role: string | null;
}
