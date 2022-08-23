import { Invoice, InvoiceType, WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import {
  calculateAppJustoCosts,
  calculateIuguCosts,
  InvoicesCosts,
} from 'pages/finances/utils';
import React from 'react';
import {
  getInvoicesBusinessTotalValue,
  getInvoicesTotalByTypes,
} from './utils';

const invoicesTypes = ['products', 'order'] as InvoiceType[];

export const useObserveInvoicesStatusByPeriod = (
  businessId?: string,
  month?: Date | null,
  status?: IuguInvoiceStatus
) => {
  // context
  const api = useContextApi();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[]>();
  const [total, setTotal] = React.useState(0);
  const [periodAmount, setPeriodAmount] = React.useState(0);
  const [appjustoCosts, setAppjustoCosts] = React.useState<InvoicesCosts>({
    value: 0,
    fee: 0,
  });
  const [iuguCosts, setIuguCosts] = React.useState<InvoicesCosts>({
    value: 0,
    fee: 0,
  });
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!businessId) return;
    if (!month) return;
    if (!status) return;
    const start = dayjs(month).startOf('month').toDate();
    const end = dayjs(month).endOf('month').toDate();
    const unsub = api
      .order()
      .observeInvoicesStatusByPeriod(
        businessId,
        start,
        end,
        status,
        setInvoices
      );
    return () => unsub();
  }, [api, businessId, month, status]);
  React.useEffect(() => {
    if (!invoices) return;
    const amount = getInvoicesBusinessTotalValue(invoices);
    const appjusto = calculateAppJustoCosts(amount, invoices);
    const iugu = calculateIuguCosts(amount, invoices);
    const total = getInvoicesTotalByTypes(invoices, invoicesTypes);
    setTotal(total);
    setPeriodAmount(amount);
    setAppjustoCosts(appjusto);
    setIuguCosts(iugu);
  }, [invoices]);
  // return
  return { invoices, total, periodAmount, appjustoCosts, iuguCosts };
};
