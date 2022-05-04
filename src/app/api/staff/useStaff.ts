import { NewUserData, ProfileSituation } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useStaff = () => {
  // contex
  const api = useContextApi();
  // mutations
  const { mutateAsync: createStaff, mutationResult: createResult } = useCustomMutation(
    async (staff: NewUserData) => {
      return api.staff().createStaff(staff);
    },
    'createStaff'
  );
  const { mutateAsync: updateStaffSituation, mutationResult: updateSituationResult } =
    useCustomMutation(async (data: { staffId: string; situation: ProfileSituation }) => {
      const { staffId, situation } = data;
      return api.staff().updateProfile(staffId, { situation });
    }, 'updateStaffSituation');
  const { mutateAsync: getStaff, mutationResult: getStaffResult } = useCustomMutation(
    async (staffId: string) => api.staff().getStaff(staffId),
    'getStaff',
    false,
    true
  );
  const { mutateAsync: getNotificationToken, mutationResult: getNotificationTokenResult } =
    useCustomMutation(
      async (staffId: string) => api.staff().getNotificationToken(staffId),
      'getNotificationToken'
    );
  // return
  return {
    getStaff,
    getStaffResult,
    createStaff,
    createResult,
    updateStaffSituation,
    updateSituationResult,
    getNotificationToken,
    getNotificationTokenResult,
  };
};
