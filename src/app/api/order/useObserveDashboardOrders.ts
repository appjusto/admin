import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { findMostFrequentProduct } from './utils';

const orderStatus = 'delivered' as OrderStatus;

export const useObserveDashboardOrders = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const [currentWeekProduct, setCurrentWeekProduct] = React.useState<string>();
  // side effects
  // current week orders
  React.useEffect(() => {
    if (!businessId) return;
    const thisDay = dayjs().startOf('day').toDate().getTime();
    const timeBefore = 1000 * 60 * 60 * 24 * 6;
    const startDate = dayjs(thisDay - timeBefore).toDate();
    const endDate = dayjs().endOf('day').toDate();
    const unsub = api
      .order()
      .observeDashboardOrders(setOrders, businessId, startDate, endDate, orderStatus);
    return () => unsub();
  }, [api, businessId]);
  // current week product
  React.useEffect(() => {
    if (!orders) return;
    let currentWeekProducts = [] as string[];
    orders.forEach((order) =>
      order.items?.forEach((item) => currentWeekProducts.push(item.product.name))
    );
    setCurrentWeekProduct(findMostFrequentProduct(currentWeekProducts));
  }, [orders]);
  // return
  return { currentWeekProduct };
};
