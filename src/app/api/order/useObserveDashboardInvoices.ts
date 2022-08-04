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
  const [currentWeekInvoices, setCurrentWeekInvoices] =
    React.useState<number>();
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
    const daysBefore = dayjs().date() > 15 ? dayjs().date() - 1 : 14;
    const startDate = dayjs()
      .subtract(daysBefore, 'day')
      .startOf('day')
      .toDate();
    const endDate = dayjs().endOf('day').toDate();
    const unsub = api
      .order()
      .observeDashboardInvoices(
        setInvoices,
        businessId,
        startDate,
        endDate,
        invoiceStatus
      );
    return () => unsub();
  }, [api, businessId]);
  // today invoices
  React.useEffect(() => {
    if (!invoices) return;
    const today = dayjs().startOf('day').toDate();
    const todayInvoices = invoices.filter((invoice) =>
      dayjs((invoice.createdOn as Timestamp).toDate()).isAfter(today)
    );
    setTodayInvoices(todayInvoices.length);
    setTodayValue(
      todayInvoices.reduce((result, invoice) => result + invoice.value!, 0)
    );
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
    const monthInvoices = invoices.filter((invoice) =>
      dayjs((invoice.createdOn as Timestamp).toDate()).isAfter(startDate)
    );
    setMonthInvoices(monthInvoices.length);
    setMonthValue(
      monthInvoices.reduce((result, invoice) => result + invoice.value!, 0)
    );
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
    const startDate = dayjs().startOf('day').subtract(6, 'day').toDate();
    const currentWeekInvoices = invoices.filter((invoice) =>
      objectPeriodFilter(invoice.updatedOn as Timestamp, startDate)
    );
    setCurrentWeekInvoices(currentWeekInvoices.length);
    setCurrentWeekValue(
      currentWeekInvoices.reduce(
        (result, invoice) => result + invoice.value!,
        0
      )
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
    if (currentWeekInvoices === undefined || currentWeekValue === undefined)
      return;
    if (currentWeekInvoices === 0 || currentWeekValue === 0)
      return setCurrentWeekAverage(0);
    setCurrentWeekAverage(currentWeekValue / currentWeekInvoices);
  }, [currentWeekInvoices, currentWeekValue]);
  // last week
  React.useEffect(() => {
    if (!invoices) return;
    const startDate = dayjs().startOf('day').subtract(13, 'day').toDate();
    const endDate = dayjs().startOf('day').subtract(7, 'day').toDate();
    const lastWeekInvoices = invoices.filter((order) =>
      objectPeriodFilter(order.updatedOn as Timestamp, startDate, endDate)
    );
    setLastWeekInvoices(lastWeekInvoices.length);
    setLastWeekValue(
      lastWeekInvoices.reduce((result, invoice) => result + invoice.value!, 0)
    );
    const weekValuesByDay = splitInvoicesValuesByPeriod(
      lastWeekInvoices,
      7,
      startDate.getTime()
    );
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
