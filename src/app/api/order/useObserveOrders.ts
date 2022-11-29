import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { Ordering } from './OrderApi';

export const useObserveOrders = (
  statuses: OrderStatus[],
  businessId?: string,
  ordering?: Ordering,
  queryLimit?: number
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    const unsub = api
      .order()
      .observeOrders(statuses, setOrders, businessId, ordering, queryLimit);
    return () => unsub();
  }, [api, userCanRead, statuses, businessId, ordering, queryLimit]);
  // return
  return orders;
};
