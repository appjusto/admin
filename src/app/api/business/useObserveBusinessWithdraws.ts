import { AccountWithdraw, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveBusinessWithdraws = (
  businessId: string | undefined,
  month: Date | null | undefined
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('withdraws');
  // state
  const [withdraws, setWithdraws] = React.useState<WithId<AccountWithdraw>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!month) return;
    const start = dayjs(month).startOf('month').toDate();
    const end = dayjs(month).endOf('month').toDate();
    const unsub = api
      .business()
      .observeBusinessWithdraws(businessId, start, end, setWithdraws);
    return () => unsub();
  }, [api, userCanRead, businessId, month]);
  // return
  return withdraws;
};
