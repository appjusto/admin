import { OrderLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { OrderLogType } from './OrderApi';

export const useObserveOrderLogs = (orderId: string | undefined, type: OrderLogType) => {
  // context
  const api = useContextApi();
  // state
  const [changeLogs, setChangeLogs] = React.useState<WithId<OrderLog>[]>();
  const [logs, setLogs] = React.useState<WithId<OrderLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    // change to deploy date
    const timeLimit = dayjs('05-24-2022').startOf('day').toDate();
    const unsub = api.order().observeOrderDeprecatedLogs(orderId, timeLimit, setChangeLogs);
    return () => unsub();
  }, [api, orderId]);
  React.useEffect(() => {
    if (!orderId || !type) return;
    const unsub = api.order().observeOrderLogs(orderId, type, setLogs);
    return () => unsub();
  }, [api, orderId, type]);
  // return
  if (changeLogs && changeLogs.length > 0) return changeLogs;
  return logs;
};
