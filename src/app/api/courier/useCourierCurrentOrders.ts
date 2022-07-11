import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

const activeOrderStatuses = ['charged', 'confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

export const useCourierCurrentOrders = (courierId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!courierId) return; // during initialization
    const unsub = api.order().observeOrdersByCourierId(courierId!, setOrders, activeOrderStatuses);
    return () => unsub();
  }, [api, courierId]);
  // return
  return orders;
};
