import { PlatformFees } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const usePlatformFees = () => {
  // context
  const api = useContextApi();
  const { user } = useContextFirebaseUser();
  // state
  const [platformFees, setPlatformFees] = React.useState<PlatformFees | null>();
  // side effects
  React.useEffect(() => {
    if (!user) return;
    const unsub = api.platform().observeFees(setPlatformFees);
    return () => unsub();
  }, [api, user]);
  // result
  return { platformFees };
};
