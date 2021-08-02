import { useContextApi } from 'app/state/api/context';
import { WithId, Order } from 'appjusto-types';
import React from 'react';

export const useObserveBODashboardOrders = () => {
  // context
  const api = useContextApi();
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const [todayOrders, setTodayOrders] = React.useState<number>();
  const [todayValue, setTodayValue] = React.useState<number>();
  const [todayAverage, setTodayAverage] = React.useState<number>();
  // side effects
  React.useEffect(() => {
    let today = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let startDate = new Date(`${year}-${month}-${today} 00:00:00`);
    const unsub = api.order().observeBODashboardOrders(setOrders, startDate);
    return () => unsub();
  }, [api]);
  // orders's number and total value
  React.useEffect(() => {
    if (!orders) return;
    setTodayOrders(orders.length);
    setTodayValue(orders.reduce((result, order) => result + order.fare?.total!, 0));
  }, [orders]);
  // orders average
  React.useEffect(() => {
    if (todayOrders === undefined || todayValue === undefined) return;
    if (todayOrders === 0 || todayValue === 0) return setTodayAverage(0);
    setTodayAverage(todayValue / todayOrders);
  }, [todayOrders, todayValue]);
  // return
  return {
    todayOrders,
    todayValue,
    todayAverage,
  };
};
