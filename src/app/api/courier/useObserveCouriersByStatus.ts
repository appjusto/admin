import { CourierStatus } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveCouriersByStatus = (statuses: CourierStatus[]) => {
  // context
  const api = useContextApi();
  // state
  const [couriers, setCouriers] = React.useState<number>();
  // side effects
  React.useEffect(() => {
    // const unsub = api.courier().observeCouriersByStatus(statuses, (couriers) => {
    //   setCouriers(couriers.length);
    // });
    // return () => unsub();
    setCouriers(0);
  }, [api, statuses]);
  // return
  return couriers;
};
