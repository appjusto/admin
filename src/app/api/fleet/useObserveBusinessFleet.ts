import { Fleet, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBusinessFleet = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [fleet, setFleet] = React.useState<WithId<Fleet> | null>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.fleet().observeBusinessFleet(businessId, (fleets) => {
      if (!fleets) setFleet(null);
      else setFleet(fleets[0]);
    });
    return () => unsub();
  }, [api, businessId]);
  // return
  return fleet;
};
