import { LedgerEntry, LedgerEntryStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';

const statuses = ['paid'] as LedgerEntryStatus[];

export const useFetchBusinessLedgerByPeriod = (
  businessId: string | undefined,
  start: string,
  end: string
) => {
  // context
  const api = useContextApi();
  // state
  const [entries, setEntries] = React.useState<WithId<LedgerEntry>[]>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!start || !end) return;
    let startDate = dayjs(start).startOf('day').toDate();
    let endDate = dayjs(end).endOf('day').toDate();
    (async () => {
      const result = await api
        .ledger()
        .fetchBusinessLedgerByPeriod(businessId, statuses, startDate, endDate);
      setEntries(result);
    })();
  }, [api, businessId, start, end]);
  // return
  return entries;
};
