import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { Ordering } from './OrderApi';

export const useObserveStaffOrders = (
  statuses: OrderStatus[],
  staffId?: string,
  ordering: Ordering = 'asc'
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!staffId) return;
    const unsub = api
      .order()
      .observeStaffOrders(statuses, setOrders, staffId, ordering);
    return () => unsub();
  }, [api, userCanRead, statuses, staffId, ordering]);
  // return
  return orders;
};
