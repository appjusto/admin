import { Invoice, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveInvoice = (invoiceId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  // state
  const [invoice, setInvoice] = React.useState<WithId<Invoice> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!invoiceId) return;
    const unsub = api.invoices().observeInvoice(invoiceId, setInvoice);
    return () => unsub();
  }, [api, userCanRead, invoiceId]);
  // return
  return invoice;
};
