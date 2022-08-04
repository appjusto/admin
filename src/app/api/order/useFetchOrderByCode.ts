import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useFetchOrderByCode = (
  orderCode: string, businessId?: string
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    (async () => {
      const result = await api.order().fetchOrderByCode(orderCode, businessId);
      if(result) setOrders(result);
      else setOrders([]);
    })()
  }, [api, orderCode, businessId]);
  // return
  return orders;
};