import { useContextApi } from 'app/state/api/context';
import { Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';

export const useBackofficeOrders = (statuses: OrderStatus[]) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    api.order().observeOrders(statuses, setOrders);
  }, [statuses, api]); //attention to 'statuses' to avoid infinite renders
  // return
  return orders;
};
