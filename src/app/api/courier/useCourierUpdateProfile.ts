import { useContextApi } from 'app/state/api/context';
import { useContextCourierProfile } from 'app/state/courier/context';
import { CourierProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useCourierUpdateProfile = () => {
  // context
  const api = useContextApi();
  const { courier } = useContextCourierProfile();
  // mutations
  const [
    updateProfile,
    updateResult,
  ] = useMutation(
    async (data: {
      changes: Partial<CourierProfile>;
      selfieFileToSave: File | null;
      documentFileToSave: File | null;
    }) =>
      api
        .courier()
        .updateProfile(courier?.id!, data.changes, data.selfieFileToSave, data.documentFileToSave)
  );
  // return
  return { updateProfile, updateResult };
};
