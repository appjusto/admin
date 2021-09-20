import { useContextApi } from 'app/state/api/context';
import { AccountAdvance, WithId } from 'appjusto-types';
import React from 'react';
import dayjs from 'dayjs';

export const useObserveBusinessAdvances = (
  businessId: string | undefined,
  month: Date | null | undefined
) => {
  // context
  const api = useContextApi();
  // state
  const [advances, setAdvances] = React.useState<WithId<AccountAdvance>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!month) return;
    const start = dayjs(month).startOf('month').toDate();
    const end = dayjs(month).endOf('month').toDate();
    const unsub = api.business().observeBusinessAdvances(businessId, start, end, setAdvances);
    return () => unsub();
  }, [api, businessId, month]);
  // return
  return advances;
};
