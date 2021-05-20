import { useContextApi } from 'app/state/api/context';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { ConsumerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useConsumerUpdateProfile = () => {
  // context
  const api = useContextApi();
  const { consumer } = useContextConsumerProfile();
  // mutations
  const [updateProfile, updateResult] = useMutation(async (changes: Partial<ConsumerProfile>) =>
    api.consumer().updateProfile(consumer?.id!, changes)
  );
  // return
  return { updateProfile, updateResult };
};
