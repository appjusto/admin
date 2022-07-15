import { LedgerEntry, LedgerEntryStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';

const initialMap = new Map();

export const useObserveLedger = (
  orderCode?: string | null,
  start?: string,
  end?: string,
  status?: LedgerEntryStatus
) => {
  // context
  const api = useContextApi();
  // state
  const [entriesMap, setEntriesMap] = React.useState<Map<string | undefined, WithId<LedgerEntry>[]>>(
    initialMap
  );
  const [entries, setEntries] = React.useState<WithId<LedgerEntry>[] | null>();
  const [startAfter, setStartAfter] = React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastInvoice, setLastInvoice] = React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastInvoice);
  }, [lastInvoice]);
  // side effects
  React.useEffect(() => {
    if (start && !end) return;
    setEntriesMap(initialMap);
    setStartAfter(undefined);
  }, [orderCode, start, end, status]);
  React.useEffect(() => {
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.order().observeLedger(
      (results, last) => {
        setEntriesMap((current) => {
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
    setEntries(
      Array.from(entriesMap.values()).reduce((result, orders) => [...result, ...orders], [])
    );
  }, [entriesMap]);
  // return
  return { entries, fetchNextPage };
};
