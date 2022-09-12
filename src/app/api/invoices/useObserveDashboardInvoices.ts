import { Invoice, InvoiceType, WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import {
  getInvoicesTotalByTypes,
  getInvoicesTotalValueByTypes,
  invoicesPeriodFilter,
  splitInvoicesValuesByPeriod,
} from './utils';

const invoiceStatuses = [
  'paid',
  'partially_refunded',
  'partially_paid',
] as IuguInvoiceStatus[];
const invoicesTypes = ['products', 'order', 'delivery'] as InvoiceType[];
const invoicesProductTypes = ['products', 'order'] as InvoiceType[];

export const useObserveDashboardInvoices = (businessId?: string | null) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
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
    if (!userCanRead) return;
    if (!businessId) return;
    const daysBefore = dayjs().date() > 15 ? dayjs().date() - 1 : 14;
    const startDate = dayjs()
      .subtract(daysBefore, 'day')
      .startOf('day')
      .toDate();
    const endDate = dayjs().endOf('day').toDate();
    const unsub = api
      .invoices()
      .observeDashboardInvoices(
        setInvoices,
        businessId,
        startDate,
        endDate,
        invoiceStatuses
      );
    return () => unsub();
  }, [api, userCanRead, businessId]);
  // today invoices
  React.useEffect(() => {
    if (!invoices) return;
    const today = dayjs().startOf('day').toDate();
    const todayInvoices = invoicesPeriodFilter(invoices, today);
    const total = getInvoicesTotalByTypes(todayInvoices, invoicesProductTypes);
    setTodayInvoices(total);
    const todayTotal = getInvoicesTotalValueByTypes(
      todayInvoices,
      invoicesTypes
    );
    setTodayValue(todayTotal);
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
    const monthInvoices = invoicesPeriodFilter(invoices, startDate);
    const total = getInvoicesTotalByTypes(monthInvoices, invoicesProductTypes);
    setMonthInvoices(total);
    const monthTotal = getInvoicesTotalValueByTypes(
      monthInvoices,
      invoicesTypes
    );
    setMonthValue(monthTotal);
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
    const currentWeekInvoices = invoicesPeriodFilter(invoices, startDate);
    const total = getInvoicesTotalByTypes(
      currentWeekInvoices,
      invoicesProductTypes
    );
    setCurrentWeekInvoices(total);
    const weekValue = getInvoicesTotalValueByTypes(
      currentWeekInvoices,
      invoicesTypes
    );
    setCurrentWeekValue(weekValue);
    const weekValuesByDay = splitInvoicesValuesByPeriod(
      currentWeekInvoices,
      7,
      startDate
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
    const lastWeekInvoices = invoicesPeriodFilter(invoices, startDate, endDate);
    const total = getInvoicesTotalByTypes(
      lastWeekInvoices,
      invoicesProductTypes
    );
    setLastWeekInvoices(total);
    const lastWeekValue = getInvoicesTotalValueByTypes(
      lastWeekInvoices,
      invoicesTypes
    );
    setLastWeekValue(lastWeekValue);
    const weekValuesByDay = splitInvoicesValuesByPeriod(
      lastWeekInvoices,
      7,
      startDate
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
