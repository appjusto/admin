import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { isEqual, uniqWith } from 'lodash';
import React from 'react';

export const useObserveBOActiveOrders = (statuses: OrderStatus[], isNoStaff?: boolean) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [startAfter, setStartAfter] = React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastOrder, setLastOrder] = React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextOrders = React.useCallback(() => {
    setStartAfter(lastOrder);
  }, [lastOrder]);
  // side effects
  React.useEffect(() => {
    const unsub = api.order().observeBOActiveOrders(
      statuses,
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
        if (last) setLastOrder(last);
      },
      startAfter,
      isNoStaff
    );
    return () => unsub();
  }, [api, statuses, isNoStaff, startAfter]);
  // return
  return { orders, fetchNextOrders };
};