import { BusinessStatus } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBusinessesByStatus = (status: BusinessStatus) => {
  // context
  const api = useContextApi();
  // state
  const [businesses, setBusinesses] = React.useState<number>();
  // side effects
  React.useEffect(() => {
    // const unsub = api.business().observeBusinessesByStatus(status, (businesses) => {
    //   setBusinesses(businesses.length);
    // });
    // return () => unsub();
    setBusinesses(0);
  }, [api, status]);
  // return
  return businesses;
};
