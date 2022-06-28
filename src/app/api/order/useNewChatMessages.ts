import { isElectron } from '@firebase/util';
import * as Sentry from '@sentry/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useNotificationPermission } from 'app/utils/notifications/useNotificationPermission';
//@ts-ignore
import newMessageSound from 'common/sounds/new-message.mp3';
import React from 'react';
import { useHistory } from 'react-router-dom';
import useSound from 'use-sound';
import { OrderChatGroup } from '../chat/types';
import { showNotification } from '../utils';

const isDesktopApp = isElectron();

export const useNewChatMessages = (chats: OrderChatGroup[]) => {
  // context
  const { push } =useHistory();
  const { isBackofficeUser } = useContextFirebaseUser();
  const permission = useNotificationPermission();
  // state
  const [newChatMessages, setNewChatMessages] = React.useState<string[]>([]);
  // sound
  const [playSound] = useSound(newMessageSound, { volume: 1 });
  // side effects
  React.useEffect(() => {
    if (chats.length > 0) {
      let unreadMessages = [] as string[];
      chats.forEach((group) => {
        group.counterParts.forEach((part) => {
          if (part.unreadMessages && part.unreadMessages.length > 0) {
            unreadMessages.push(...part.unreadMessages);
          }
        });
      });
      setNewChatMessages(unreadMessages);
    }
  }, [chats]);
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (newChatMessages.length === 0) return;
    if(isDesktopApp) {
      try {
        window.electron.ipcRenderer.sendMessage('mainWindow-show')
      } catch (error) {
        console.error("Unable to call mainWindow:", error);
      }
    }
    playSound();
    push('/app/orders');
    const SoundInterval = setInterval(() => {
      playSound();
    }, 8000);
    return () => clearInterval(SoundInterval);
  }, [isBackofficeUser, playSound, push, newChatMessages]);
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
