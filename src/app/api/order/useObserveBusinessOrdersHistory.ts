import { useContextApi } from 'app/state/api/context';
import { WithId, OrderStatus, Order } from 'appjusto-types';
import React from 'react';
import firebase from 'firebase/app';
import { uniqWith, isEqual } from 'lodash';
import dayjs from 'dayjs';

export const useObserveBusinessOrdersHistory = (
  businessId: string | undefined,
  statuses: OrderStatus[] | null,
  orderCode?: string,
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  // state
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
  }, [orderCode, start, end]);
  React.useEffect(() => {
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    const unsub = api.order().observeBusinessOrdersHistory(
      (results, last) => {
        if (!startAfter) setOrders(results);
        else
          setOrders((prev) => {
            if (prev) {
              const union = [...prev, ...results];
              return uniqWith(union, isEqual);
            }
            return results;
          });
        setLastOrder(last);
      },
      businessId,
      statuses,
      orderCode,
      startDate,
      endDate,
      startAfter,
      true
    );
    return () => unsub();
  }, [api, startAfter, businessId, statuses, orderCode, start, end]);
  // return
  return { orders, fetchNextPage };
};
