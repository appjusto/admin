import { useContextApi } from 'app/state/api/context';
import { CourierProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useCourierUpdateProfile = (courierId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const [updateProfile, updateResult] = useMutation(
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
    }
  );
  // return
  return { updateProfile, updateResult };
};
