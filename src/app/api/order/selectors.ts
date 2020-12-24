import { Order, WithId } from 'appjusto-types';
import { FoodOrdersValues } from './OrderApi';

type OrdersByStatus = { [key: string]: WithId<Order>[] };

export const splitByStatus = (orders: WithId<Order>[]): OrdersByStatus => {
  const result: OrdersByStatus = FoodOrdersValues.reduce(
    (r, status) => ({ ...r, [status]: [] }),
    {}
  );
  return orders.reduce((result, order) => {
    return { ...result, [order.status]: [...result[order.status], order] };
  }, result);
};
