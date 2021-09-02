import { useContextApi } from 'app/state/api/context';
import React from 'react';
import dayjs from 'dayjs';

export const useObserveNewConsumers = () => {
  // context
  const api = useContextApi();
  // state
  const [consumers, setConsumers] = React.useState<number>();
  const [date, setDate] = React.useState(new Date());
  // side effects
  React.useEffect(() => {
    const unsub = api.consumer().observeNewConsumers((consumers) => {
      setConsumers(consumers.length);
    }, dayjs(date).startOf('day').toDate());
    return () => unsub();
  }, [api]);
  // update date reference
  React.useEffect(() => {
    const diff = dayjs(date).add(1, 'day').diff(date);
    const interval = setTimeout(() => setDate(new Date()), diff);
    () => clearInterval(interval);
  }, [date]);
  // return
  return consumers;
};
