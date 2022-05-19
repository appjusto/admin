import * as Sentry from '@sentry/react';
import React from 'react';

const supportsNotification = !!('Notification' in window);

export const useNotificationPermission = () => {
  const [permission, setPermission] = React.useState(
    supportsNotification ? Notification.permission : undefined
  );
  // request permission if necessary
  React.useEffect(() => {
    if (!supportsNotification) {
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
