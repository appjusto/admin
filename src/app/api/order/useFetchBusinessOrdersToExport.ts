import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const statuses = ['delivered', 'scheduled', 'canceled'] as OrderStatus[];

export const useFetchBusinessOrdersToExport = (
  businessId: string | undefined,
  start: string,
  end: string
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!start || !end) return;
    let startDate = dayjs(start).startOf('day').toDate();
    let endDate = dayjs(end).endOf('day').toDate();
    (async () => {
      const result = await api
        .order()
        .fetchBusinessOrdersByPeriod(businessId, statuses, startDate, endDate);
      setOrders(result);
    })();
  }, [api, userCanRead, businessId, start, end]);
  // return
  return orders;
};
