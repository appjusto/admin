import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useFetchOrderByCode = (orderCode: string, businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>(null);
  // handlers
  const fetchOrdersByCode = React.useCallback(async () => {
    const result = await api.order().fetchOrderByCode(orderCode, businessId);
    if (result) setOrders(result);
    else setOrders([]);
  }, [api, orderCode, businessId]);
  // side effects
  React.useEffect(() => {
    if (orderCode.length === 0) setOrders(null);
  }, [orderCode]);
  // return
  return { orders, fetchOrdersByCode };
};
