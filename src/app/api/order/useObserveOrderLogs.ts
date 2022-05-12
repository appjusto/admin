import { OrderChange, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveOrderLogs = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [logs, setLogs] = React.useState<WithId<OrderChange>[]>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderLogs(orderId, setLogs);
    return () => unsub();
  }, [api, orderId]);
  // return
  return logs;
};
