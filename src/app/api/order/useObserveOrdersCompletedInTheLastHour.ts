import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Ordering } from './OrderApi';

export const useObserveOrdersCompletedInTheLastHour = (
  businessId?: string,
  ordering: Ordering = 'asc'
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    const unsub = api
      .order()
      .observeBusinessOrdersCompletedInTheLastHour(setOrders, businessId, ordering);
    return () => unsub();
  }, [api, businessId, ordering]);
  console.log(orders);
  // return
  return orders;
};
