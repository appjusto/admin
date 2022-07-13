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
  scheduledTo: FieldValue | null, 
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