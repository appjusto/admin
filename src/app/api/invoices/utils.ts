import { Invoice, WithId } from '@appjusto/types';
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

export const getInvoicesBusinessTotalValue = (invoices: WithId<Invoice>[]) => {
  return invoices.reduce((result, invoice) => {
    const deliveryCosts = invoice.deliveryCosts ?? 0;
    return result + invoice.value - deliveryCosts;
  }, 0);
};

export const findMostFrequentProduct = (products: string[]) => {
  if (products.length === 0) return 'N/E';
  let compare = '';
  let mostFreq = '';
  products.reduce((acc, val) => {
    if (val in acc) {
      //@ts-ignore
      acc[val]++;
    } else {
      //@ts-ignore
      acc[val] = 1;
    }
    //@ts-ignore
    if (acc[val] > compare) {
      //@ts-ignore
      compare = acc[val];
      mostFreq = val;
    }
    return acc;
  }, {});
  return mostFreq;
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
    const date = (invoice.updatedOn as Timestamp).toDate().getDate();
    let item = period.find((item) => item.date === date);
    if (item) item.value += 1;
  });
  return period.map((item) => item.value);
};
