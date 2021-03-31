import { useContextApi } from 'app/state/api/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { ObserveBusinessesOptions } from './BusinessApi';

export const useBusinesses = (
  options: ObserveBusinessesOptions = { active: false, inactive: true }
) => {
  // context
  const api = useContextApi();
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);
  // side effects
  React.useEffect(() => {
    return api.business().observeBusinesses(options, setBusinesses);
  }, [options, api]); //attention to 'options' to avoid infinite renders
  // return
  return businesses;
};
