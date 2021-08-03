import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveNewConsumers = () => {
  // context
  const api = useContextApi();
  // state
  const [consumers, setConsumers] = React.useState<number>();
  // side effects
  React.useEffect(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const unsub = api.consumer().observeNewConsumers((consumers) => {
      setConsumers(consumers.length);
    }, startDate);
    return () => unsub();
  }, [api]);
  // return
  return consumers;
};
