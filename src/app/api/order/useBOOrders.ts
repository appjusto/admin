import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { ObserveOrdersOptions } from './OrderApi';

export const useBOOrders = (options: ObserveOrdersOptions = { active: true, inactive: false }) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    return api.order().observeBOOrders(options, setOrders);
  }, [options, api]); //attention to 'options' to avoid infinite renders
  // return
  return orders;
};
