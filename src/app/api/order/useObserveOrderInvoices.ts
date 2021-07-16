import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';

export const useObserveOrderInvoices = (orderId?: string) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (!isBackofficeUser) return;
    const unsub = api.order().observeOrderInvoices(orderId, setInvoices);
    return () => unsub();
  }, [orderId, api, isBackofficeUser]);
  // return
  return invoices;
};
