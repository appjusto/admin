import { PlatformAccess } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useUpdatePlatform = () => {
  // contex
  const api = useContextApi();
  // mutations
  const {
    mutate: updatePlatformAccess,
    mutationResult: updatePlatformAccessResult,
  } = useCustomMutation(
    (changes: Partial<PlatformAccess>) =>
      api.platform().updatePlatformAccess(changes),
    'updatePlatformAccess'
  );
  // result
  return { updatePlatformAccess, updatePlatformAccessResult };
};
