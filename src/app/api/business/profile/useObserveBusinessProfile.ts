import { useContextApi } from 'app/state/api/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';

export const useObserveBusinessProfile = (businessId: string | undefined | null) => {
  // contex
  const api = useContextApi();
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
    const unsub = api.business().observeBusinessProfile(businessId, setBusiness);
    return () => unsub();
  }, [api, businessId]);
  // return
  return business;
};
