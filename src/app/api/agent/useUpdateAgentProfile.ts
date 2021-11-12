import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextApi } from 'app/state/api/context';
import { ManagerProfile } from 'appjusto-types';
import { useAuthentication } from '../auth/useAuthentication';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface UpdateAgentData {
  changes: Partial<ManagerProfile>;
  password?: string;
  currentPassword?: string;
}

export const useUpdateAgentProfile = () => {
  // context
  const api = useContextApi();
  const { updateUsersPassword } = useAuthentication();
  const { agent } = useContextAgentProfile();
  // mutations
  const { mutateAsync: updateProfile, mutationResult: updateResult } = useCustomMutation(
    async (data: UpdateAgentData) => {
      if (data.password) {
        await updateUsersPassword(data.password, data.currentPassword);
      }
      return api.manager().updateProfile(agent?.id!, data.changes);
    },
    'updateAgentProfile'
  );
  // return
  return { updateProfile, updateResult };
};
