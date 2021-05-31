import { Order, WithId } from 'appjusto-types';
import { omit } from 'lodash';
import { use } from 'utils/local';
import { Acknowledgement, OrderAcknowledgement } from './types';

const { setObject, getObject, removeObject } = use('kanban');

export const getAck = (key: string) => getObject<Acknowledgement>(key) ?? {};

export const setAck = (key: string, ack: Acknowledgement) => setObject<Acknowledgement>(key, ack);

export const removeAck = (key: string) => removeObject(key);

export const getAckOrderIds = (ack: Acknowledgement) => Object.keys(ack);

export const getAckOrders = (ack: Acknowledgement) =>
  getAckOrderIds(ack).map((orderId) => getOrderAck(ack, orderId));

export const getOrderAck = (ack: Acknowledgement, orderId: string) => ack[orderId];

export const addOrderAck = (ack: Acknowledgement, order: WithId<Order>) =>
  ({
    ...ack,
    [order.id]: {
      receivedAt: new Date().getTime(),
      notified: false,
      order: {
        id: order.id,
        code: order.code,
        consumer: {
          name: order.consumer.name,
        },
      },
    },
  } as Acknowledgement);

export const updateOrderAck = (ack: Acknowledgement, orderAck: OrderAcknowledgement) =>
  ({
    ...ack,
    [orderAck.order.id]: orderAck,
  } as Acknowledgement);

export const removeOrderAck = (ack: Acknowledgement, orderId: string) =>
  omit(ack, [orderId]) as Acknowledgement;

export const getOrderAckTime = (key: string, orderId: string) => {
  try {
    const ack = getAck(key);
    const orderAck = getOrderAck(ack, orderId);
    const time = orderAck.receivedAt;
    return time;
  } catch (error) {
    return null;
  }
};
