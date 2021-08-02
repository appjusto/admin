import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { ManagerWithRole } from './types';
import { useMutation } from 'react-query';
import { AdminRole, Role } from 'appjusto-types';
import { GeneralRoles } from 'app/state/auth/context';

type ManagerData = { email: string; role: Role | AdminRole };

export const useManagers = (role?: GeneralRoles | null) => {
  // contex
  const api = useContextApi();
  const { business } = useContextBusiness();

  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>();

  // mutations
  const [createManager, createResult] = useMutation(async (data: ManagerData) => {
    const dataWithKey = { ...data, key: business?.id! };
    return api.manager().createManager(dataWithKey);
  });

  const [removeBusinessManager, removeResult] = useMutation(async (managerEmail: string) =>
    api.business().removeBusinessManager(business!, managerEmail)
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
