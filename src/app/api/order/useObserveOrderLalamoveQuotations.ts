import { WithId } from '@appjusto/types';
import { LalamoveQuotation } from '@appjusto/types/external/lalamove';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveOrderLalamoveQuotations = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [lastQuotation, setLastQuotation] =
    React.useState<WithId<LalamoveQuotation>>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api
      .order()
      .observeOrderLalamoveQuotations(orderId, (quotations) => {
        setLastQuotation(quotations[0]);
      });
    return () => unsub();
  }, [api, orderId]);
  // result
  return lastQuotation;
};
