import { Order, WithId } from "@appjusto/types";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

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