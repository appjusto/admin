import { Fulfillment, Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const initialMap = new Map();

export const useObserveBusinessOrdersHistory = (
  businessId: string | undefined,
  statuses: OrderStatus[] | null,
  orderCode?: string,
  start?: string,
  end?: string,
  orderStatus?: OrderStatus,
  fulfillment?: Fulfillment[]
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [ordersMap, setOrdersMap] =
    React.useState<Map<string | undefined, WithId<Order>[]>>(initialMap);
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastOrder, setLastOrder] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastOrder);
  }, [lastOrder]);
  // side effects
  React.useEffect(() => {
    if (start && !end) return;
    setOrdersMap(initialMap);
    setStartAfter(undefined);
  }, [orderCode, start, end, orderStatus]);
  React.useEffect(() => {
    if (!userCanRead) return;
    const startDate = start ? dayjs(start).startOf('day').toDate() : null;
    const endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.order().observeBusinessOrdersHistory(
      (results, last) => {
        setOrdersMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastOrder(last);
      },
      businessId,
      statuses,
      orderCode,
      startDate,
      endDate,
      orderStatus,
      fulfillment,
      startAfter
    );
    return () => unsub();
  }, [
    api,
    userCanRead,
    startAfter,
    businessId,
    statuses,
    orderCode,
    start,
    end,
    orderStatus,
    fulfillment,
  ]);
  React.useEffect(() => {
    setOrders(
      Array.from(ordersMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [ordersMap]);
  // return
  return { orders, fetchNextPage };
};
