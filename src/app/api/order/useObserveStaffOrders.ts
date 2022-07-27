import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { Ordering } from './OrderApi';
import { getOrderWarning } from './utils';

export interface OrderWithWarning extends Order {
  warning?: string | null;
}

export const useObserveStaffOrders = (
  getServerTime: () => Date,
  statuses: OrderStatus[],
  staffId?: string,
  ordering?: Ordering
) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [watchedOrders, setwatchedOrders] = 
    React.useState<WithId<OrderWithWarning>[]>([]);
  // side effects
  React.useEffect(() => {
    if(!staffId) return;
    const unsub = api.order().observeStaffOrders(statuses, setOrders, staffId, ordering);
    return () => unsub();
  }, [api, statuses, staffId, ordering]);
  React.useEffect(() => {
    const warningCheck = () => {
      const now = getServerTime();
      const watched = orders.map(order => {
        const warning = getOrderWarning(order, now.getTime());
        return {...order, warning};
      })
      setwatchedOrders(watched);
    };
    warningCheck();
    const timeInterval = setInterval(warningCheck, 60000);
    return () => clearInterval(timeInterval);
  }, [orders, getServerTime])
  // return
  return watchedOrders;
};
