import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { ManagerWithRole } from './types';
import { NewManagerData } from 'appjusto-types';
import { GeneralRoles } from 'app/state/auth/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useManagers = (role?: GeneralRoles | null) => {
  // contex
  const api = useContextApi();
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
    if (!role || !['manager', 'owner', 'staff', 'viewer'].includes(role)) return;
    if (!business?.id || !business?.managers) return;
    api.manager().getBusinessManagers(business.id, setManagers);
  }, [api, business?.id, business?.managers, role]);

  // return
  return {
    managers,
    createManager,
    createResult,
    removeBusinessManager,
    removeResult,
  };
};
