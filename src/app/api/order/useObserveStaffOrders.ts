import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { Ordering } from './OrderApi';

export const useObserveStaffOrders = (
  statuses: OrderStatus[],
  staffId?: string,
  ordering?: Ordering
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if(!staffId) return;
    const unsub = api.order().observeStaffOrders(statuses, setOrders, staffId, ordering);
    return () => unsub();
  }, [api, statuses, staffId, ordering]);
  // return
  return orders;
};
