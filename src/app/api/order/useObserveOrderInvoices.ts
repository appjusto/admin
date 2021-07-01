import { useContextApi } from 'app/state/api/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';
import { useFirebaseUserRole } from '../auth/useFirebaseUserRole';

export const useObserveOrderInvoices = (orderId?: string) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useFirebaseUserRole();
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
