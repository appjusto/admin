import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import {
  findMostFrequentProduct,
  getBusinessOrdersBilling,
  getBusinessOrdersByPeriod,
  splitOrdersValuesByPeriod,
} from './utils';

const statuses = ['delivered', 'scheduled', 'canceled'] as OrderStatus[];

export const useObserveDashboardOrders = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const [currentWeekProduct, setCurrentWeekProduct] = React.useState<string>();
  // today
  const [todayCount, setTodayCount] = React.useState<number>();
  const [todayValue, setTodayValue] = React.useState<number>();
  const [todayAverage, setTodayAverage] = React.useState<number>();
  // month
  const [monthCount, setMonthCount] = React.useState<number>();
  const [monthValue, setMonthValue] = React.useState<number>();
  const [monthAverage, setMonthAverage] = React.useState<number>();
  // current week
  const [currentWeekCount, setCurrentWeekCount] = React.useState<number>();
  const [currentWeekValue, setCurrentWeekValue] = React.useState<number>();
  const [currentWeekAverage, setCurrentWeekAverage] = React.useState<number>();
  const [currentWeekByDay, setCurrentWeekByDay] = React.useState<number[]>();
  // last week
  const [lastWeekCount, setLastWeekCount] = React.useState<number>();
  const [lastWeekValue, setLastWeekValue] = React.useState<number>();
  const [lastWeekByDay, setLastWeekByDay] = React.useState<number[]>();
  // side effects
  // current week orders
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    const today = dayjs().startOf('day').toDate();
    let startDate: Date;
    if (today.getDate() > 15) {
      startDate = dayjs().startOf('month').toDate();
    } else {
      startDate = dayjs().startOf('day').subtract(14, 'day').toDate();
    }
    const endDate = dayjs().endOf('day').toDate();
    const unsub = api
      .order()
      .observeDashboardOrders(
        setOrders,
        businessId,
        startDate,
        endDate,
        statuses
      );
    return () => unsub();
  }, [api, userCanRead, businessId]);
  React.useEffect(() => {
    if (!orders) return;
    // current week product
    let currentWeekProducts = [] as string[];
    orders.forEach((order) =>
      order.items?.forEach((item) =>
        currentWeekProducts.push(item.product.name)
      )
    );
    setCurrentWeekProduct(findMostFrequentProduct(currentWeekProducts));
    // today
    const today = dayjs().startOf('day').toDate();
    const todayOrders = getBusinessOrdersByPeriod(orders, today);
    const todayBilling = getBusinessOrdersBilling(todayOrders);
    setTodayCount(todayOrders.length);
    setTodayValue(todayBilling);
    setTodayAverage(todayBilling / todayOrders.length);
    // month
    const month = dayjs().startOf('month').toDate();
    const monthOrders = getBusinessOrdersByPeriod(orders, month);
    const monthBilling = getBusinessOrdersBilling(monthOrders);
    setMonthCount(monthOrders.length);
    setMonthValue(monthBilling);
    setMonthAverage(monthBilling / monthOrders.length);
    // current week
    const startWeek = dayjs().startOf('day').subtract(6, 'day').toDate();
    const weekOrders = getBusinessOrdersByPeriod(orders, startWeek);
    const weekBilling = getBusinessOrdersBilling(weekOrders);
    const weekValuesByDay = splitOrdersValuesByPeriod(weekOrders, 7, startWeek);
    setCurrentWeekCount(weekOrders.length);
    setCurrentWeekValue(weekBilling);
    setCurrentWeekAverage(weekBilling / weekOrders.length);
    setCurrentWeekByDay(weekValuesByDay);
    // last week
    const lastWeekStart = dayjs().startOf('day').subtract(13, 'day').toDate();
    const lastWeekEnd = dayjs().startOf('day').subtract(7, 'day').toDate();
    const lastWeekOrders = getBusinessOrdersByPeriod(
      orders,
      lastWeekStart,
      lastWeekEnd
    );
    const lastWeekBilling = getBusinessOrdersBilling(lastWeekOrders);
    const lastWeekValuesByDay = splitOrdersValuesByPeriod(
      weekOrders,
      7,
      lastWeekStart
    );
    setLastWeekCount(lastWeekOrders.length);
    setLastWeekValue(lastWeekBilling);
    setLastWeekByDay(lastWeekValuesByDay);
    // last week
  }, [orders]);
  // return
  return {
    todayCount,
    todayValue,
    todayAverage,
    currentWeekProduct,
    monthCount,
    monthValue,
    monthAverage,
    currentWeekCount,
    currentWeekValue,
    currentWeekAverage,
    currentWeekByDay,
    lastWeekCount,
    lastWeekValue,
    lastWeekByDay,
  };
};
