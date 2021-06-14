import { useContextApi } from 'app/state/api/context';
import { Order, OrderCancellation, OrderIssue, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { CancellationData } from './OrderApi';

export const useOrder = (orderId?: string) => {
  // context
  const api = useContextApi();

  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [orderIssues, setOrderIssues] = React.useState<WithId<OrderIssue>[] | null>();
  const [orderCancellation, setOrderCancellation] = React.useState<OrderCancellation | null>();

  // mutations
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
    const unsub = api.order().observeOrder(orderId, setOrder);
    const unsub2 = api.order().observeOrderIssues(orderId, setOrderIssues);
    return () => {
      unsub();
      unsub2();
    };
  }, [api, orderId]);

  React.useEffect(() => {
    if (order?.status !== 'canceled' || !orderId) return;
    (async () => {
      const cancellation = await api.order().getOrderPrivateCancellation(orderId);
      if (cancellation) setOrderCancellation(cancellation);
      else setOrderCancellation(null);
    })();
  }, [api, order?.status, orderId]);

  // return
  return { order, updateOrder, cancelOrder, result, orderIssues, orderCancellation };
};
