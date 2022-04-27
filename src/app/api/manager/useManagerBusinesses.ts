import { Business, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const useManagerBusinesses = (managerEmail?: string) => {
  // contex
  const api = useContextApi();
  const { adminRole } = useContextFirebaseUser();
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!managerEmail || adminRole !== 'manager') return;
    const unsub = api.manager().observeManagerBusinesses(managerEmail, setBusinesses);
    return () => unsub();
  }, [api, managerEmail, adminRole]);
  // return
  return businesses;
};
