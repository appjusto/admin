import { LedgerEntry, LedgerEntryStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { InvoicesCosts } from 'pages/finances/utils';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { getLedgerEntriesTotalValue } from './utils';

export const useObserveLedgerStatusByPeriod = (
  businessId?: string,
  month?: Date | null,
  statuses?: LedgerEntryStatus[]
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  // state
  const [entries, setEntries] = React.useState<WithId<LedgerEntry>[] | null>();
  const [periodAmount, setPeriodAmount] = React.useState(0);
  const [iuguCosts, setIuguCosts] = React.useState<InvoicesCosts>({
    value: 0,
    fee: 0,
  });
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!month) return;
    if (!statuses) return;
    const start = dayjs(month).startOf('month').toDate();
    const end = dayjs(month).endOf('month').toDate();
    const unsub = api
      .ledger()
      .observeBusinessLedgerByPeriod(
        setEntries,
        businessId,
        statuses,
        start,
        end
      );
    return () => unsub();
  }, [api, userCanRead, businessId, month, statuses]);
  React.useEffect(() => {
    if (!entries) return;
    const amount = getLedgerEntriesTotalValue(entries);
    setPeriodAmount(amount);
    // TODO: iugu costs
  }, [entries]);
  // return
  return { periodAmount, iuguCosts };
};
