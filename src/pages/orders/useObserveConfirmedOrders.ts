import React from 'react';
import { Order, OrderStatus, WithId } from 'appjusto-types';
import { useNotificationPermission } from 'app/utils/notifications/useNotificationPermission';
import { difference, omit } from 'lodash';
import { use } from 'utils/local';
import { useOrders } from 'app/api/order/useOrders';
import useSound from 'use-sound';
//@ts-ignore
import newOrderSound from 'common/sounds/bell-ding.mp3';

// maybe TODO: show notification only if page is hidden  https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
// maybe TODO: update document title until tab is focused

const { setObject, getObject, removeObject } = use('kanban');

type OrderAcknowledgement = {
  receivedAt: Date;
  notified: boolean;
  order: {
    id: string;
    code: string;
    consumer: {
      name: string;
    };
  };
};
type Acknowledgement = {
  [key: string]: OrderAcknowledgement;
};

const key = 'acknowledgement';
const getAck = () => getObject<Acknowledgement>(key) ?? {};
const setAck = (ack: Acknowledgement) => setObject<Acknowledgement>(key, ack);
const removeAck = () => removeObject(key);

const getAckOrderIds = (ack: Acknowledgement) => Object.keys(ack);
const getAckOrders = (ack: Acknowledgement) =>
  getAckOrderIds(ack).map((orderId) => getOrderAck(ack, orderId));
const getOrderAck = (ack: Acknowledgement, orderId: string) => ack[orderId];
const addOrderAck = (ack: Acknowledgement, order: WithId<Order>) =>
  ({
    ...ack,
    [order.id]: {
      receivedAt: new Date(),
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
const updateOrderAck = (ack: Acknowledgement, orderAck: OrderAcknowledgement) =>
  ({
    ...ack,
    [orderAck.order.id]: orderAck,
  } as Acknowledgement);
const removeOrderAck = (ack: Acknowledgement, orderId: string) =>
  omit(ack, [orderId]) as Acknowledgement;

const statuses: OrderStatus[] = ['confirmed'];
export const useObserveConfirmedOrders = (businessId?: string, notify: boolean = true) => {
  const [playSound] = useSound(newOrderSound, { volume: 2 });
  const permission = useNotificationPermission();
  const confirmedOrders = useOrders(statuses, businessId);
  const [changed, setChanged] = React.useState(false);
  React.useEffect(() => {
    if (confirmedOrders.length === 0) {
      return;
    }
    let ack = getAck();
    const ackOrderIds = getAckOrderIds(ack);
    const confirmedOrdersIds = confirmedOrders.map((order) => order.id);
    const added = difference(confirmedOrdersIds, ackOrderIds);
    const removed = difference(ackOrderIds, confirmedOrdersIds);
    if (added.length === 0 && removed.length === 0) return;
    added.forEach((orderId) => {
      const order = confirmedOrders.find(({ id }) => id === orderId);
      ack = addOrderAck(ack, order!);
    });
    removed.forEach((orderId) => (ack = removeOrderAck(ack, orderId)));
    setAck(ack);
    setChanged(true);
  }, [confirmedOrders]);
  React.useEffect(() => {
    if (!changed) return;
    if (permission !== 'granted') return;
    if (!notify) return;
    let ack = getAck();
    const ackOrder = getAckOrders(ack);
    const unnotifieds = ackOrder.filter((order) => !order.notified);
    if (unnotifieds.length === 0) return;
    unnotifieds.forEach((unnotified) => {
      ack = updateOrderAck(ack, { ...unnotified, notified: true });
      playSound();
      const title = `Pedido #${unnotified.order.code} acabou de chegar!`;
      const options: NotificationOptions = {
        body: `${unnotified.order.consumer.name} está esperando sua confirmação!`,
        // icon: '/logo192.png',
        requireInteraction: true,
      };
      new Notification(title, options);
    });
    setAck(ack);
    setChanged(false);
  }, [changed, notify, permission, playSound]);
};
