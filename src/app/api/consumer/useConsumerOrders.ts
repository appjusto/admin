import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from 'appjusto-types';
import React from 'react';

export const useConsumerOrders = (consumerId?: string | null, isActive?: boolean) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!isActive) return;
    if (consumerId === undefined) return; // during initialization
    const getOrders = async () => {
      const data = await api.order().fetchOrdersByConsumerId(consumerId!);
      return setOrders(data);
    };
    getOrders();
  }, [api, consumerId, isActive]);

  // return
  return orders;
};
