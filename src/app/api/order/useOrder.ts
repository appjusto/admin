import { useContextApi } from 'app/state/api/context';
import {
  CancelOrderPayload,
  Order,
  OrderCancellation,
  OrderIssue,
  InvoiceType,
  WithId,
} from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useObserveOrderInvoices } from './useObserveOrderInvoices';
import { calculateCancellationCosts } from './utils';

export const useOrder = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [orderIssues, setOrderIssues] = React.useState<WithId<OrderIssue>[] | null>();
  const [orderCancellation, setOrderCancellation] = React.useState<OrderCancellation | null>();
  const [orderCancellationCosts, setOrderCancellationCosts] = React.useState<number>();
  const invoices = useObserveOrderInvoices(orderId);
  // mutations
  const [updateOrder, updateResult] = useMutation(async (changes: Partial<Order>) =>
    api.order().updateOrder(orderId!, changes)
  );
  const [cancelOrder, cancelResult] = useMutation(async (cancellationData: CancelOrderPayload) => {
    await api.order().cancelOrder(cancellationData);
  });
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
  React.useEffect(() => {
    if (!order) return;
    let debt = [] as InvoiceType[];
    //if (['preparing', 'ready'].includes(order.status)) debt.push('platform');
    //if (order.dispatchingState === 'arrived-pickup') debt.push('delivery');
    const cancellationCosts = calculateCancellationCosts(order, { refund: debt });
    setOrderCancellationCosts(cancellationCosts);
  }, [order]);
  // return
  return {
    order,
    invoices,
    updateOrder,
    cancelOrder,
    updateResult,
    cancelResult,
    orderIssues,
    orderCancellation,
    orderCancellationCosts,
  };
};
