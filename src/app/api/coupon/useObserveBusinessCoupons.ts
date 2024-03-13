import { Coupon, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBusinessCoupons = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [coupons, setCoupons] = React.useState<WithId<Coupon>[]>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.coupon().observeBusinessCoupons(businessId, setCoupons);
    return () => unsub();
  }, [api, businessId]);
  // return
  return coupons;
};
