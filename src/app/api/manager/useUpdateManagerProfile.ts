import { useContextApi } from 'app/state/api/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { ManagerProfile } from 'appjusto-types';
import { useAuthentication } from '../auth/useAuthentication';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface UpdateManagerData {
  changes: Partial<ManagerProfile>;
  password?: string;
  currentPassword?: string;
}

export const useUpdateManagerProfile = (isOnboarding: boolean = false) => {
  // context
  const api = useContextApi();
  const { updateUsersPassword } = useAuthentication();
  const { manager } = useContextManagerProfile();
  // mutations
  const { mutateAsync: updateProfile, mutationResult: updateResult } = useCustomMutation(
    async (data: UpdateManagerData) => {
      if (data.password) {
        await updateUsersPassword(data.password, data.currentPassword);
      }
      return api.manager().updateProfile(manager?.id!, data.changes);
    },
    'updateManagerProfile',
    !isOnboarding
  );
  // return
  return { updateProfile, updateResult };
};
