import { Invoice, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveInvoice = (invoiceId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [invoice, setInvoice] = React.useState<WithId<Invoice> | null>();
  // side effects
  React.useEffect(() => {
    if (!invoiceId) return;
    const unsub = api.invoices().observeInvoice(invoiceId, setInvoice);
    return () => unsub();
  }, [api, invoiceId]);
  // return
  return invoice;
};
