import { ManagerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useManager = (managerId?: string) => {
  // contex
  const api = useContextApi();
  // state
  const [manager, setManager] = React.useState<WithId<ManagerProfile> | undefined | null>();
  // side effects
  React.useEffect(() => {
    if (!managerId) return;
    const unsub = api.manager().observeProfile(managerId, setManager);
    return () => unsub();
  }, [api, managerId]);
  // return
  return { manager };
};
