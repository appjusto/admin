import {
  CancelOrderPayload,
  InvoiceType,
  Order,
  OrderCancellation,
  OrderIssue,
  WithId,
} from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { Unsubscribe } from 'firebase/firestore';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';
import { calculateCancellationCosts } from './utils';

const globalIdLength = 20;

export const useOrder = (orderIdentifier?: string) => {
  // context
  const api = useContextApi();
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [orderIssues, setOrderIssues] = React.useState<WithId<OrderIssue>[] | null>();
  const [orderCancellation, setOrderCancellation] = React.useState<OrderCancellation | null>();
  const [orderCancellationCosts, setOrderCancellationCosts] = React.useState<number>();
  // mutations
  const { mutateAsync: updateOrder, mutationResult: updateResult } = useCustomMutation(
    async (changes: Partial<Order>) => api.order().updateOrder(order?.id!, changes),
    'updateOrder'
  );
  const { mutateAsync: cancelOrder, mutationResult: cancelResult } = useCustomMutation(
    async (cancellationData: CancelOrderPayload) => {
      await api.order().cancelOrder(cancellationData);
    },
    'cancelOrder'
  );
  // side effects
  React.useEffect(() => {
    if (!orderIdentifier) return;
    let unsub: Unsubscribe;
    if (orderIdentifier.length < globalIdLength) {
      unsub = api.order().observeOrderByOrderCode(orderIdentifier, setOrder);
    } else {
      unsub = api.order().observeOrder(orderIdentifier, setOrder);
    }
    return () => unsub();
  }, [api, orderIdentifier]);
  React.useEffect(() => {
    if (!order?.id) return;
    const unsub = api.order().observeOrderIssues(order.id, setOrderIssues);
    return () => unsub();
  }, [api, order?.id]);
  React.useEffect(() => {
    if (!order?.id || !['canceled', 'rejected'].includes(order?.status)) return;
    (async () => {
      const cancellation = await api.order().getOrderPrivateCancellation(order.id);
      setOrderCancellation(cancellation);
    })();
  }, [api, order?.id, order?.status]);
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
    updateOrder,
    cancelOrder,
    updateResult,
    cancelResult,
    orderIssues,
    orderCancellation,
    orderCancellationCosts,
  };
};
