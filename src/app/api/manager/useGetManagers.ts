import { ManagerWithRole } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const useGetManagers = (
  businessId?: string,
  managersList?: string[],
  isActive?: boolean
) => {
  // contex
  const api = useContextApi();
  const { userAbility } = useContextFirebaseUser();
  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>();
  // helpers
  const userCanRead = userAbility?.can('read', 'managers');
  // handlers
  const fetchManagers = React.useCallback(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    api.manager().getBusinessManagers(businessId, setManagers);
  }, [api, userCanRead, businessId]);
  // side effects
  React.useEffect(() => {
    if (!isActive) return;
    fetchManagers();
  }, [isActive, businessId, managersList, fetchManagers]);
  // return
  return { managers, fetchManagers };
};
