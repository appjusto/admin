import React from 'react';
import { OrderStatus } from 'appjusto-types';
import { useNotificationPermission } from 'app/utils/notifications/useNotificationPermission';
import { difference } from 'lodash';
import { useOrders } from 'app/api/order/useOrders';
import useSound from 'use-sound';
//@ts-ignore
import newOrderSound from 'common/sounds/bell-ding.mp3';

import {
  getAck,
  setAck,
  getAckOrderIds,
  getAckOrders,
  addOrderAck,
  updateOrderAck,
  removeOrderAck,
} from './utils';

// maybe TODO: show notification only if page is hidden  https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
// maybe TODO: update document title until tab is focused

const key = 'confirmed';

const statuses: OrderStatus[] = ['confirmed'];

export const useObserveConfirmedOrders = (businessId?: string, notify: boolean = true) => {
  // context
  const permission = useNotificationPermission();
  const confirmedOrders = useOrders(statuses, businessId);
  // state
  const [changed, setChanged] = React.useState(false);
  const [volume, setVolume] = React.useState(2);
  // sound
  const [playSound] = useSound(newOrderSound, { volume });

  React.useEffect(() => {
    if (confirmedOrders.length === 0) return;
    const SoundInterval = setInterval(() => {
      playSound();
      setVolume((prev) => (prev <= 5 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(SoundInterval);
  }, [confirmedOrders, playSound]);

  // side effects
  React.useEffect(() => {
    if (confirmedOrders.length === 0) {
      return;
    }
    let ack = getAck(key);
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
    setAck(key, ack);
    setChanged(true);
  }, [confirmedOrders]);

  React.useEffect(() => {
    if (!changed) return;
    if (permission !== 'granted') return;
    if (!notify) return;
    let ack = getAck(key);
    const ackOrder = getAckOrders(ack);
    const unnotifieds = ackOrder.filter((order) => !order.notified);
    if (unnotifieds.length === 0) return;
    unnotifieds.forEach((unnotified) => {
      ack = updateOrderAck(ack, { ...unnotified, notified: true });
      //playSound();
      const title = `Pedido #${unnotified.order.code} acabou de chegar!`;
      const options: NotificationOptions = {
        body: `${unnotified.order.consumer.name} está esperando sua confirmação!`,
        icon: '/logo192.png',
        requireInteraction: true,
      };
      new Notification(title, options);
    });
    setAck(key, ack);
    setChanged(false);
  }, [changed, notify, permission, playSound]);
};
