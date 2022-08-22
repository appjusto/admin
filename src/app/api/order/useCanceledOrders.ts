import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useCanceledOrders = (businessId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    const unsub = api
      .order()
      .observeBusinessCanceledOrders(setOrders, businessId);
    return () => unsub();
  }, [api, userCanRead, businessId]); //attention to 'options' to avoid infinite renders
  // return
  return orders;
};
