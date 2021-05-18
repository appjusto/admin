import { useContextApi } from 'app/state/api/context';
import { Order, OrderIssue, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { CancellationData } from './OrderApi';

export const useOrder = (orderId?: string) => {
  // context
  const api = useContextApi();

  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [orderIssues, setOrderIssues] = React.useState<WithId<OrderIssue>[] | null>();

  // handlers
  const [updateOrder, updateResult] = useMutation(async (changes: Partial<Order>) =>
    api.order().updateOrder(orderId!, changes)
  );

  const [cancelOrder, cancelResult] = useMutation(async (cancellationData: CancellationData) => {
    await api.order().cancelOrder(orderId!, cancellationData);
  });

  // helpers
  let result = updateResult;
  if (cancelResult.status !== 'idle') result = cancelResult;
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    api.order().observeOrder(orderId, setOrder);
    api.order().observeOrderIssues(orderId, setOrderIssues);
  }, [api, orderId]);

  // return
  return { order, updateOrder, cancelOrder, result, orderIssues };
};
