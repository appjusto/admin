import { useContextApi } from 'app/state/api/context';
import { WithId, Order, OrderStatus } from 'appjusto-types';
import React from 'react';
import dayjs from 'dayjs';

const statuses = [
  'declined',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
  'delivered',
  'canceled',
] as OrderStatus[];

export const useObserveBODashboardOrders = () => {
  // context
  const api = useContextApi();
  // state
  const [date, setDate] = React.useState(new Date());
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const [todayOrders, setTodayOrders] = React.useState<number>();
  const [todayDeliveredOrders, setTodayDeliveredOrders] = React.useState<number>();
  const [todayValue, setTodayValue] = React.useState<number>();
  const [todayAverage, setTodayAverage] = React.useState<number>();
  // side effects
  React.useEffect(() => {
    const unsub = api
      .order()
      .observeBODashboardOrders(statuses, setOrders, dayjs(date).startOf('day').toDate());
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
    const delivered = orders.filter((order) => order.status === 'delivered');
    setTodayOrders(orders.length);
    setTodayDeliveredOrders(delivered.length);
    setTodayValue(
      delivered.reduce((result, order) => {
        if (order.fare?.total) return result + order.fare.total;
        else return result;
      }, 0)
    );
  }, [orders]);
  // orders average
  React.useEffect(() => {
    if (todayDeliveredOrders === undefined || todayValue === undefined) return;
    if (todayDeliveredOrders === 0 || todayValue === 0) return setTodayAverage(0);
    setTodayAverage(todayValue / todayDeliveredOrders);
  }, [todayDeliveredOrders, todayValue]);
  // return
  return {
    todayOrders,
    todayDeliveredOrders,
    todayValue,
    todayAverage,
  };
};
