import { OrderStatus } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const statuses = [
  'scheduled',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
  'delivered',
] as OrderStatus[];

export const useBusinessTotalOrdersByConsumer = (
  businessId?: string,
  consumerId?: string
) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [ordersTotal, setOrdersTotal] = React.useState<number | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!consumerId) return;
    (async () => {
      const total = await api
        .order()
        .fetchBusinessTotalOrdersByConsumer(businessId, consumerId, statuses);
      setOrdersTotal(total);
    })();
  }, [api, userCanRead, businessId, consumerId]);
  // return
  return ordersTotal;
};
