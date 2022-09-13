import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveBOActiveOrders = (
  statuses: OrderStatus[],
  isNoStaff?: boolean
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [queryLimit, setQueryLimit] = React.useState(15);
  // handlers
  const fetchNextOrders = React.useCallback(() => {
    setQueryLimit((prev) => {
      if (orders.length < prev) return prev;
      else return prev + 10;
    });
  }, [orders]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    const unsub = api
      .order()
      .observeBOActiveOrders(statuses, setOrders, queryLimit, isNoStaff);
    return () => unsub();
  }, [api, userCanRead, statuses, isNoStaff, queryLimit]);
  // return
  return { orders, fetchNextOrders };
};
