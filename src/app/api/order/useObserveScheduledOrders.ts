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
  const [scheduledOrders, setScheduledOrders] = 
    React.useState<WithId<Order>[]>([]);
  const [queryLimit, setQueryLimit] = React.useState(10);
  const [scheduledOrdersNumber, setScheduledOrdersNumber] = React.useState(0);
  // handlers
  const fetchNextScheduledOrders = React.useCallback(() => {
    setQueryLimit(prev => {
      if(scheduledOrders.length < prev) return prev;
      else return prev + 10;
    });
  }, [scheduledOrders]);
  // side effects
  React.useEffect(() => {
    if(!businessId) return;
    const unsub = api.order().observeScheduledOrders(
      setScheduledOrders, queryLimit, businessId, ordering);
    return () => unsub();
  }, [api, businessId, queryLimit, ordering]);
  React.useEffect(() => {
    if(!businessId) return;
    const unsub = api.order().observeScheduledOrdersTotal(
      setScheduledOrdersNumber, businessId);
    return () => unsub();
  }, [api, businessId]);
  // return
  return { scheduledOrders, scheduledOrdersNumber, fetchNextScheduledOrders };
};
