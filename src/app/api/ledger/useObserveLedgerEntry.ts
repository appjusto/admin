import { LedgerEntry, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveLedgerEntry = (entryId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  // state
  const [entry, setEntry] = React.useState<WithId<LedgerEntry> | null>();
  // mutations
  const { mutate: submitLedgerEntry, mutationResult: submitLedgerEntryResult } =
    useCustomMutation(
      (data: Partial<LedgerEntry>) => api.ledger().submitLedgerEntry(data),
      'submitLedgerEntry'
    );
  const { mutate: updateLedgerEntry, mutationResult: updateLedgerEntryResult } =
    useCustomMutation(
      (data: { entryId: string; changes: Partial<LedgerEntry> }) =>
        api.ledger().updateLedgerEntry(data.entryId, data.changes),
      'updateLedgerEntry'
    );
  const { mutate: deleteLedgerEntry, mutationResult: deleteLedgerEntryResult } =
    useCustomMutation(
      (entryId: string) => api.ledger().deleteLedgerEntry(entryId),
      'deleteLedgerEntry'
    );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!entryId) return;
    const unsub = api.ledger().observeLedgerEntry(entryId, setEntry);
    return () => unsub();
  }, [api, userCanRead, entryId]);
  // return
  return {
    entry,
    submitLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry,
    submitLedgerEntryResult,
    updateLedgerEntryResult,
    deleteLedgerEntryResult,
  };
};
