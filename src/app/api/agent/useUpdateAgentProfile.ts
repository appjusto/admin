import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextApi } from 'app/state/api/context';
import { ManagerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';
import { useAuthentication } from '../auth/useAuthentication';

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
  const { mutate: updateProfile, isLoading, isSuccess, isError, error } = useMutation(
    async (data: UpdateAgentData) => {
      if (data.password) {
        await updateUsersPassword(data.password, data.currentPassword);
      }
      return api.manager().updateProfile(agent?.id!, data.changes);
    }
  );
  // return
  return { updateProfile, updateResult: { isLoading, isSuccess, isError, error } };
};
