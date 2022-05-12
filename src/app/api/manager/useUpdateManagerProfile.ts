import { ManagerProfile } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useAuthentication } from '../auth/useAuthentication';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface UpdateManagerData {
  changes: Partial<ManagerProfile>;
  password?: string;
  currentPassword?: string;
}

export const useUpdateManagerProfile = (managerId?: string, isOnboarding: boolean = false) => {
  // context
  const api = useContextApi();
  const { updateUsersPassword } = useAuthentication();
  // mutations
  const { mutateAsync: updateProfile, mutationResult: updateResult } = useCustomMutation(
    async (data: UpdateManagerData) => {
      if (data.password) {
        await updateUsersPassword(data.password, data.currentPassword);
      }
      return api.manager().updateProfile(managerId!, data.changes);
    },
    'updateManagerProfile',
    !isOnboarding
  );
  const { mutateAsync: updateLastBusinessId } = useCustomMutation(
    async (businessId: string | null) => {
      return api.manager().updateProfile(managerId!, { lastBusinessId: businessId });
    },
    'updateLastBusinessId',
    false
  );
  // return
  return { updateProfile, updateResult, updateLastBusinessId };
};
