import { NewManagerData } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';
import { ManagerWithRole } from './types';

export const useManagers = () => {
  // contex
  const api = useContextApi();
  const { adminRole, isBackofficeUser } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>();
  // mutations
  const { mutateAsync: createManager, mutationResult: createResult } = useCustomMutation(
    async (managers: NewManagerData[]) => {
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
  // side effects
  React.useEffect(() => {
    if (!adminRole && !isBackofficeUser) return;
    if (!business?.id || !business?.managers) return;
    api.manager().getBusinessManagers(business.id, setManagers);
  }, [api, business?.id, business?.managers, adminRole, isBackofficeUser]);
  // return
  return {
    managers,
    createManager,
    createResult,
    removeBusinessManager,
    removeResult,
  };
};
