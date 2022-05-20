import { ManagerProfile, StaffProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useAuthentication } from '../auth/useAuthentication';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface UpdateStaffData {
  changes: Partial<ManagerProfile>;
  password?: string;
  currentPassword?: string;
}

export const useUpdateStaffProfile = (
  staff?: WithId<StaffProfile> | null,
  dispatching: boolean = true
) => {
  // context
  const api = useContextApi();
  const { updateUsersPassword } = useAuthentication();
  // mutations
  const { mutateAsync: updateProfile, mutationResult: updateResult } = useCustomMutation(
    async (data: UpdateStaffData) => {
      if (!staff) return;
      if (data.password) {
        await updateUsersPassword(data.password, data.currentPassword);
      }
      return api.staff().updateProfile(staff?.id!, data.changes);
    },
    'updateStaffProfile',
    dispatching
  );
  // return
  return { updateProfile, updateResult };
};
