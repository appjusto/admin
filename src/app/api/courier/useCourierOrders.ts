import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useCourierOrders = (
  courierId?: string | null,
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!courierId || !start || !end) return; // during initialization
    let startDate = dayjs(start).startOf('day').toDate();
    let endDate = dayjs(end).endOf('day').toDate();
    const unsub = api
      .order()
      .observeOrdersByCourierId(
        courierId!,
        setOrders,
        undefined,
        startDate,
        endDate
      );
    return () => unsub();
  }, [api, userCanRead, courierId, start, end]);
  // return
  return orders;
};
