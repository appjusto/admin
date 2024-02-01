import { LedgerEntry, LedgerEntryStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';

export const useFetchBusinessSubscriptionByPeriod = (
  businessId: string | undefined,
  month: Date | null
) => {
  // context
  const api = useContextApi();
  // state
  const [entries, setEntries] = React.useState<WithId<LedgerEntry>[]>();
  const [subscription, setSubscription] = React.useState(0);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!month) return;
    let startDate = dayjs(month).startOf('month').toDate();
    let endDate = dayjs(month).endOf('month').toDate();
    (async () => {
      const result = await api
        .ledger()
        .fetchBusinessSubscriptionLedgerByPeriod(
          businessId,
          startDate,
          endDate
        );
      setEntries(result);
    })();
  }, [api, businessId, month]);

  React.useEffect(() => {
    if (!entries?.length) {
      setSubscription(0);
      return;
    }
    const entry = entries[0];
    if (
      entry &&
      (['processing', 'approved', 'paid'] as LedgerEntryStatus[]).includes(
        entry.status
      )
    ) {
      setSubscription(entry.value);
    }
  }, [entries]);
  // return
  return subscription;
};
