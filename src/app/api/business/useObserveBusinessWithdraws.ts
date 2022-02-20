import { useContextApi } from 'app/state/api/context';
import { AccountWithdraw, WithId } from '@appjusto/types';
import React from 'react';
import dayjs from 'dayjs';

export const useObserveBusinessWithdraws = (
  businessId: string | undefined,
  month: Date | null | undefined
) => {
  // context
  const api = useContextApi();
  // state
  const [withdraws, setWithdraws] = React.useState<WithId<AccountWithdraw>[]>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!month) return;
    const start = dayjs(month).startOf('month').toDate();
    const end = dayjs(month).endOf('month').toDate();
    const unsub = api.business().observeBusinessWithdraws(businessId, start, end, setWithdraws);
    return () => unsub();
  }, [api, businessId, month]);
  // return
  return withdraws;
};
