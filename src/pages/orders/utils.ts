import { Order, WithId } from "@appjusto/types";
import dayjs from "dayjs";
import { FieldValue, Timestamp } from "firebase/firestore";

export const ordersScheduledDayFilter = (orders: WithId<Order>[], filterDate?: Date) => {
  try {
    const comparator = filterDate ? filterDate : dayjs();
    return orders.filter(order => {
      const scheduledTo = (order.scheduledTo as Timestamp).toDate()
      return dayjs(scheduledTo).isSame(comparator, 'day')
    })
  } catch (error) {
    console.error(error)
    return [] as WithId<Order>[];
  }
} 

export const getScheduledStartTime = (
  scheduledTo?: FieldValue | null, 
  averageCookingTime?: number,
  platformAverageCookingTime?: number,
) => {
  if(!scheduledTo) return null;
  try {
    let preparationTime = averageCookingTime ?? platformAverageCookingTime;
    if (!preparationTime) preparationTime = 0;
    const scheduledToDate = (scheduledTo as Timestamp).toDate();
    const startAt = dayjs(scheduledToDate)
      .subtract(preparationTime, 'second')
      .toDate();
    return startAt;
  } catch (error) {
    console.error(error);
  }
};

export const isScheduledMarginValid = (
  scheduledTo: FieldValue | null, 
) => {
  if(!scheduledTo) return false;
  try {
    const scheduledToDate = (scheduledTo as Timestamp).toDate();
    const now = dayjs().toDate();
    const startAt = dayjs(scheduledToDate)
      .subtract(3600, 'second')
      .toDate();
    return now > startAt;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getDatePlusTime = (
  dateValue?: FieldValue | null, 
  time: number = 3600, 
) => {
  if(!dateValue) return undefined;
  try {
    const date = (dateValue as Timestamp).toDate();
    return dayjs(date)
      .add(time, 'second')
      .toDate();
  } catch (error) {
    console.error(error);
    return undefined;
  }
};