import {
  Order,
  OrderStatusTimestamps,
  PayableWith,
  WithId,
} from '@appjusto/types';
import dayjs from 'dayjs';
import { FieldValue, Timestamp } from 'firebase/firestore';

export const ordersScheduledDayFilter = (
  orders: WithId<Order>[],
  filterDate?: Date
) => {
  try {
    const comparator = filterDate ? filterDate : dayjs();
    return orders.filter((order) => {
      const scheduledTo = (order.scheduledTo as Timestamp).toDate();
      return dayjs(scheduledTo).isSame(comparator, 'day');
    });
  } catch (error) {
    console.error(error);
    return [] as WithId<Order>[];
  }
};

export const getScheduledStartTime = (
  scheduledTo?: FieldValue | null,
  cookingTime?: number | null
) => {
  if (!scheduledTo || !cookingTime) return null;
  try {
    const scheduledToDate = (scheduledTo as Timestamp).toDate();
    const startAt = dayjs(scheduledToDate)
      .subtract(cookingTime, 'second')
      .toDate();
    return startAt;
  } catch (error) {
    console.error(error);
  }
};

export const isScheduledMarginValid = (
  scheduledTo?: FieldValue | null,
  margin: number = 3600
) => {
  if (!scheduledTo) return false;
  try {
    const scheduledToDate = (scheduledTo as Timestamp).toDate();
    const now = dayjs().toDate();
    const startAt = dayjs(scheduledToDate).subtract(margin, 'second').toDate();
    return now > startAt;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getDatePlusTime = (
  dateValue?: FieldValue | null,
  time: number = 3600
) => {
  if (!dateValue) return undefined;
  try {
    const date = (dateValue as Timestamp).toDate();
    return dayjs(date).add(time, 'second').toDate();
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const isToday = (dateValue?: FieldValue | null) => {
  if (!dateValue) return undefined;
  try {
    const date = (dateValue as Timestamp).toDate();
    return dayjs().startOf('day').isSame(dayjs(date).startOf('day'));
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getOrderDestinationNeighborhood = (secondary?: string) => {
  if (!secondary) return 'N/E';
  const neighborhood = secondary.split(',')[0];
  return neighborhood;
};

export const getOrderPaymentChannel = (
  paymentMethod?: PayableWith
): 'online' | 'offline' => {
  if (
    paymentMethod &&
    (
      ['cash', 'business-credit-card', 'business-debit-card'] as PayableWith[]
    ).includes(paymentMethod)
  ) {
    return 'offline';
  }
  return 'online';
};

export const getSafeOrderStartTimestamp = (
  timestamps: OrderStatusTimestamps,
  isScheduled?: boolean
) => {
  const { confirming, charged, confirmed } = timestamps;
  // scheduled orders
  if (isScheduled && confirmed) return confirmed;
  // orders with online payment (and fraud prevention)
  if (charged) return charged;
  // orders with offline payment
  if (confirmed) return confirmed;
  // fallback
  return confirming;
};
