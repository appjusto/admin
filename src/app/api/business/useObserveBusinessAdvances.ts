import { useContextApi } from 'app/state/api/context';
import { AccountAdvance, WithId } from 'appjusto-types';
import React from 'react';
import dayjs from 'dayjs';

export const useObserveBusinessAdvances = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [advances, setAdvances] = React.useState<WithId<AccountAdvance>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const today = new Date();
    const start = dayjs(today).startOf('month').toDate();
    const end = dayjs(today).endOf('month').toDate();
    console.log('start', start);
    console.log('end', end);
    const unsub = api.business().observeBusinessAdvances(businessId, start, end, setAdvances);
    return () => unsub();
  }, [api, businessId]);
  // return
  return advances;
};
