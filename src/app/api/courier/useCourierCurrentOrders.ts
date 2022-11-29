import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const activeOrderStatuses = [
  'charged',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
] as OrderStatus[];

export const useCourierCurrentOrders = (courierId?: string | null) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return; // during initialization
    if (!courierId) return; // during initialization
    const unsub = api
      .order()
      .observeOrdersByCourierId(courierId!, setOrders, activeOrderStatuses);
    return () => unsub();
  }, [api, userCanRead, courierId]);
  // return
  return orders;
};
