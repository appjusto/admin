import { Invoice, WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { objectPeriodFilter, splitInvoicesValuesByPeriod } from './utils';

const invoiceStatus = 'paid' as IuguInvoiceStatus;

export const useObserveDashboardInvoices = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  const [todayInvoices, setTodayInvoices] = React.useState<number>();
  const [todayValue, setTodayValue] = React.useState<number>();
  const [todayAverage, setTodayAverage] = React.useState<number>();
  const [monthInvoices, setMonthInvoices] = React.useState<number>();
  const [monthValue, setMonthValue] = React.useState<number>();
  const [monthAverage, setMonthAverage] = React.useState<number>();
  const [currentWeekInvoices, setCurrentWeekInvoices] = React.useState<number>();
  const [currentWeekValue, setCurrentWeekValue] = React.useState<number>();
  const [currentWeekAverage, setCurrentWeekAverage] = React.useState<number>();
  const [currentWeekByDay, setCurrentWeekByDay] = React.useState<number[]>();
  const [lastWeekInvoices, setLastWeekInvoices] = React.useState<number>();
  const [lastWeekValue, setLastWeekValue] = React.useState<number>();
  const [lastWeekByDay, setLastWeekByDay] = React.useState<number[]>();
  // side effects
  // total invoices current month or last 15 days
  React.useEffect(() => {
    if (!businessId) return;
    const thisDay = dayjs().startOf('day').toDate().getTime();
    const daysBefore = dayjs().date() > 15 ? dayjs().date() - 1 : 14;
    const timeBefore = 1000 * 60 * 60 * 24 * daysBefore;
    const startDate = dayjs(thisDay - timeBefore).toDate();
    const endDate = dayjs().endOf('day').toDate();
    const unsub = api
      .order()
      .observeDashboardInvoices(setInvoices, businessId, startDate, endDate, invoiceStatus);
    return () => unsub();
  }, [api, businessId]);
  // today invoices
  React.useEffect(() => {
    if (!invoices) return;
    const today = dayjs().startOf('day').toDate();
    const todayInvoices = invoices.filter((invoice) =>
      objectPeriodFilter(invoice.updatedOn as Timestamp, today)
    );
    setTodayInvoices(todayInvoices.length);
    setTodayValue(todayInvoices.reduce((result, invoice) => result + invoice.value!, 0));
  }, [invoices]);
  // today average
  React.useEffect(() => {
    if (todayInvoices === undefined || todayValue === undefined) return;
    if (todayInvoices === 0 || todayValue === 0) return setTodayAverage(0);
    setTodayAverage(todayValue / todayInvoices);
  }, [todayInvoices, todayValue]);
  // month invoices
  React.useEffect(() => {
    if (!invoices) return;
    const startDate = dayjs().startOf('month').toDate();
    const monthInvoices = invoices.filter((invoices) =>
      objectPeriodFilter(invoices.updatedOn as Timestamp, startDate)
    );
    setMonthInvoices(monthInvoices.length);
    setMonthValue(monthInvoices.reduce((result, invoice) => result + invoice.value!, 0));
  }, [invoices]);
  // month average
  React.useEffect(() => {
    if (monthInvoices === undefined || monthValue === undefined) return;
    if (monthInvoices === 0 || monthValue === 0) return setMonthAverage(0);
    setMonthAverage(monthValue / monthInvoices);
  }, [monthInvoices, monthValue]);
  // current week invoices
  React.useEffect(() => {
    if (!invoices) return;
    const startTime = dayjs().startOf('day').toDate().getTime() - 1000 * 60 * 60 * 24 * 6;
    const startDate = dayjs(startTime).toDate();
    const currentWeekInvoices = invoices.filter((invoice) =>
      objectPeriodFilter(invoice.updatedOn as Timestamp, startDate)
    );
    setCurrentWeekInvoices(currentWeekInvoices.length);
    setCurrentWeekValue(
      currentWeekInvoices.reduce((result, invoice) => result + invoice.value!, 0)
    );
    const weekValuesByDay = splitInvoicesValuesByPeriod(
      currentWeekInvoices,
      7,
      startDate.getTime()
    );
    setCurrentWeekByDay(weekValuesByDay);
  }, [invoices]);
  // current week average
  React.useEffect(() => {
    if (currentWeekInvoices === undefined || currentWeekValue === undefined) return;
    if (currentWeekInvoices === 0 || currentWeekValue === 0) return setCurrentWeekAverage(0);
    setCurrentWeekAverage(currentWeekValue / currentWeekInvoices);
  }, [currentWeekInvoices, currentWeekValue]);
  // last week
  React.useEffect(() => {
    if (!invoices) return;
    const dayMilliseconds = 1000 * 60 * 60 * 24;
    const todayTime = dayjs().startOf('day').toDate().getTime();
    const startTime = todayTime - dayMilliseconds * 13;
    const endTime = todayTime - dayMilliseconds * 7;
    const startDate = dayjs(startTime).toDate();
    const endDate = dayjs(endTime).toDate();
    const lastWeekInvoices = invoices.filter((order) =>
      objectPeriodFilter(order.updatedOn as Timestamp, startDate, endDate)
    );
    setLastWeekInvoices(lastWeekInvoices.length);
    setLastWeekValue(lastWeekInvoices.reduce((result, invoice) => result + invoice.value!, 0));
    const weekValuesByDay = splitInvoicesValuesByPeriod(lastWeekInvoices, 7, startDate.getTime());
    setLastWeekByDay(weekValuesByDay);
  }, [invoices]);
  // return
  return {
    todayInvoices,
    todayValue,
    todayAverage,
    monthInvoices,
    monthValue,
    monthAverage,
    currentWeekInvoices,
    currentWeekValue,
    currentWeekAverage,
    currentWeekByDay,
    lastWeekInvoices,
    lastWeekValue,
    lastWeekByDay,
  };
};
