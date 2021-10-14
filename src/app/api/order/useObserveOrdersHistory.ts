import { useContextApi } from 'app/state/api/context';
import { WithId, OrderStatus, OrderType, Order } from 'appjusto-types';
import React from 'react';
import firebase from 'firebase/app';
import { uniqWith, isEqual } from 'lodash';

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
    let startDate = start ? new Date(`${start} 00:00:00`) : null;
    let endDate = end ? new Date(`${end} 23:59:59`) : null;
    const unsub = api.order().observeOrdersHistory(
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
      orderStatus,
      type,
      startAfter
    );
    return () => unsub();
  }, [api, startAfter, businessId, statuses, orderCode, start, end, orderStatus, orderType]);
  // return
  console.log(
    'orders',
    orders?.map((o) => o.code)
  );
  return { orders, fetchNextPage };
};
