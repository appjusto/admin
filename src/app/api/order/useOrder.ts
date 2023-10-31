import {
  CancelOrderPayload,
  // InvoiceType,
  Order,
  OrderCancellation,
  OrderStaff,
  WithId,
} from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';
// import { calculateCancellationCosts } from './utils';

const orderCancellationCosts = 0;

export const useOrder = (orderId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [orderCancellation, setOrderCancellation] =
    React.useState<OrderCancellation | null>();
  // const [orderCancellationCosts, setOrderCancellationCosts] = React.useState<number>(0);
  // mutations
  const { mutate: updateOrder, mutationResult: updateResult } =
    useCustomMutation(
      (changes: Partial<Order>) => api.order().updateOrder(order?.id!, changes),
      'updateOrder'
    );
  const { mutate: updateOrderStaff, mutationResult: updateOrderStaffResult } =
    useCustomMutation(
      (staff: OrderStaff | null) =>
        api.order().updateOrder(order?.id!, { staff }),
      'updateOrderStaff'
    );
  const { mutate: cancelOrder, mutationResult: cancelResult } =
    useCustomMutation(
      (cancellationData: CancelOrderPayload) =>
        api.order().cancelOrder(cancellationData),
      'cancelOrder'
    );
  const { mutate: deleteQuoteOrder, mutationResult: deleteOrderResult } =
    useCustomMutation(
      (orderId: string) => api.order().deleteQuoteOrder(orderId),
      'deleteQuoteOrder'
    );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    const unsub = api.order().observeOrder(orderId, setOrder);
    return () => unsub();
  }, [api, userCanRead, orderId]);
  React.useEffect(() => {
    if (!order?.id || !['canceled', 'rejected'].includes(order?.status)) return;
    (async () => {
      const cancellation = await api
        .order()
        .getOrderPrivateCancellation(order.id);
      setOrderCancellation(cancellation);
    })();
  }, [api, order?.id, order?.status]);
  // React.useEffect(() => {
  //   if (!order) return;
  //   let debt = [] as InvoiceType[];
  //   //if (['preparing', 'ready'].includes(order.status)) debt.push('platform');
  //   //if (order.dispatchingState === 'arrived-pickup') debt.push('delivery');
  //   // const cancellationCosts = calculateCancellationCosts(order, { refund: debt });
  //   // setOrderCancellationCosts(cancellationCosts);
  // }, [order]);
  // return
  return {
    order,
    updateOrder,
    updateOrderStaff,
    cancelOrder,
    deleteQuoteOrder,
    updateResult,
    updateOrderStaffResult,
    cancelResult,
    deleteOrderResult,
    orderCancellation,
    orderCancellationCosts,
  };
};
