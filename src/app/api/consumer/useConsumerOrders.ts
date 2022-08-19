import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useConsumerOrders = (
  consumerId?: string | null,
  isActive?: boolean
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!isActive) return;
    if (consumerId === undefined) return; // during initialization
    const getOrders = async () => {
      const data = await api.order().fetchOrdersByConsumerId(consumerId!);
      return setOrders(data);
    };
    getOrders();
  }, [api, userCanRead, consumerId, isActive]);

  // return
  return orders;
};
