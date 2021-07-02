import { useContextApi } from 'app/state/api/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';

export const useObserveInvoices = () => {
  // context
  const api = useContextApi();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  // side effects
  React.useEffect(() => {
    const unsub = api.order().observeInvoices(setInvoices);
    return () => unsub();
  }, [api]);
  console.log('invoices', invoices);
  // return
  return invoices;
};
