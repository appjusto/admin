import { useContextApi } from 'app/state/api/context';
import { Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';

export const useOrders = (statuses: OrderStatus[], businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    api.order().observeOrders(statuses, setOrders, businessId);
  }, [statuses, businessId, api]); //attention to 'options' to avoid infinite renders
  // return
  return orders;
};
