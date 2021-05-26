import { useContextApi } from 'app/state/api/context';
import { useContextCourierProfile } from 'app/state/courier/context';
import { CourierProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useCourierUpdateProfile = () => {
  // context
  const api = useContextApi();
  const { courier } = useContextCourierProfile();
  // mutations
  const [updateProfile, updateResult] = useMutation(async (changes: Partial<CourierProfile>) =>
    api.courier().updateProfile(courier?.id!, changes)
  );
  // return
  return { updateProfile, updateResult };
};
