import { OrderFraudPreventionFlags } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveOrderFraudPrevention = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [flags, setFlags] = React.useState<OrderFraudPreventionFlags | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderPrivateFraudPrevention(orderId, setFlags);
    return () => unsub();
  }, [api, orderId]);
  // return
  return flags;
};
