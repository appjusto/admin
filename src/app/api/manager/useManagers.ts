import { useContextApi } from 'app/state/api/context';
import { Business, ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';
import { BusinessManager, UserWithRole } from './types';

export const useManagers = (business?: WithId<Business> | null) => {
  // contex
  const api = useContextApi();
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
  // pendency: allow observe other managers!
  console.log('business?.managers', business?.managers);
  console.log('observed managers', managers);
  // return
  return managersWithRole;
};
