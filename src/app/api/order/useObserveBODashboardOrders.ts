import { useContextApi } from 'app/state/api/context';
import { WithId, Order } from 'appjusto-types';
import React from 'react';
import dayjs from 'dayjs';

export const useObserveBODashboardOrders = () => {
  // context
  const api = useContextApi();
  // state
  const [date, setDate] = React.useState(new Date());
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const [todayOrders, setTodayOrders] = React.useState<number>();
  const [todayValue, setTodayValue] = React.useState<number>();
  const [todayAverage, setTodayAverage] = React.useState<number>();
  // side effects
  React.useEffect(() => {
    const unsub = api
      .order()
      .observeBODashboardOrders(setOrders, dayjs(date).startOf('day').toDate());
    return () => unsub();
  }, [api, date]);
  React.useEffect(() => {
    const diff = dayjs(date).add(1, 'day').diff(date);
    const interval = setTimeout(() => setDate(new Date()), diff);
    return () => clearInterval(interval);
  }, [date]);
  // orders's number and total value
  React.useEffect(() => {
    if (!orders) return;
    setTodayOrders(orders.length);
    setTodayValue(
      orders.reduce((result, order) => {
        if (order.fare?.total) return result + order.fare.total;
        else return result;
      }, 0)
    );
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
