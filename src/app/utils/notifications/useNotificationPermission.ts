import * as Sentry from '@sentry/react';
import React from 'react';

export const useNotificationPermission = () => {
  const [permission, setPermission] = React.useState(Notification?.permission);
  // request permission if necessary
  React.useEffect(() => {
    if (!('Notification' in window)) {
      console.warn('Navegador não suporta notificações');
      return;
    }
    if (permission === 'granted') {
    } else if (permission !== 'denied') {
      try {
        Notification.requestPermission().then(setPermission);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error);
      }
    }
  }, [permission]);
  // result
  return permission;
};
