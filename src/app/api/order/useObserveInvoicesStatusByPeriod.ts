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
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  const [periodAmount, setPeriodAmount] = React.useState<number | null>();
  const [appjustoFee, setAppjustoFee] = React.useState<number | null>();
  const [iuguFee, setIuguFee] = React.useState<number | null>();
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
    if (invoices === undefined) return;
    if (invoices === null) {
      setPeriodAmount(null);
      return;
    }
    const amount = invoices.reduce((total, invoice) => {
      return (total += invoice.value ?? 0);
    }, 0);
    const appjusto = invoices.reduce((total, invoice) => {
      return (total += invoice.commission ?? 0);
    }, 0);
    const iugu = invoices.length * 9 + amount * 0.0221;
    setPeriodAmount(amount);
    setAppjustoFee(appjusto);
    setIuguFee(iugu);
    console.log(invoices);
  }, [invoices]);
  // return
  return { invoices, periodAmount, appjustoFee, iuguFee };
};
