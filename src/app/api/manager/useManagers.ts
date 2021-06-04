import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';
import { BusinessManager, UserWithRole } from './types';

export const useManagers = () => {
  // contex
  const api = useContextApi();
  const { business } = useContextBusiness();
  // state
  const [managers, setManagers] = React.useState<WithId<ManagerProfile>[]>();
  const [users, setUsers] = React.useState<UserWithRole[]>();
  const [managersWithRole, setManagersWithRole] = React.useState<WithId<BusinessManager>[]>();
  // side effects
  // observe managers profile
  React.useEffect(() => {
    if (!business?.managers) return;
    api.manager().observeManagers(business.managers, setManagers);
  }, [api, business?.managers]);
  React.useEffect(() => {
    if (!business?.id || !managers) return;
    const uids = managers.map((manager) => manager.id);
    api.manager().getUsersByIds(business?.id, uids, setUsers);
  }, [managers]);
  React.useEffect(() => {
    if (!managers || !users) return;
    const result = managers.map((manager) => {
      const user = users.find((user) => user.uid === manager.id);
      return {
        ...manager,
        role: user?.role ?? null,
      };
    });
    setManagersWithRole(result);
  }, [managers, users]);
  // return
  return managersWithRole;
};
