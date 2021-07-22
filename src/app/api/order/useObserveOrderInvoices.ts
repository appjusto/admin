import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';

export const useObserveOrderInvoices = (orderId?: string) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  const businessId = useContextBusinessId();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (isBackofficeUser) {
      const unsub = api.order().observeOrderInvoices(orderId, setInvoices);
      return () => unsub();
    } else if (businessId) {
      const unsub = api.order().observeOrderInvoices(orderId, setInvoices, businessId);
      return () => unsub();
    }
  }, [orderId, api, isBackofficeUser, businessId]);
  // return
  return invoices;
};
