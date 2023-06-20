import { VRStore, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveVrStore = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [store, setStore] = React.useState<WithId<VRStore> | null>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeBusinessVrStore(businessId, setStore);
    return () => unsub();
  }, [api, businessId]);
  // return
  return store;
};
