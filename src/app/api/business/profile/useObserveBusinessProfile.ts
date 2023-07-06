import { Business, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBusinessProfile = (
  businessId?: string | null,
  isBackofficeUser?: boolean | null
) => {
  // contex
  const api = useContextApi();
  // state
  const [business, setBusiness] = React.useState<
    WithId<Business> | undefined | null
  >();
  // side effects
  React.useEffect(() => {
    if (!isBackofficeUser) return;
    if (businessId === undefined) return; // during initialization
    if (businessId === null) {
      // no business
      setBusiness(null);
      return;
    }
    const unsub = api
      .business()
      .observeBusinessProfile(businessId, setBusiness);
    return () => unsub();
  }, [api, businessId, isBackofficeUser]);
  // return
  return business;
};
