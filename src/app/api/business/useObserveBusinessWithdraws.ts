import { useContextApi } from 'app/state/api/context';
import { AccountWithdraw, WithId } from 'appjusto-types';
import React from 'react';
import dayjs from 'dayjs';

export const useObserveBusinessWithdraws = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [withdraws, setWithdraws] = React.useState<WithId<AccountWithdraw>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const today = new Date();
    const start = dayjs(today).startOf('month').toDate();
    const end = dayjs(today).endOf('month').toDate();
    console.log('start', start);
    console.log('end', end);
    const unsub = api.business().observeBusinessWithdraws(businessId, start, end, setWithdraws);
    return () => unsub();
  }, [api, businessId]);
  // return
  return withdraws;
};
