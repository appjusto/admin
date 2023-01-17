import { Invoice, InvoiceType, WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import {
  calculateAppJustoCosts,
  calculateIuguCosts,
} from 'pages/finances/utils';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { getInvoicesTotalByTypes, getInvoicesTotalValueByTypes } from './utils';

const invoicesProductTypes = ['products', 'order', 'food'] as InvoiceType[];
const invoicesDeliveryTypes = ['delivery'] as InvoiceType[];

export const useObserveInvoicesStatusByPeriod = (
  businessId?: string,
  month?: Date | null,
  statuses?: IuguInvoiceStatus[]
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[]>();
  const [total, setTotal] = React.useState(0);
  const [periodProductAmount, setPeriodProductAmount] = React.useState(0);
  const [periodDeliveryAmount, setPeriodDeliveryAmount] = React.useState(0);
  const [appjustoCosts, setAppjustoCosts] = React.useState(0);
  const [iuguCosts, setIuguCosts] = React.useState(0);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!month) return;
    if (!statuses) return;
    const start = dayjs(month).startOf('month').toDate();
    const end = dayjs(month).endOf('month').toDate();
    const unsub = api
      .invoices()
      .observeInvoicesStatusesByPeriod(
        businessId,
        start,
        end,
        statuses,
        setInvoices
      );
    return () => unsub();
  }, [api, userCanRead, businessId, month, statuses]);
  React.useEffect(() => {
    if (!invoices) return;
    const amountProducts = getInvoicesTotalValueByTypes(
      invoices,
      invoicesProductTypes
    );
    const amountDelivery = getInvoicesTotalValueByTypes(
      invoices,
      invoicesDeliveryTypes
    );
    const appjusto = calculateAppJustoCosts(invoices);
    const iugu = calculateIuguCosts(invoices);
    const total = getInvoicesTotalByTypes(invoices, invoicesProductTypes);
    setTotal(total);
    setPeriodProductAmount(amountProducts);
    setPeriodDeliveryAmount(amountDelivery);
    setAppjustoCosts(appjusto);
    setIuguCosts(iugu);
  }, [invoices]);
  // return
  return {
    invoices,
    total,
    periodProductAmount,
    periodDeliveryAmount,
    appjustoCosts,
    iuguCosts,
  };
};
