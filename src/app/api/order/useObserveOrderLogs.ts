import { OrderLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { OrderLogType } from './OrderApi';

export const useObserveOrderLogs = (
  orderId: string | undefined,
  type: OrderLogType
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [logs, setLogs] = React.useState<WithId<OrderLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId || !type) return;
    const unsub = api.order().observeOrderLogs(orderId, type, setLogs);
    return () => unsub();
  }, [api, userCanRead, orderId, type]);
  // return
  return logs;
};
