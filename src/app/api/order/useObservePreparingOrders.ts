import React from 'react';
import { OrderStatus } from 'appjusto-types';
import { difference } from 'lodash';
import { useOrders } from 'app/api/order/useOrders';

import { getAck, setAck, getAckOrderIds, addOrderAck, removeOrderAck } from './utils';

const key = 'preparing';

const statuses: OrderStatus[] = ['preparing'];

export const useObservePreparingOrders = (businessId?: string) => {
  // context
  const preparingOrders = useOrders(statuses, businessId);

  // side effects
  React.useEffect(() => {
    if (preparingOrders.length === 0) {
      return;
    }
    let ack = getAck(key);
    const ackOrderIds = getAckOrderIds(ack);
    const preparingOrdersIds = preparingOrders.map((order) => order.id);
    const added = difference(preparingOrdersIds, ackOrderIds);
    const removed = difference(ackOrderIds, preparingOrdersIds);
    if (added.length === 0 && removed.length === 0) return;
    added.forEach((orderId) => {
      const order = preparingOrders.find(({ id }) => id === orderId);
      ack = addOrderAck(ack, order!);
    });
    removed.forEach((orderId) => (ack = removeOrderAck(ack, orderId)));
    setAck(key, ack);
  }, [preparingOrders]);
};
