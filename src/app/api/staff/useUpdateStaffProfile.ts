import { ManagerProfile } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { useAuthentication } from '../auth/useAuthentication';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface UpdateStaffData {
  changes: Partial<ManagerProfile>;
  password?: string;
  currentPassword?: string;
}

export const useUpdateStaffProfile = () => {
  // context
  const api = useContextApi();
  const { updateUsersPassword } = useAuthentication();
  const { staff } = useContextStaffProfile();
  // mutations
  const { mutateAsync: updateProfile, mutationResult: updateResult } = useCustomMutation(
    async (data: UpdateStaffData) => {
      if (data.password) {
        await updateUsersPassword(data.password, data.currentPassword);
      }
      return api.staff().updateProfile(staff?.id!, data.changes);
    },
    'updateStaffProfile'
  );
  // return
  return { updateProfile, updateResult };
};
