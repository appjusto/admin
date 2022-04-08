import { ManagerProfile, Role } from '@appjusto/types';

export interface AgentWithRole extends ManagerProfile {
  role: Role;
}
