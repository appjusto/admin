import { useContextApi } from 'app/state/api/context';
import { WithId, OrderStatus, Order } from 'appjusto-types';
import React from 'react';
import { orderPeriodFilter, findMostFrequentProduct, splitOrdersValuesByPeriod } from './utils';

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
  // total orders current month + 7 days of las month
  React.useEffect(() => {
    if (!businessId) return;
    let day = new Date().getDate();
    let lastMonth = new Date().getMonth();
    let year = new Date().getFullYear();
    let startDate = new Date(`${year}-${lastMonth}-22 00:00:00`);
    let endDate = new Date(`${year}-${lastMonth + 1}-${day} 23:59:59`);
    let orderStatus = 'delivered' as OrderStatus;
    const unsub = api
      .order()
      .observeDashboardOrders(setOrders, businessId, startDate, endDate, orderStatus);
    return () => unsub();
  }, [api, businessId]);
  // today orders
  React.useEffect(() => {
    if (!orders) return;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as firebase.firestore.Timestamp, today)
    );
    setTodayOrders(todayOrders.length);
    setTodayValue(todayOrders.reduce((result, order) => result + order.fare?.business?.value!, 0));
  }, [orders]);
  // today average
  React.useEffect(() => {
    if (!todayOrders || !todayValue) return;
    setTodayAverage(todayValue / todayOrders);
  }, [todayOrders, todayValue]);
  // month orders
  React.useEffect(() => {
    if (!orders) return;
    let today = new Date();
    let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as firebase.firestore.Timestamp, firstDay)
    );
    setMonthOrders(monthOrders.length);
    setMonthValue(monthOrders.reduce((result, order) => result + order.fare?.business?.value!, 0));
  }, [orders]);
  // month average
  React.useEffect(() => {
    if (!monthOrders || !monthValue) return;
    setMonthAverage(monthValue / monthOrders);
  }, [monthOrders, monthValue]);
  // current week
  React.useEffect(() => {
    if (!orders) return;
    let today = new Date();
    let day = today.getDate() - 6;
    let month = today.getMonth();
    let year = today.getFullYear();
    if (day < 0) {
      month = month - 1;
      let lastDay = new Date(year, month, 0).getDate();
      day = lastDay + day;
    }
    let start = new Date(year, month, day);
    const currentWeekOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as firebase.firestore.Timestamp, start)
    );
    setCurrentWeekOrders(currentWeekOrders.length);
    setCurrentWeekValue(
      currentWeekOrders.reduce((result, order) => result + order.fare?.business?.value!, 0)
    );
    const weekValuesByDay = splitOrdersValuesByPeriod(currentWeekOrders, 7, today.getDate()).map(
      (item) => item.value
    );
    setCurrentWeekByDay(weekValuesByDay);
    let currentWeekProducts = [] as string[];
    currentWeekOrders.forEach((order) =>
      order.items?.forEach((item) => currentWeekProducts.push(item.product.name))
    );
    setCurrentWeekProduct(findMostFrequentProduct(currentWeekProducts));
  }, [orders]);
  // current week average
  React.useEffect(() => {
    if (!currentWeekOrders || !currentWeekValue) return;
    setCurrentWeekAverage(currentWeekValue / currentWeekOrders);
  }, [currentWeekOrders, currentWeekValue]);
  // last week
  React.useEffect(() => {
    if (!orders) return;
    let today = new Date();
    let startDay = today.getDate() - 13;
    let endDay = today.getDate() - 7;
    let month = today.getMonth();
    let year = today.getFullYear();
    if (startDay < 0) {
      month = month - 1;
      let lastDay = new Date(year, month, 0).getDate();
      startDay = lastDay + startDay;
    }
    if (endDay < 0) {
      let lastDay = new Date(year, month, 0).getDate();
      endDay = lastDay + endDay;
    }
    let start = new Date(year, month, startDay);
    let end = new Date(year, month, endDay);
    const lastWeekOrders = orders.filter((order) =>
      orderPeriodFilter(order.updatedOn as firebase.firestore.Timestamp, start, end)
    );
    setLastWeekOrders(lastWeekOrders.length);
    setLastWeekValue(
      lastWeekOrders.reduce((result, order) => result + order.fare?.business?.value!, 0)
    );
    const weekValuesByDay = splitOrdersValuesByPeriod(lastWeekOrders, 7, endDay).map(
      (item) => item.value
    );
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
