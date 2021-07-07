import { useContextApi } from 'app/state/api/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { ManagerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';
import { useAuthentication } from '../auth/useAuthentication';

interface UpdateManagerData {
  changes: Partial<ManagerProfile>;
  password?: string;
  currentPassword?: string;
}

export const useUpdateManagerProfile = () => {
  // context
  const api = useContextApi();
  const { updateUsersPassword } = useAuthentication();
  const { manager } = useContextManagerProfile();
  // mutations
  const [updateProfile, updateResult] = useMutation(async (data: UpdateManagerData) => {
    if (data.password) {
      await updateUsersPassword(data.password, data.currentPassword);
    }
    return api.manager().updateProfile(manager?.id!, data.changes);
  });
  // return
  return { updateProfile, updateResult };
};
