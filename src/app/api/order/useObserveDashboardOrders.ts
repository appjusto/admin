import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { findMostFrequentProduct, orderPeriodFilter, splitOrdersValuesByPeriod } from './utils';

export const useObserveDashboardOrders = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const [todayOrders, setTodayOrders] = React.useState<number>();
  const [todayValue, setTodayValue] = React.useState<number>();
  const [todayAverage, setTodayAverage] = React.useState<number>();
  const [monthOrders, setMonthOrders] = React.useState<number>();
  const [monthValue, setMonthValue] = React.useState<number>();
  const [monthAverage, setMonthAverage] = React.useState<number>();
  const [currentWeekOrders, setCurrentWeekOrders] = React.useState<number>();
  const [currentWeekValue, setCurrentWeekValue] = React.useState<number>();
  const [currentWeekAverage, setCurrentWeekAverage] = React.useState<number>();
  const [currentWeekProduct, setCurrentWeekProduct] = React.useState<string>();
  const [currentWeekByDay, setCurrentWeekByDay] = React.useState<number[]>();
  const [lastWeekOrders, setLastWeekOrders] = React.useState<number>();
  const [lastWeekValue, setLastWeekValue] = React.useState<number>();
  const [lastWeekByDay, setLastWeekByDay] = React.useState<number[]>();
  // side effects
  // total orders current month or last 15 days
  React.useEffect(() => {
    if (!businessId) return;
    const thisDay = dayjs().startOf('day').toDate().getTime();
    const daysBefore = dayjs().date() > 15 ? dayjs().date() - 1 : 14;
    const timeBefore = 1000 * 60 * 60 * 24 * daysBefore;
    const startDate = dayjs(thisDay - timeBefore).toDate();
    const endDate = dayjs().endOf('day').toDate();
    const orderStatus = 'delivered' as OrderStatus;
    const unsub = api
      .order()
      .observeDashboardOrders(setOrders, businessId, startDate, endDate, orderStatus);
    return () => unsub();
  }, [api, businessId]);
  // today orders
  React.useEffect(() => {
    if (!orders) return;
    const today = dayjs().startOf('day').toDate();
    const todayOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as Timestamp, today)
    );
    setTodayOrders(todayOrders.length);
    setTodayValue(todayOrders.reduce((result, order) => result + order.fare?.business?.value!, 0));
  }, [orders]);
  // today average
  React.useEffect(() => {
    if (todayOrders === undefined || todayValue === undefined) return;
    if (todayOrders === 0 || todayValue === 0) return setTodayAverage(0);
    setTodayAverage(todayValue / todayOrders);
  }, [todayOrders, todayValue]);
  // month orders
  React.useEffect(() => {
    if (!orders) return;
    const startDate = dayjs().startOf('month').toDate();
    const monthOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as Timestamp, startDate)
    );
    setMonthOrders(monthOrders.length);
    setMonthValue(monthOrders.reduce((result, order) => result + order.fare?.business?.value!, 0));
  }, [orders]);
  // month average
  React.useEffect(() => {
    if (monthOrders === undefined || monthValue === undefined) return;
    if (monthOrders === 0 || monthValue === 0) return setMonthAverage(0);
    setMonthAverage(monthValue / monthOrders);
  }, [monthOrders, monthValue]);
  // current week
  React.useEffect(() => {
    if (!orders) return;
    const startTime = dayjs().startOf('day').toDate().getTime() - 1000 * 60 * 60 * 24 * 6;
    const startDate = dayjs(startTime).toDate();
    const currentWeekOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as Timestamp, startDate)
    );
    setCurrentWeekOrders(currentWeekOrders.length);
    setCurrentWeekValue(
      currentWeekOrders.reduce((result, order) => result + order.fare?.business?.value!, 0)
    );
    const weekValuesByDay = splitOrdersValuesByPeriod(currentWeekOrders, 7, startDate.getTime());
    setCurrentWeekByDay(weekValuesByDay);
    let currentWeekProducts = [] as string[];
    currentWeekOrders.forEach((order) =>
      order.items?.forEach((item) => currentWeekProducts.push(item.product.name))
    );
    setCurrentWeekProduct(findMostFrequentProduct(currentWeekProducts));
  }, [orders]);
  // current week average
  React.useEffect(() => {
    if (currentWeekOrders === undefined || currentWeekValue === undefined) return;
    if (currentWeekOrders === 0 || currentWeekValue === 0) return setCurrentWeekAverage(0);
    setCurrentWeekAverage(currentWeekValue / currentWeekOrders);
  }, [currentWeekOrders, currentWeekValue]);
  // last week
  React.useEffect(() => {
    if (!orders) return;
    const dayMilliseconds = 1000 * 60 * 60 * 24;
    const todayTime = dayjs().startOf('day').toDate().getTime();
    const startTime = todayTime - dayMilliseconds * 13;
    const endTime = todayTime - dayMilliseconds * 7;
    const startDate = dayjs(startTime).toDate();
    const endDate = dayjs(endTime).toDate();
    const lastWeekOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as Timestamp, startDate, endDate)
    );
    setLastWeekOrders(lastWeekOrders.length);
    setLastWeekValue(
      lastWeekOrders.reduce((result, order) => result + order.fare?.business?.value!, 0)
    );
    const weekValuesByDay = splitOrdersValuesByPeriod(lastWeekOrders, 7, startDate.getTime());
    setLastWeekByDay(weekValuesByDay);
  }, [orders]);
  // return
  return {
    todayOrders,
    todayValue,
    todayAverage,
    monthOrders,
    monthValue,
    monthAverage,
    currentWeekOrders,
    currentWeekValue,
    currentWeekAverage,
    currentWeekByDay,
    currentWeekProduct,
    lastWeekOrders,
    lastWeekValue,
    lastWeekByDay,
  };
};
