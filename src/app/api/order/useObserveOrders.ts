import { useContextApi } from 'app/state/api/context';
import { Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { Ordering } from './OrderApi';

export const useObserveOrders = (
  statuses: OrderStatus[],
  businessId?: string,
  ordering?: Ordering
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.order().observeOrders(statuses, setOrders, businessId, ordering);
    return () => unsub();
  }, [api, statuses, businessId, ordering]);
  // return
  return orders;
};
