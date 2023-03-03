import { Fleet, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveFleet = (fleetId: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [fleet, setFleet] = React.useState<WithId<Fleet> | null>();
  // side effects
  React.useEffect(() => {
    if (!fleetId) {
      setFleet(null);
      return;
    }
    const unsub = api.fleet().observeFleet(fleetId, setFleet);
    return () => unsub();
  }, [api, fleetId]);
  // return
  return fleet;
};
