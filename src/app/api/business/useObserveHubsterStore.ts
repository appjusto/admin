import { HubsterStore, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const useObserveHubsterStore = (businessId?: string) => {
  // context
  const api = useContextApi();
  const { userAbility } = useContextFirebaseUser();
  // state
  const [store, setStore] = React.useState<WithId<HubsterStore> | null>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!userAbility?.can('read', 'integrations')) return;
    const unsub = api
      .business()
      .observeBusinessHubsterStore(businessId, setStore);
    return () => unsub();
  }, [api, userAbility, businessId]);
  // return
  return store;
};
