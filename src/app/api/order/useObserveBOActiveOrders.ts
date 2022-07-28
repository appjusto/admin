import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBOActiveOrders = (
  statuses: OrderStatus[], isNoStaff?: boolean
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [queryLimit, setQueryLimit] = React.useState(10);
  // handlers
  const fetchNextOrders = React.useCallback(() => {
    console.log("fetchNextOrders", queryLimit);
    setQueryLimit(prev => {
      if(orders.length < prev) return prev;
      else return prev + 10;
    });
  }, [orders, queryLimit]);
  // side effects
  React.useEffect(() => {
    const unsub = api.order().observeBOActiveOrders(
      statuses,
      setOrders,
      queryLimit,
      isNoStaff
    );
    return () => unsub();
  }, [api, statuses, isNoStaff, queryLimit]);
  // return
  return { orders, fetchNextOrders };
};