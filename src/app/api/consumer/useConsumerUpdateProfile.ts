import { useContextApi } from 'app/state/api/context';
import { ConsumerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useConsumerUpdateProfile = (consumerId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const [updateProfile, updateResult] = useMutation(
    async (data: {
      changes: Partial<ConsumerProfile>;
      selfieFileToSave: File | null;
      documentFileToSave: File | null;
    }) => {
      await api
        .consumer()
        .updateProfile(consumerId!, data.changes, data.selfieFileToSave, data.documentFileToSave);
      if (data.changes.email)
        await api.auth().updateEmail({ accountId: consumerId!, email: data.changes.email });
    }
  );
  // return
  return { updateProfile, updateResult };
};
