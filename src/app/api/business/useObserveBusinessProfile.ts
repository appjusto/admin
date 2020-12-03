import { useApi } from 'app/state/api/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';

export const useObserveBusinessProfile = (businessId: string) => {
  // contex
  const api = useApi()!;

  // state
  const [business, setBusiness] = React.useState<WithId<Business> | undefined>();

  // side effects
  React.useEffect(() => {
    return api.business().observeBusinessProfile(businessId, setBusiness);
  }, [api, businessId]);

  // return
  return business;
};
