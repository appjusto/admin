import { OrderLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderChangeLogs = (orderId: string | undefined) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [changeLogs, setChangeLogs] = React.useState<WithId<OrderLog>[]>();
  const [logs, setLogs] = React.useState<WithId<OrderLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    // change to deploy date
    try {
      const timeLimit = dayjs('2022-05-24').startOf('day').toDate();
      const unsub = api
        .order()
        .observeOrderDeprecatedLogs(orderId, timeLimit, setChangeLogs);
      return () => unsub();
    } catch (error) {
      console.error('Unabled to fetch order logs', error);
    }
  }, [api, userCanRead, orderId]);
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    const unsub = api.order().observeOrderLogs(orderId, 'change', setLogs);
    return () => unsub();
  }, [api, userCanRead, orderId]);
  // return
  if (changeLogs && changeLogs.length > 0) return changeLogs;
  return logs;
};
