import { useContextApi } from 'app/state/api/context';
import { GeneralRoles } from 'app/state/auth/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';

export const useManagerBusinesses = (managerEmail?: string, role?: GeneralRoles | null) => {
  // contex
  const api = useContextApi();
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!managerEmail || !role) return;
    if (role !== 'manager') return;
    const unsub = api.manager().observeManagerBusinesses(managerEmail, setBusinesses);
    return () => unsub();
  }, [api, managerEmail, role]);
  // return
  return businesses;
};
