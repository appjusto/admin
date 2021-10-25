import { useContextApi } from 'app/state/api/context';
import { PlatformStatistics } from 'appjusto-types';
import React from 'react';

export const usePlatformStatistics = () => {
  // context
  const api = useContextApi();
  // state
  const [statistics, setStatistics] = React.useState<PlatformStatistics>();
  // side effects
  React.useEffect(() => {
    const unsub = api.platform().observeStatistics(setStatistics);
    return () => unsub();
  }, [api]);
  // result
  return statistics;
};
