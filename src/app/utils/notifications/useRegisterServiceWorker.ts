import React from 'react';

const browserSupports = 'Notification' in window && 'ServiceWorkerRegistration' in window;

export const useServiceWorkerRegistration = () => {
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration>();
  React.useEffect(() => {
    if (!browserSupports) {
      console.log('Navegador não suporta service workers.');
      return;
    }
    (async () => {
      setRegistration(await navigator.serviceWorker.getRegistration());
    })();
  }, []);
  return registration;
};
