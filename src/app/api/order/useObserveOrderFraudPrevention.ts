import { OrderFraudPreventionFlags } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderFraudPrevention = (orderId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [flags, setFlags] = React.useState<OrderFraudPreventionFlags | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    const unsub = api
      .order()
      .observeOrderPrivateFraudPrevention(orderId, setFlags);
    return () => unsub();
  }, [api, userCanRead, orderId]);
  // return
  return flags;
};
