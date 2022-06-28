import { OrderStatus } from '@appjusto/types';
import { isElectron } from '@firebase/util';
import * as Sentry from '@sentry/react';
import { useObserveOrders } from 'app/api/order/useObserveOrders';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useNotificationPermission } from 'app/utils/notifications/useNotificationPermission';
//@ts-ignore
import newOrderSound from 'common/sounds/bell-ding-v3.mp3';
import { difference } from 'lodash';
import React from 'react';
import useSound from 'use-sound';
import {
  addOrderAck,
  getAck,
  getAckOrderIds,
  getAckOrders,
  removeOrderAck,
  setAck,
  updateOrderAck
} from './utils';

const isDesktopApp = isElectron();

const key = 'confirmed';

const statuses: OrderStatus[] = ['confirmed'];

const showNotification = (title: string, options: NotificationOptions) =>
  new window.Notification(title, options);

export const useObserveConfirmedOrders = (businessId?: string, notify: boolean = true) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  const permission = useNotificationPermission();
  const confirmedOrders = useObserveOrders(statuses, businessId);
  // state
  const [changed, setChanged] = React.useState(false);
  const [confirmedNumber, setConfirmedNumber] = React.useState(0);
  // sound
  const [playSound] = useSound(newOrderSound, { volume: 1 });
  console.log("NODE_ENV", process.env.NODE_ENV);
  // side effects
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (confirmedOrders.length === 0) return;
    if(isElectron()) {
      try {
        window.electron.ipcRenderer.sendMessage('mainWindow-show')
      } catch (error) {
        console.error("Unable to call mainWindow:", error);
      }
    }
    playSound();
    const SoundInterval = setInterval(() => {
      playSound();
    }, 4000);
    return () => clearInterval(SoundInterval);
  }, [isBackofficeUser, confirmedOrders, playSound]);

  React.useEffect(() => {
    setConfirmedNumber(confirmedOrders.length);
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
      const title = `Pedido #${unnotified.order.code} acabou de chegar!`;
      const options: NotificationOptions = {
        body: `${unnotified.order.consumer.name} está esperando sua confirmação!`,
        icon: '/logo192.png',
        requireInteraction: true,
        silent: false,
      };
      if (!isDesktopApp && process.env.NODE_ENV === 'production') {
        try {
          navigator.serviceWorker
            .getRegistration()
            .then((reg) => {
              if (reg) return reg.showNotification(title, options);
            })
            .catch((error) => {
              console.log('navigator.serviceWorker.getRegistration error', error);
              Sentry.captureException(error);
            });
        } catch (error) {
          console.log('Notification API error: ' + error);
          Sentry.captureException(error);
        }
      } else {
        showNotification(title, options);
      }
    });
    setAck(key, ack);
    setChanged(false);
  }, [changed, notify, permission]);
  // result
  return confirmedNumber;
};
