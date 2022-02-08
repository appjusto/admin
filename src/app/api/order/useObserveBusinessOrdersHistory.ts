import { useContextApi } from 'app/state/api/context';
import { WithId, OrderStatus, Order } from 'appjusto-types';
import React from 'react';
import firebase from 'firebase/app';
import dayjs from 'dayjs';

const initialMap = new Map();

export const useObserveBusinessOrdersHistory = (
  businessId: string | undefined,
  statuses: OrderStatus[] | null,
  orderCode?: string,
  start?: string,
  end?: string,
  orderStatus?: OrderStatus
) => {
  // context
  const api = useContextApi();
  // state
  const [ordersMap, setOrdersMap] = React.useState<Map<string | undefined, WithId<Order>[]>>(
    initialMap
  );
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastOrder, setLastOrder] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
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
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
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
      startAfter
    );
    return () => unsub();
  }, [api, startAfter, businessId, statuses, orderCode, start, end, orderStatus]);
  React.useEffect(() => {
    setOrders(
      Array.from(ordersMap.values()).reduce((result, orders) => [...result, ...orders], [])
    );
  }, [ordersMap]);
  // return
  return { orders, fetchNextPage };
};
