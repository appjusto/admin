import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { Ordering } from './OrderApi';

export const useObserveCanceledOrdersInTheLastHour = (
  businessId?: string,
  ordering?: Ordering
) => {
  // context
  const api = useContextApi();
  // state
  const [canceledOrders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [queryLimit, setQueryLimit] = React.useState(10);
  // handlers
  const fetchNextCanceledOrders = React.useCallback(() => {
    setQueryLimit((prev) => {
      if (canceledOrders.length < prev) return prev;
      else return prev + 10;
    });
  }, [canceledOrders]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api
      .order()
      .observeCanceledOrdersInTheLastHour(
        setOrders,
        queryLimit,
        businessId,
        ordering
      );
    return () => unsub();
  }, [api, businessId, queryLimit, ordering]);
  // return
  return { canceledOrders, fetchNextCanceledOrders };
};
