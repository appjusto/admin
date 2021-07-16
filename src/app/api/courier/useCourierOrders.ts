import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';

export const useCourierOrders = (courierId?: string | null, start?: string, end?: string) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  React.useEffect(() => {
    if (!courierId || !start || !end) return; // during initialization
    let startDate = new Date(start);
    let endDate = new Date(`${end} 23:59:59`);
    const unsub = api.order().observeOrdersByCourierId(courierId!, setOrders, startDate, endDate);
    return () => unsub();
  }, [api, courierId, start, end]);

  // return
  return orders;
};
