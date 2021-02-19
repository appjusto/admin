import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { ObserveOrdersOptions } from './OrderApi';

export const useOrders = (
  options: ObserveOrdersOptions = { active: true, inactive: false },
  businessId: string
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    return api.order().observeOrders(options, businessId, setOrders);
  }, [options, businessId, api]); //attention to 'options' to avoid infinite renders
  // return
  return orders;
};
