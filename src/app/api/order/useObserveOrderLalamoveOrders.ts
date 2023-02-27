import { WithId } from '@appjusto/types';
import { LalamoveOrder } from '@appjusto/types/external/lalamove';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveOrderLalamoveOrders = (quotationId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [lastLalamoveOrder, setLastLalamoveOrder] =
    React.useState<WithId<LalamoveOrder>>();
  // side effects
  React.useEffect(() => {
    if (!quotationId) return;
    const unsub = api
      .order()
      .observeOrderLalamoveOrders(quotationId, (orders) => {
        setLastLalamoveOrder(orders[0]);
      });
    return () => unsub();
  }, [api, quotationId]);
  // result
  return lastLalamoveOrder;
};
