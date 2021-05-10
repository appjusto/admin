import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { ObserveOrdersOptions } from './OrderApi';

export const useBackofficeOrders = (options: ObserveOrdersOptions) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    api.order().observeOrders(options, setOrders);
  }, [options, api]); //attention to 'options' to avoid infinite renders
  // return
  return orders;
};
