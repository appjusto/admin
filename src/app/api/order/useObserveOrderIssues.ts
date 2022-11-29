import { OrderIssue, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderIssues = (orderId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orderIssues, setOrderIssues] = React.useState<
    WithId<OrderIssue>[] | null
  >();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    const unsub = api.order().observeOrderIssues(orderId, setOrderIssues);
    return () => unsub();
  }, [api, userCanRead, orderId]);
  // return
  return orderIssues;
};
