import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';

export const useConsumerOrders = (consumerId: string | undefined | null) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (consumerId === undefined) return; // during initialization
    const getOrders = async () => {
      const data = await api.order().fetchOrdersByConsumerId(consumerId!);
      return setOrders(data);
    };
    getOrders();
  }, [api, consumerId]);

  // return
  return orders;
};
