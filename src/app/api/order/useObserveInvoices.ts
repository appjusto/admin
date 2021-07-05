import { useContextApi } from 'app/state/api/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';

export const useObserveInvoices = (
  queryLimit: number,
  orderId?: string | null,
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  // side effects
  React.useEffect(() => {
    let startDate = start ? new Date(start) : null;
    let endDate = end ? new Date(`${end} 23:59:59`) : null;
    const unsub = api.order().observeInvoices(queryLimit, setInvoices, orderId, startDate, endDate);
    return () => unsub();
  }, [api, queryLimit, orderId, start, end]);
  // return
  return invoices;
};
