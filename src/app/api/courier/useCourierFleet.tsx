import { useContextApi } from 'app/state/api/context';
import { Fleet } from 'appjusto-types';
import React from 'react';

export const useCourierFleet = (fleetId: string | undefined | null) => {
  // context
  const api = useContextApi();
  // state
  const [fleet, setFleet] = React.useState<Fleet | undefined | null>();
  // side effects
  // side effects
  React.useEffect(() => {
    if (fleetId === undefined) return; // during initialization
    if (fleetId === null) {
      // no business
      setFleet(null);
      return;
    }
    (async () => {
      const data = await api.courier().getCourierFleet(fleetId);
      setFleet(data);
    })();
  }, [api, fleetId]);

  // return
  return fleet;
};
