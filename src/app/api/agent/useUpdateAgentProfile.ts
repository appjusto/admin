import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextApi } from 'app/state/api/context';
import { ManagerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useUpdateAgentProfile = () => {
  // context
  const api = useContextApi();
  const { agent } = useContextAgentProfile();
  // mutations
  const [updateProfile, updateResult] = useMutation(async (changes: Partial<ManagerProfile>) =>
    api.manager().updateProfile(agent?.id!, changes)
  );
  // return
  return { updateProfile, updateResult };
};
