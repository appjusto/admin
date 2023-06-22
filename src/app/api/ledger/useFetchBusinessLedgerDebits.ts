import { LedgerEntry, LedgerEntryOperation, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { getLedgerEntriesTotalValueByOperation } from './utils';

const operations = [
  'commission',
  'services-debit',
  'business-refund-debit',
] as LedgerEntryOperation[];

export const useFetchBusinessLedgerDebits = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [entries, setEntries] = React.useState<WithId<LedgerEntry>[]>([]);
  const [comissionDebit, setComissionDebit] = React.useState(0);
  const [refundDebit, setRefundDebit] = React.useState(0);
  const [servicesDebit, setServicesDebit] = React.useState(0);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    (async () => {
      const result = await api
        .ledger()
        .fetchBusinessApprovedLedgersByOperation(businessId, operations);
      setEntries(result);
    })();
  }, [api, businessId]);
  React.useEffect(() => {
    console.log(entries);
    const comission = getLedgerEntriesTotalValueByOperation(
      entries,
      'commission'
    );
    const refund = getLedgerEntriesTotalValueByOperation(
      entries,
      'business-refund-debit'
    );
    const services = getLedgerEntriesTotalValueByOperation(
      entries,
      'services-debit'
    );
    setComissionDebit(comission);
    setRefundDebit(refund);
    setServicesDebit(services);
  }, [entries]);
  // return
  return { entries, comissionDebit, refundDebit, servicesDebit };
};
