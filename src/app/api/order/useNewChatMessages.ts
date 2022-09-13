import { isElectron } from '@firebase/util';
import * as Sentry from '@sentry/react';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useNotificationPermission } from 'app/utils/notifications/useNotificationPermission';
//@ts-ignore
import newMessageSound from 'common/sounds/new-message.mp3';
import { isEqual } from 'lodash';
import React from 'react';
import useSound from 'use-sound';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { showNotification } from '../utils';
import { useRedirectToOrders } from './useRedirectToOrders';

const isDesktopApp = isElectron();

let messagesToNotify: string[] = [];

export const useNewChatMessages = (businessId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('chats');
  const { isBackofficeUser } = useContextFirebaseUser();
  const permission = useNotificationPermission();
  const redirectToOrders = useRedirectToOrders(['/app/orders', '/app/chat']);
  // state
  const [newChatMessages, setNewChatMessages] = React.useState<string[]>([]);
  // sound
  const [playSound] = useSound(newMessageSound, { volume: 1 });
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    const unsub = api
      .chat()
      .observeBusinessNewChatMessages(businessId, setNewChatMessages);
    return () => unsub();
  }, [api, userCanRead, businessId]);
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (newChatMessages.length === 0) return;
    if (!isEqual(messagesToNotify, newChatMessages)) {
      if (isDesktopApp) {
        try {
          window.electron.ipcRenderer.sendMessage('mainWindow-show');
        } catch (error) {
          console.error('Unable to call mainWindow:', error);
        }
      }
      playSound();
      redirectToOrders();
      messagesToNotify = newChatMessages;
    }
    const SoundInterval = setInterval(() => {
      playSound();
    }, 8000);
    return () => clearInterval(SoundInterval);
  }, [isBackofficeUser, playSound, redirectToOrders, newChatMessages]);
  React.useEffect(() => {
    if (permission !== 'granted') return;
    if (newChatMessages.length === 0) return;
    const title = 'Nova mensagem!';
    const options: NotificationOptions = {
      body: 'Você tem uma nova mensagem no chat.',
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
  }, [permission, newChatMessages]);
  // result
  return newChatMessages;
};
