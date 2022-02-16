import { Order, OrderStatus, WithId } from '@appjusto/types';
//import { FoodOrdersValues } from './OrderApi';

export type OrdersByStatus = { [key: string]: WithId<Order>[] };

export const splitByStatus = (orders: WithId<Order>[], statuses: OrderStatus[]): OrdersByStatus => {
  const result: OrdersByStatus = statuses.reduce((r, status) => ({ ...r, [status]: [] }), {});
  return orders.reduce((result, order) => {
    if (!statuses.includes(order.status)) return result;
    return { ...result, [order.status]: [...result[order.status], order] };
  }, result);
};
