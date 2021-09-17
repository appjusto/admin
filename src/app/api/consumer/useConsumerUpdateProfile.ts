import { useContextApi } from 'app/state/api/context';
import { ConsumerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useConsumerUpdateProfile = (consumerId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const [updateProfile, updateResult] = useMutation(async (changes: Partial<ConsumerProfile>) => {
    await api.consumer().updateProfile(consumerId!, changes);
    if (changes.email)
      await api.auth().updateEmail({
        accountId: consumerId!,
        email: changes.email,
      });
  });
  // return
  return { updateProfile, updateResult };
};
