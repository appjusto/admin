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
    return api.business().observeBusinesses(situations, setBusinesses);
  }, [situations, api]);
  // return
  return businesses;
};
