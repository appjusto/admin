import { CourierProfile } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useCourierUpdateProfile = (courierId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: updateProfile, mutationResult: updateResult } = useCustomMutation(
    async (data: {
      changes: Partial<CourierProfile>;
      selfieFileToSave: File | null;
      documentFileToSave: File | null;
    }) => {
      await api
        .courier()
        .updateProfile(courierId!, data.changes, data.selfieFileToSave, data.documentFileToSave);
      if (data.changes.email)
        await api.auth().updateEmail({ accountId: courierId!, email: data.changes.email });
    },
    'updateCourierProfile'
  );
  // return
  return { updateProfile, updateResult };
};
