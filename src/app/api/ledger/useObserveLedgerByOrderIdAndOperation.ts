import {
  LedgerEntry,
  LedgerEntryOperation,
  LedgerEntryStatus,
  WithId,
} from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { getLedgerEntriesTotalRawValue } from './utils';

const statuses = ['approved', 'processing', 'paid'] as LedgerEntryStatus[];

export const useObserveLedgerByOrderIdAndOperation = (
  businessId?: string,
  orderId?: string,
  operation?: LedgerEntryOperation
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  // state
  const [entries, setEntries] = React.useState<WithId<LedgerEntry>[] | null>();
  const [amount, setAmount] = React.useState(0);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!orderId) return;
    if (!operation) return;
    const unsub = api
      .ledger()
      .observeLedgerByOrderIdAndOperation(
        businessId,
        orderId,
        operation,
        statuses,
        setEntries
      );
    return () => unsub();
  }, [api, userCanRead, businessId, orderId, operation]);
  React.useEffect(() => {
    if (!entries) return;
    const amount = getLedgerEntriesTotalRawValue(entries);
    setAmount(amount);
  }, [entries]);
  // return
  return { entries, amount };
};
