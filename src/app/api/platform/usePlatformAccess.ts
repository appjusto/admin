import { useContextApi } from 'app/state/api/context';
import { PlatformAccess } from 'appjusto-types';
import React from 'react';

export const usePlatformAccess = (loggedUser: boolean) => {
  // context
  const api = useContextApi();
  // state
  const [access, setAccess] = React.useState<PlatformAccess>();
  // side effects
  React.useEffect(() => {
    if (!loggedUser) return;
    const unsub = api.platform().observeAccess(setAccess);
    return () => unsub();
  }, [api, loggedUser]);
  // result
  return access;
};
