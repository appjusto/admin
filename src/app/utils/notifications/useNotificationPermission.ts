import React from 'react';

const browserSupports = 'Notification' in window;

export const useNotificationPermission = () => {
  const [permission, setPermission] = React.useState(Notification?.permission);
  // request permission if necessary
  React.useEffect(() => {
    if (!browserSupports) {
      console.warn('Navegador não suporta notificações');
      return;
    }
    if (permission === 'granted') {
    } else if (permission !== 'denied') {
      Notification.requestPermission().then(setPermission);
    }
  }, [permission]);
  return permission;
};
