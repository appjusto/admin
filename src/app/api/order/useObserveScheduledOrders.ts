import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { Ordering } from './OrderApi';

export const useObserveScheduledOrders = (
  businessId?: string,
  ordering?: Ordering
) => {
  // context
  const api = useContextApi();
  // state
  const [scheduledOrders, setScheduledOrders] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    const unsub = api.order().observeScheduledOrders(setScheduledOrders, businessId, ordering);
    return () => unsub();
  }, [api, businessId, ordering]);
  // return
  return scheduledOrders;
};
