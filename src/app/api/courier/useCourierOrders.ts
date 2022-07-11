import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';

export const useCourierOrders = (courierId?: string | null, start?: string, end?: string) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  React.useEffect(() => {
    if (!courierId || !start || !end) return; // during initialization
    let startDate = dayjs(start).startOf('day').toDate();
    let endDate = dayjs(end).endOf('day').toDate();
    const unsub = api.order().observeOrdersByCourierId(courierId!, setOrders, undefined, startDate, endDate);
    return () => unsub();
  }, [api, courierId, start, end]);
  // return
  return orders;
};
