import { Order, WithId } from '@appjusto/types';

export const getFoodOrderTotal = (
  order: WithId<Order>,
  isBackoffice?: boolean
) => {
  if (isBackoffice) return order.fare?.total ?? 0;
  let businessValue = order.fare?.business?.value ?? 0;
  if (order.fare?.business?.status === 'partially_refunded') {
    businessValue = order.fare?.business.paid ?? 0;
  }
  if (order.fare?.business?.status === 'canceled') {
    businessValue = 0;
  }
  if (order.outsourcedBy === 'business') {
    let courierValue = order.fare?.courier?.value ?? 0;
    if (order.fare?.courier?.status === 'partially_refunded') {
      courierValue = order.fare?.courier.paid ?? 0;
    }
    if (order.fare?.courier?.status === 'canceled') {
      courierValue = 0;
    }
    businessValue += courierValue;
  }
  return businessValue;
};

export const getOrdersTableTotal = (orders?: WithId<Order>[] | null) => {
  if (!orders) return 0;
  const total = orders.reduce<number>((result, order) => {
    let businessValue = getFoodOrderTotal(order);
    return (result += businessValue);
  }, 0);
  return total;
};
