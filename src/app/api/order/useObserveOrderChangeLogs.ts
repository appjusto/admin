import { OrderLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';

export const useObserveOrderChangeLogs = (orderId: string | undefined) => {
  // context
  const api = useContextApi();
  // state
  const [changeLogs, setChangeLogs] = React.useState<WithId<OrderLog>[]>();
  const [logs, setLogs] = React.useState<WithId<OrderLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    // change to deploy date
    try {
      const timeLimit = dayjs('2022-05-24').startOf('day').toDate();
      const unsub = api.order().observeOrderDeprecatedLogs(orderId, timeLimit, setChangeLogs);
      return () => unsub();
    } catch (error) {
      console.error('Unabled to fetch order logs', error);
    }
  }, [api, orderId]);
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderLogs(orderId, 'change', setLogs);
    return () => unsub();
  }, [api, orderId]);
  // return
  if (changeLogs && changeLogs.length > 0) return changeLogs;
  return logs;
};
