import { PlatformFees } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const usePlatformFees = () => {
  // context
  const api = useContextApi();
  // state
  const [platformFees, setPlatformFees] = React.useState<PlatformFees | null>();
  // side effects
  React.useEffect(() => {
    const unsub = api.platform().observeFees(setPlatformFees);
    return () => unsub();
  }, [api]);
  // result
  return { platformFees };
};