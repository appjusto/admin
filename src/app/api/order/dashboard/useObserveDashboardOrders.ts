import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../../auth/useUserCanReadEntity';
import {
  findMostFrequentProduct,
  getBusinessOrdersBilling,
  getBusinessOrdersByPeriod,
  getBusinessOrdersCanceledBilling,
  splitOrdersValuesByPeriod,
} from '../utils';
import { DashboardProps, dashboardReducer } from './reducer';

const statuses = ['delivered', 'scheduled', 'canceled'] as OrderStatus[];

export const useObserveDashboardOrders = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[] | null>();
  const [state, dispatch] = React.useReducer(
    dashboardReducer,
    {} as DashboardProps
  );
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
    // today
    const today = dayjs().startOf('day').toDate();
    const todayOrders = getBusinessOrdersByPeriod(orders, today);
    const todayBilling = getBusinessOrdersBilling(todayOrders);
    // today canceled
    const todayCanceled = getBusinessOrdersByPeriod(
      orders,
      today,
      undefined,
      true
    ).filter((order) => order.status === 'canceled');
    const canceledBilling = getBusinessOrdersCanceledBilling(todayCanceled);
    const todayInactivity = todayCanceled.filter((order) =>
      (order.flags ?? []).includes('inactivity')
    );
    const inactivityBilling = getBusinessOrdersCanceledBilling(todayInactivity);
    // month
    const month = dayjs().startOf('month').toDate();
    const monthOrders = getBusinessOrdersByPeriod(orders, month);
    const monthBilling = getBusinessOrdersBilling(monthOrders);
    // month canceled
    const monthCanceled = getBusinessOrdersByPeriod(
      orders,
      month,
      undefined,
      true
    ).filter((order) => order.status === 'canceled');
    const monthCanceledBilling =
      getBusinessOrdersCanceledBilling(monthCanceled);
    const monthInactivity = monthCanceled.filter((order) =>
      (order.flags ?? []).includes('inactivity')
    );
    const monthInactivityBilling =
      getBusinessOrdersCanceledBilling(monthInactivity);
    // current week
    const startWeek = dayjs().startOf('day').subtract(6, 'day').toDate();
    const weekOrders = getBusinessOrdersByPeriod(orders, startWeek);
    const weekBilling = getBusinessOrdersBilling(weekOrders);
    const weekValuesByDay = splitOrdersValuesByPeriod(weekOrders, 7, startWeek);
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
      lastWeekOrders,
      7,
      lastWeekStart
    );
    dispatch({
      type: 'update_dashboard',
      payload: {
        todayCount: todayOrders.length,
        todayValue: todayBilling,
        todayAverage: todayBilling / todayOrders.length,
        todayCanceledCount: todayCanceled.length,
        todayCanceledValue: canceledBilling,
        todayInactivityCount: todayInactivity.length,
        todayInactivityValue: inactivityBilling,
        monthCount: monthOrders.length,
        monthValue: monthBilling,
        monthAverage: monthBilling / monthOrders.length,
        monthCanceledCount: monthCanceled.length,
        monthCanceledValue: monthCanceledBilling,
        monthInactivityCount: monthInactivity.length,
        monthInactivityValue: monthInactivityBilling,
        currentWeekCount: weekOrders.length,
        currentWeekValue: weekBilling,
        currentWeekAverage: weekBilling / weekOrders.length,
        currentWeekProduct: findMostFrequentProduct(currentWeekProducts),
        currentWeekByDay: weekValuesByDay,
        lastWeekCount: lastWeekOrders.length,
        lastWeekValue: lastWeekBilling,
        lastWeekByDay: lastWeekValuesByDay,
      },
    });
  }, [orders]);
  // return
  return state;
};
