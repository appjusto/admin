import { useContextApi } from 'app/state/api/context';
import { Bank, WithId } from 'appjusto-types';
import React from 'react';

export const useBanks = () => {
  // context
  const api = useContextApi();
  // state
  const [banks, setBanks] = React.useState<WithId<Bank>[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setBanks(await api.platform().fetchBanks());
    })();
  }, [api]);
  return banks;
};
