import { Fleet } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useGetFleetById = (fleetId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [fleet, setFleet] = React.useState<Fleet | null>();
  // side effects
  React.useEffect(() => {
    if (fleetId === undefined) return; // during initialization
    if (fleetId === null) {
      // no business
      setFleet(null);
      return;
    }
    (async () => {
      const data = await api.fleet().getFleetById(fleetId);
      setFleet(data);
    })();
  }, [api, fleetId]);
  // return
  return fleet;
};
