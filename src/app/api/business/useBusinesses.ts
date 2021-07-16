import { useContextApi } from 'app/state/api/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';

export const useBusinesses = (situations: string[]) => {
  // context
  const api = useContextApi();
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);
  // side effects
  React.useEffect(() => {
    const unsub = api.business().observeBusinesses(situations, setBusinesses);
    return () => unsub();
  }, [situations, api]);
  // return
  return businesses;
};
