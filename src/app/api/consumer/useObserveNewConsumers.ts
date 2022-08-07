import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';

export const useObserveNewConsumers = () => {
  // context
  const api = useContextApi();
  // state
  const [consumers, setConsumers] = React.useState<number>();
  const [date, setDate] = React.useState(new Date());
  // side effects
  React.useEffect(() => {
    // const unsub = api.consumer().observeNewConsumers((consumers) => {
    //   setConsumers(consumers.length);
    // }, dayjs(date).startOf('day').toDate());
    // return () => unsub();
    setConsumers(0);
  }, [date, api]);
  // update date reference
  React.useEffect(() => {
    const diff = dayjs(date).add(1, 'day').diff(date);
    const interval = setTimeout(() => setDate(new Date()), diff);
    return () => clearInterval(interval);
  }, [date]);
  // return
  return consumers;
};
