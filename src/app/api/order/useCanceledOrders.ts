import { useContextApi } from 'app/state/api/context';
import { Order, WithId } from '@appjusto/types';
import React from 'react';

export const useCanceledOrders = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.order().observeBusinessCanceledOrders(setOrders, businessId);
    return () => unsub();
  }, [businessId, api]); //attention to 'options' to avoid infinite renders
  // return
  return orders;
};
