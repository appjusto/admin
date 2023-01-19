import { Dayjs } from '@appjusto/dates';
import { Business, Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useIsBusinessSafe = (business?: WithId<Business> | null) => {
  // context
  const api = useContextApi();
  // state
  const [isSafe, setIsSafe] = React.useState(false);
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  React.useEffect(() => {
    if (!business) return;
    if (business.tags?.includes('safe')) {
      setIsSafe(true);
    } else {
      const startDate = Dayjs()
        .subtract(Dayjs.duration({ days: 30 }))
        .toDate();
      api
        .order()
        .getBusinessDeliveredOrdersByStartDate(
          business.id,
          startDate,
          setOrders
        );
    }
  }, [api, business]);
  React.useEffect(() => {
    if (!orders || orders.length === 0) return;
    setIsSafe(true);
  }, [orders]);
  // return
  return isSafe;
};
