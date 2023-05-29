import { Invoice, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderInvoices = (
  orderId?: string,
  isActive: boolean = true
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  const businessId = useContextBusinessId();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isActive) return;
    const unsub = api.invoices().observeOrderInvoices(orderId, setInvoices);
    return () => unsub();
  }, [api, userCanRead, businessId, orderId, isActive]);
  // return
  return invoices;
};
