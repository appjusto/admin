import { Invoice, InvoiceType, WithId } from '@appjusto/types';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

export const invoicesPeriodFilter = (
  invoices: WithId<Invoice>[],
  start: Date,
  end?: Date
) => {
  return invoices.filter((invoice) => {
    const baseTime = (invoice.createdOn as Timestamp).toDate();
    if (!end) return dayjs(baseTime).isAfter(start);
    else return dayjs(baseTime).isAfter(start) && dayjs(baseTime).isBefore(end);
  });
};

export const getInvoicesTotalByTypes = (
  invoices: WithId<Invoice>[],
  types: InvoiceType[]
) => {
  const filtered = invoices.filter((invoice) =>
    types.includes(invoice.invoiceType)
  );
  return filtered.length;
};

export const getInvoicesTotalValueByTypes = (
  invoices: WithId<Invoice>[],
  types: InvoiceType[]
) => {
  return invoices.reduce((result, invoice) => {
    if (types.includes(invoice.invoiceType)) {
      const value = invoice.fare.value ?? 0;
      return result + value;
    }
    return result;
  }, 0);
};

export interface ItemByDay {
  date: number;
  value: number;
}

export const splitInvoicesValuesByPeriod = (
  invoices: WithId<Invoice>[],
  periodNumber: number,
  startDate: Date // milliseconds
) => {
  let period = [] as ItemByDay[];
  for (let i = 0; i < periodNumber; i++) {
    const date = dayjs(startDate).add(i, 'day').date();
    period.push({ date, value: 0 });
  }
  invoices.forEach((invoice) => {
    if (['products', 'order'].includes(invoice.invoiceType)) {
      const date = (invoice.updatedOn as Timestamp).toDate().getDate();
      let item = period.find((item) => item.date === date);
      if (item) item.value += 1;
    }
  });
  return period.map((item) => item.value);
};
