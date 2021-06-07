import { useContextApi } from 'app/state/api/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { GeneralRoles } from '../auth/useFirebaseUserRole';
import { ManagerWithRole } from './types';

export const useManagers = (business?: WithId<Business> | null, userRole?: GeneralRoles | null) => {
  // contex
  const api = useContextApi();
  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>();
  // side effects
  React.useEffect(() => {
    if (!userRole || !['manager', 'owner', 'staff', 'viewer'].includes(userRole)) return;
    if (!business?.id || !business?.managers) return;
    console.log('CALLABLE');
    api.manager().getBusinessManagers(business.id, setManagers);
  }, [api, business?.managers, userRole]);
  // return
  return managers;
};
