import { NewUserData } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useManagers = (businessId?: string) => {
  // contex
  const api = useContextApi();
  // mutations
  const { mutate: createManager, mutationResult: createManagerResult } =
    useCustomMutation(async (managers: NewUserData[]) => {
      const dataWithKey = { key: businessId!, managers };
      return await api.manager().createManager(dataWithKey);
    }, 'createManager');
  const {
    mutate: updateBusinessManager,
    mutationResult: updateManagersResult,
  } = useCustomMutation(
    (managers: string[]) =>
      api.business().updateBusinessManager(businessId!, managers),
    'updateBusinessManager',
    false
  );
  // return
  return {
    createManager,
    createManagerResult,
    updateBusinessManager,
    updateManagersResult,
  };
};
