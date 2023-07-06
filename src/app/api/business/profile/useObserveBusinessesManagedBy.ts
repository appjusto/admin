import { Business, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { BusinessUnit } from '../types';

export const useObserveBusinessesManagedBy = (
  email?: string | null,
  businessId?: string | null,
  isBackofficeUser?: boolean | null
) => {
  // contex
  const api = useContextApi();
  // state
  const [current, setCurrent] = React.useState<WithId<Business> | null>();
  const [businessUnits, setBusinessUnits] = React.useState<
    BusinessUnit[] | null
  >();
  // side effects
  React.useEffect(() => {
    if (!email) return; // during initialization
    if (isBackofficeUser !== false) return; // during initialization
    const unsub = api.business().observeBusinessesManagedBy(
      email,
      ({ current, units }) => {
        setCurrent(current);
        setBusinessUnits(units);
      },
      businessId
    );
    return () => unsub();
  }, [api, email, businessId, isBackofficeUser]);
  // return
  return { current, businessUnits };
};
