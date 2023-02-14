import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

const time = 600_000;

export const useBusinessKeepAlive = (businessId?: string) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  // side effects
  React.useEffect(() => {
    if (!api) return;
    if (isBackofficeUser !== false) return;
    if (!businessId) return;
    const sendKeepAlive = () => {
      api.business().sendBusinessKeepAlive(businessId);
    };
    const keepAliveInterval = setInterval(() => {
      sendKeepAlive();
    }, time);
    sendKeepAlive();
    return () => clearInterval(keepAliveInterval);
  }, [api, isBackofficeUser, businessId]);
};
