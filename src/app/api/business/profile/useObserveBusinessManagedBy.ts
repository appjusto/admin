import { Business, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBusinessManagedBy = (email?: string | null) => {
  // contex
  const api = useContextApi();
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[] | undefined>();
  // side effects
  React.useEffect(() => {
    if (!email) return; // during initialization
    const unsub = api.business().observeBusinessManagedBy(email, setBusinesses);
    return () => unsub();
  }, [api, email]);
  // return
  return businesses;
};
