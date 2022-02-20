import { useContextApi } from 'app/state/api/context';
import { OrderIssue, WithId } from '@appjusto/types';
import React from 'react';

export const useObserveOrderIssues = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [orderIssues, setOrderIssues] = React.useState<WithId<OrderIssue>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderIssues(orderId, setOrderIssues);
    return () => unsub();
  }, [api, orderId]);
  // return
  return orderIssues;
};
