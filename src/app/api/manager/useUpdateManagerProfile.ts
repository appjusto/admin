import { useContextApi } from 'app/state/api/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { ManagerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

interface UpdateManagerData {
  changes: Partial<ManagerProfile>;
  password?: string;
}

export const useUpdateManagerProfile = () => {
  // context
  const api = useContextApi();
  const { manager } = useContextManagerProfile();
  // mutations
  const [updateProfile, updateResult] = useMutation(async (data: UpdateManagerData) => {
    if (data.password) await api.auth().updateUsersPassword(data.password);
    return api.manager().updateProfile(manager?.id!, data.changes);
  });
  // return
  return { updateProfile, updateResult };
};
