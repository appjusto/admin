import { LedgerEntry, LedgerEntryStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import {
  getLedgerEntriesIuguTotalValue,
  getLedgerEntriesTotalValue,
} from './utils';

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
  const [deliveryAmount, setDeliveryAmount] = React.useState(0);
  const [insuranceAmount, setInsuranceAmount] = React.useState(0);
  const [iuguValue, setIuguValue] = React.useState(0);
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
    const deliveryEntries = entries.filter(
      (entry) => entry.operation === 'delivery'
    );
    const insuranceEntries = entries.filter(
      (entry) => entry.operation === 'business-insurance'
    );
    const deliveryTotal = getLedgerEntriesTotalValue(deliveryEntries);
    const iugu = getLedgerEntriesIuguTotalValue(deliveryEntries);
    const insuranceTotal = getLedgerEntriesTotalValue(insuranceEntries);
    setDeliveryAmount(deliveryTotal);
    setInsuranceAmount(insuranceTotal);
    setIuguValue(iugu);
    // TODO: iugu costs
  }, [entries]);
  // return
  return { deliveryAmount, iuguValue, insuranceAmount };
};
