import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { getPeriodBalance } from 'pages/finances/utils';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const statuses = ['delivered', 'scheduled', 'canceled'] as OrderStatus[];

interface Balance {
  productsAmount: number;
  deliveryAmount: number;
  iuguCosts: number;
  comission: number;
  extras: number;
  netValue: number;
  ordersNumber: number;
}

export const initialBalance: Balance = {
  productsAmount: 0,
  deliveryAmount: 0,
  iuguCosts: 0,
  comission: 0,
  extras: 0,
  netValue: 0,
  ordersNumber: 0,
};

export const useFetchBusinessOrdersByMonth = (
  businessId: string | undefined,
  currentDate?: Date | null
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  const [balance, setBalance] = React.useState<Balance>({ ...initialBalance });
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!currentDate) return;
    let startDate = dayjs(currentDate).startOf('month').toDate();
    let endDate = dayjs(currentDate).endOf('month').toDate();
    (async () => {
      const orders = await api
        .order()
        .fetchBusinessOrdersByPeriod(businessId, statuses, startDate, endDate);
      setOrders(orders);
    })();
  }, [api, userCanRead, businessId, currentDate]);
  React.useEffect(() => {
    if (!orders) return;
    const periodBalance = getPeriodBalance(orders);
    setBalance(periodBalance);
  }, [orders]);
  // return
  return balance;
};
