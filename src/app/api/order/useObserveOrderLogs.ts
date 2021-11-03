import { useContextApi } from 'app/state/api/context';
import { WithId } from 'appjusto-types';
import React from 'react';
import { OrderLog } from './OrderApi';

export const useObserveOrderLogs = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [logs, setLogs] = React.useState<WithId<OrderLog>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderLogs(orderId, setLogs);
    return () => unsub();
  }, [api, orderId]);
  // return
  return logs;
};
