import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveNewConsumers = () => {
  // context
  const api = useContextApi();
  // state
  const [consumers, setConsumers] = React.useState<number>();
  // side effects
  React.useEffect(() => {
    let today = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let startDate = new Date(`${year}-${month}-${today} 00:00:00`);
    const unsub = api.consumer().observeNewConsumers((consumers) => {
      setConsumers(consumers.length);
    }, startDate);
    return () => unsub();
  }, [api]);
  // return
  return consumers;
};
