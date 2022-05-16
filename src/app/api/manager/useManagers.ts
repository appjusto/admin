import { NewUserData } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useManagers = () => {
  // contex
  const api = useContextApi();
  const { business } = useContextBusiness();
  // mutations
  const { mutateAsync: createManager, mutationResult: createManagerResult } = useCustomMutation(
    async (managers: NewUserData[]) => {
      const dataWithKey = { key: business?.id!, managers };
      return api.manager().createManager(dataWithKey);
    },
    'createManager'
  );
  const { mutateAsync: removeBusinessManager, mutationResult: removeResult } = useCustomMutation(
    async (managerEmail: string) => api.business().removeBusinessManager(business!, managerEmail),
    'removeBusinessManager',
    false
  );
  // return
  return {
    createManager,
    createManagerResult,
    removeBusinessManager,
    removeResult,
  };
};
