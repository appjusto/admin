import { BackofficeAccess, ManagerProfile } from '@appjusto/types';

export interface AgentWithAccess extends ManagerProfile {
  access: BackofficeAccess;
}
