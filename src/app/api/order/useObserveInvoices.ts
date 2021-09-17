import { useContextApi } from 'app/state/api/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';
import firebase from 'firebase/app';
import { IuguInvoiceStatus } from 'appjusto-types/payment/iugu';

export const useObserveInvoices = (
  orderCode?: string | null,
  start?: string,
  end?: string,
  status?: IuguInvoiceStatus
) => {
  // context
  const api = useContextApi();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastInvoice, setLastInvoice] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastInvoice);
  }, [lastInvoice]);
  // side effects
  React.useEffect(() => {
    setStartAfter(undefined);
  }, [orderCode, start, end]);
  React.useEffect(() => {
    let startDate = start ? new Date(`${start} 00:00:00`) : null;
    let endDate = end ? new Date(`${end} 23:59:59`) : null;
    const unsub = api.order().observeInvoices(
      (results, last) => {
        if (!startAfter) setInvoices(results);
        else setInvoices((prev) => (prev ? [...prev, ...results] : results));
        setLastInvoice(last);
      },
      orderCode,
      startDate,
      endDate,
      startAfter,
      status
    );
    return () => unsub();
  }, [api, startAfter, orderCode, start, end, status]);
  // return
  return { invoices, fetchNextPage };
};
