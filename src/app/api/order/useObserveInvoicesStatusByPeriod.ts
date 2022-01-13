import { useContextApi } from 'app/state/api/context';
import { WithId, Invoice } from 'appjusto-types';
import React from 'react';
import { IuguInvoiceStatus } from 'appjusto-types/payment/iugu';
import dayjs from 'dayjs';

export const useObserveInvoicesStatusByPeriod = (
  businessId?: string,
  month?: Date | null,
  status?: IuguInvoiceStatus
) => {
  // context
  const api = useContextApi();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[]>();
  const [periodAmount, setPeriodAmount] = React.useState(0);
  const [appjustoFee, setAppjustoFee] = React.useState(0);
  const [iuguFee, setIuguFee] = React.useState(0);
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
      .observeInvoicesStatusByPeriod(businessId, start, end, status, setInvoices);
    return () => unsub();
  }, [api, businessId, month, status]);
  React.useEffect(() => {
    if (!invoices) return;
    const amount = invoices.reduce((total, invoice) => {
      return (total += invoice.value ?? 0);
    }, 0);
    const appjusto = invoices.reduce((total, invoice) => {
      const commission = invoice.commission ? invoice.commission - 9 : 0;
      return (total += commission);
    }, 0);
    const iugu = invoices.length * 9 + amount * 0.0221;
    setPeriodAmount(amount);
    setAppjustoFee(appjusto);
    setIuguFee(iugu);
  }, [invoices]);
  // return
  return { invoices, periodAmount, appjustoFee, iuguFee };
};
