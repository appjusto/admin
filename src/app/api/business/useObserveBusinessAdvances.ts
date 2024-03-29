import { WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { CustomAccountAdvance } from './types';

export const useObserveBusinessAdvances = (
  businessId: string | undefined,
  month: Date | null | undefined
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('advances');
  // state
  const [advances, setAdvances] =
    React.useState<WithId<CustomAccountAdvance>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!month) return;
    const start = dayjs(month).startOf('month').toDate();
    const end = dayjs(month).endOf('month').toDate();
    const unsub = api
      .business()
      .observeBusinessAdvances(businessId, start, end, (result) =>
        setAdvances(result as WithId<CustomAccountAdvance>[])
      );
    return () => unsub();
  }, [api, userCanRead, businessId, month]);
  // return
  return advances;
};
