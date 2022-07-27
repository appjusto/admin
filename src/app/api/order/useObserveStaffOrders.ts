import { Order, OrderStatus, PlatformParams, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { Ordering } from './OrderApi';
import { getOrderWarning } from './utils';

export interface OrderWithWarning extends Order {
  warning?: string | null;
}

// const confirmed = 1; // 3
// const matching = 2; // 4
// const goingPickup = 2; // 10
// const readyArrivedPickup = 2; // 15 
// const dispatchingArrivedPickup = 2; // 5
// const goingDestination = 2; // 10

export const useObserveStaffOrders = (
  getServerTime: () => Date,
  statuses: OrderStatus[],
  staffId?: string,
  backofficeWarnings?: PlatformParams['orders']['backofficeWarnings'],
  ordering?: Ordering,
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
        if(!backofficeWarnings) return order;
        const {
          confirmed,
          matching,
          goingPickup,
          readyArrivedPickup,
          dispatchingArrivedPickup,
          goingDestination,
        } = backofficeWarnings;
        const warning = getOrderWarning(
            order, 
            now.getTime(),
            confirmed,
            matching,
            goingPickup,
            readyArrivedPickup,
            dispatchingArrivedPickup,
            goingDestination,
          );
        return {...order, warning};
      })
      setwatchedOrders(watched);
    };
    warningCheck();
    const timeInterval = setInterval(warningCheck, 32000);
    return () => clearInterval(timeInterval);
  }, [orders, getServerTime, backofficeWarnings])
  // return
  return watchedOrders;
};
