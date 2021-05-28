import React from 'react';
import { Order, OrderStatus, WithId } from 'appjusto-types';
import { useNotificationPermission } from 'app/utils/notifications/useNotificationPermission';
import { useServiceWorkerRegistration } from 'app/utils/notifications/useRegisterServiceWorker';
import { difference, omit } from 'lodash';
import { use } from 'utils/local';
import { useOrders } from 'app/api/order/useOrders';

const { setObject, getObject, removeObject } = use('kanban');

type OrderAcknowledgement = {
  receivedAt: Date;
  notified: boolean;
  order: {
    id: string;
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
  const permission = useNotificationPermission();
  const registration = useServiceWorkerRegistration();
  const confirmedOrders = useOrders(statuses, businessId);
  const [changed, setChanged] = React.useState(false);
  React.useEffect(() => {
    if (confirmedOrders.length === 0) {
      // removeAck();
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
    const ack = getAck();
    const ackOrder = getAckOrders(ack);
    const unotified = ackOrder.find((order) => !order.notified);
    if (unotified) {
      const title = 'Novo pedido!';
      const body = `${unotified.order.consumer.name} acabou de fazer um pedido.`;
      if (registration) {
        console.log(registration);
        // Actions are only supported for persistent notifications shown using ServiceWorkerRegistration.showNotification().
        registration
          .showNotification(title, {
            body,
            actions: [
              {
                action: 'view',
                title: 'Ver',
              },
              {
                action: 'prepare',
                title: 'Preparar',
              },
            ],
          })
          .then(() => {
            setAck(updateOrderAck(ack, unotified));
          });
      } else {
        new Notification(title, {
          body,
        });
        setAck(updateOrderAck(ack, unotified));
      }
    }
  }, [changed, notify, permission, registration]);
};
