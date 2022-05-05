import { Business, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { ManagerWithPermissions } from './types';

export const useGetManagers = (business?: WithId<Business> | null, isActive?: boolean) => {
  // contex
  const api = useContextApi();
  const { userAbility } = useContextFirebaseUser();
  // state
  const [managers, setManagers] = React.useState<ManagerWithPermissions[]>();
  // helpers
  const userCanRead = userAbility?.can('read', 'managers');
  // side effects
  React.useEffect(() => {
    if (!isActive) return;
    if (!userCanRead) return;
    if (!business?.id || !business?.managers) return;
    api.manager().getBusinessManagers(business.id, setManagers);
  }, [api, isActive, business?.id, business?.managers, userCanRead]);
  // return
  return { managers };
};
