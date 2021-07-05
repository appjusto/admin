import { useContextApi } from 'app/state/api/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';
import firebase from 'firebase';

export const useObserveInvoices = (orderId?: string | null, start?: string, end?: string) => {
  // context
  const api = useContextApi();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastFleet, setLastFleet] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastFleet);
  }, [lastFleet]);
  // side effects
  React.useEffect(() => {
    let startDate = start ? new Date(start) : null;
    let endDate = end ? new Date(`${end} 23:59:59`) : null;
    const unsub = api.order().observeInvoices(
      (results, last) => {
        if (!startAfter) setInvoices(results);
        else setInvoices((prev) => (prev ? [...prev, ...results] : results));
        setLastFleet(last);
      },
      orderId,
      startDate,
      endDate,
      startAfter
    );
    return () => unsub();
  }, [api, startAfter, orderId, start, end]);
  // return
  return { invoices, fetchNextPage };
};
