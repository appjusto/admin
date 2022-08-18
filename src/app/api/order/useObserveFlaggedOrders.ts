import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveFlaggedOrders = (
  flags: string[],
  isNoStaff?: boolean,
  status?: OrderStatus
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [queryLimit, setQueryLimit] = React.useState(10);
  // handlers
  const fetchNextOrders = React.useCallback(() => {
    setQueryLimit((prev) => {
      if (orders.length < prev) return prev;
      else return prev + 10;
    });
  }, [orders]);
  // side effects
  React.useEffect(() => {
    const unsub = api
      .order()
      .observeFlaggedOrders(flags, status, setOrders, queryLimit, isNoStaff);
    return () => unsub();
  }, [api, status, flags, isNoStaff, queryLimit]);
  // return
  return { orders, fetchNextOrders };
};
