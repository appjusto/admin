import { NewUserData, ProfileSituation } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useStaff = () => {
  // contex
  const api = useContextApi();
  // mutations
  const { mutate: createStaff, mutationResult: createResult } = useCustomMutation(
    (staff: NewUserData) => api.staff().createStaff(staff),
    'createStaff'
  );
  const { mutate: updateStaffSituation, mutationResult: updateSituationResult } =
    useCustomMutation(
      (data: { staffId: string; situation: ProfileSituation }) => {
        const { staffId, situation } = data;
        return api.staff().updateProfile(staffId, { situation });
      }, 
      'updateStaffSituation'
    );
  const { mutateAsync: getStaff, mutationResult: getStaffResult } = useCustomMutation(
    async (staffId: string) => api.staff().getStaff(staffId),
    'getStaff',
    false,
    true
  );
  const { mutate: getNotificationToken, mutationResult: getNotificationTokenResult } =
    useCustomMutation(
      (staffId: string) => api.staff().getNotificationToken(staffId),
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
