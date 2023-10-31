import { Incident, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderIncidents = (orderId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [incidents, setIncidents] = React.useState<WithId<Incident>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    const unsub = api.order().observeOrderIncidentes(orderId, setIncidents);
    return () => unsub();
  }, [api, userCanRead, orderId]);
  // return
  return incidents;
};
