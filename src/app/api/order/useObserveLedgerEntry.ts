import { LedgerEntry, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveLedgerEntry = (entryId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [entry, setEntry] = React.useState<WithId<LedgerEntry> | null>();
  // side effects
  React.useEffect(() => {
    if (!entryId) return;
    const unsub = api.order().observeLedgerEntry(entryId, setEntry);
    return () => unsub();
  }, [api, entryId]);
  // return
  return entry;
};
