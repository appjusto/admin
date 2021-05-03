import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';

export const useOrder = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const getOrderById = async () => {
      const data = await api.order().fetchOrderById(orderId);
      setOrder(data as WithId<Order>);
    };
    getOrderById();
  }, [orderId, api]);
  // return
  return order;
};
