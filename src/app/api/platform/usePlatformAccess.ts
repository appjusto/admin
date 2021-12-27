import { useContextApi } from 'app/state/api/context';
import { PlatformAccess } from 'appjusto-types';
import React from 'react';

export const usePlatformAccess = () => {
  // context
  const api = useContextApi();
  // state
  const [access, setAccess] = React.useState<PlatformAccess>();
  // side effects
  React.useEffect(() => {
    const unsub = api.platform().observeAccess(setAccess);
    return () => unsub();
  }, [api]);
  // result
  return access;
};
