import { useApi } from 'app/state/api/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';

export const useObserveBusinessProfile = (businessId: string | undefined | null) => {
  // contex
  const api = useApi();

  // state
  const [business, setBusiness] = React.useState<WithId<Business> | undefined | null>();

  // side effects
  React.useEffect(() => {
    if (businessId === undefined) return; // during initialization
    if (businessId === null) {
      // no business
      setBusiness(null);
      return;
    }
    return api.business().observeBusinessProfile(businessId, setBusiness);
  }, [api, businessId]);

  // return
  return business;
};
