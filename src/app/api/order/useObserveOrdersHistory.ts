import { useContextApi } from 'app/state/api/context';
import { WithId, OrderStatus, OrderType, Order } from 'appjusto-types';
import React from 'react';
import firebase from 'firebase/app';
import dayjs from 'dayjs';

export const useObserveOrdersHistory = (
  businessId: string | null | undefined,
  statuses: OrderStatus[] | null,
  orderCode?: string,
  start?: string,
  end?: string,
  orderStatus?: OrderStatus,
  orderType?: OrderType[]
) => {
  // context
  const api = useContextApi();
  // state
  const [ordersMap, setOrdersMap] = React.useState<Map<string | undefined, WithId<Order>[]>>(
    new Map()
  );
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
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
    setStartAfter(undefined);
  }, [orderCode, start, end, orderStatus, orderType]);
  React.useEffect(() => {
    let type = orderType?.length === 1 ? orderType[0] : null;
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.order().observeOrdersHistory(
      (results, last) => {
        setOrdersMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        setLastOrder(last);
      },
      businessId,
      statuses,
      orderCode,
      startDate,
      endDate,
      orderStatus,
      type,
      startAfter
    );
    return () => unsub();
  }, [api, startAfter, businessId, statuses, orderCode, start, end, orderStatus, orderType]);
  React.useEffect(() => {
    setOrders(
      Array.from(ordersMap.values()).reduce((result, orders) => [...result, ...orders], [])
    );
  }, [ordersMap]);
  // return
  return { orders, fetchNextPage };
};
