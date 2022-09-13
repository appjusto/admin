import { ManagerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useManager = (managerId?: string) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('managers');
  // state
  const [manager, setManager] = React.useState<
    WithId<ManagerProfile> | undefined | null
  >();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!managerId) return;
    const unsub = api.manager().observeProfile(managerId, setManager);
    return () => unsub();
  }, [api, userCanRead, managerId]);
  // return
  return { manager };
};
