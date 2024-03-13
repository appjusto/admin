import { Coupon, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useGetCoupon = (couponId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [coupon, setCoupon] = React.useState<WithId<Coupon> | null>();
  // side effects
  React.useEffect(() => {
    if (!couponId) return;
    if (couponId === 'new') return;
    (async () => {
      const data = await api.coupon().getCoupon(couponId);
      setCoupon(data);
    })();
  }, [api, couponId]);
  // return
  return coupon;
};
