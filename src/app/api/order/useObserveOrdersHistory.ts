import {
  Fulfillment,
  Order,
  OrderStatus,
  OrderType,
  WithId,
} from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { InQueryArray } from '../types';

const initialMap = new Map();

export const useObserveOrdersHistory = (
  businessId: string | null | undefined,
  statuses: InQueryArray<OrderStatus> | null,
  orderCode?: string,
  start?: string,
  end?: string,
  orderStatus?: OrderStatus,
  orderType?: OrderType[],
  fulfillment?: Fulfillment[]
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [ordersMap, setOrdersMap] =
    React.useState<Map<string | undefined, WithId<Order>[]>>(initialMap);
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
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
  }, [orderCode, start, end, orderStatus, orderType]);
  React.useEffect(() => {
    if (!userCanRead) return;
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
        if (last) setLastOrder(last);
      },
      businessId,
      statuses,
      orderCode,
      startDate,
      endDate,
      orderStatus,
      type,
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
    orderType,
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
