import { LedgerEntry, LedgerEntryStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const initialMap = new Map();

export const useObserveLedger = (
  orderId?: string | null,
  start?: string,
  end?: string,
  status?: LedgerEntryStatus
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  // state
  const [entriesMap, setEntriesMap] =
    React.useState<Map<string | undefined, WithId<LedgerEntry>[]>>(initialMap);
  const [entries, setEntries] = React.useState<WithId<LedgerEntry>[] | null>();
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastEntry, setLastEntry] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastEntry);
  }, [lastEntry]);
  // side effects
  React.useEffect(() => {
    if (start && !end) return;
    setEntriesMap(initialMap);
    setStartAfter(undefined);
  }, [orderId, start, end, status]);
  React.useEffect(() => {
    if (!userCanRead) return;
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.ledger().observeLedger(
      (results, last) => {
        setEntriesMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastEntry(last);
      },
      orderId,
      startDate,
      endDate,
      startAfter,
      status
    );
    return () => unsub();
  }, [api, userCanRead, startAfter, orderId, start, end, status]);
  React.useEffect(() => {
    setEntries(
      Array.from(entriesMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [entriesMap]);
  // return
  return { entries, fetchNextPage };
};
