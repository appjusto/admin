import { useContextApi } from 'app/state/api/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';
import firebase from 'firebase/app';
import { IuguInvoiceStatus } from 'appjusto-types/payment/iugu';
import dayjs from 'dayjs';

const initialMap = new Map();

export const useObserveInvoices = (
  orderCode?: string | null,
  start?: string,
  end?: string,
  status?: IuguInvoiceStatus
) => {
  // context
  const api = useContextApi();
  // state
  const [invoicesMap, setInvoicesMap] = React.useState<Map<string | undefined, WithId<Invoice>[]>>(
    initialMap
  );
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
    if (start && !end) return;
    setInvoicesMap(initialMap);
    setStartAfter(undefined);
  }, [orderCode, start, end, status]);
  React.useEffect(() => {
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.order().observeInvoices(
      (results, last) => {
        setInvoicesMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastInvoice(last);
      },
      orderCode,
      startDate,
      endDate,
      startAfter,
      status
    );
    return () => unsub();
  }, [api, startAfter, orderCode, start, end, status]);
  React.useEffect(() => {
    setInvoices(
      Array.from(invoicesMap.values()).reduce((result, orders) => [...result, ...orders], [])
    );
  }, [invoicesMap]);
  // return
  return { invoices, fetchNextPage };
};
