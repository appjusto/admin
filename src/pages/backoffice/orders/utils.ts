import { Order, WithId } from '@appjusto/types';

export const getFoodOrderTotal = (
  order: WithId<Order>,
  isBackoffice?: boolean
) => {
  // backoffice drawer and table items shows total value
  if (isBackoffice) return order.fare?.total ?? 0;
  // business value to display in admin drawer and table items
  let businessValue = order.fare?.business?.value ?? 0;
  if (order.fare?.business?.paid !== undefined)
    businessValue = order.fare.business.paid;
  // if outsourced by business it should be added to courier`s value
  if (order.outsourcedBy === 'business') {
    let courierValue = order.fare?.courier?.value ?? 0;
    // if (order.fare?.courier?.paid !== undefined) {
    //   courierValue = order.fare?.courier?.paid;
    // }
    businessValue += courierValue;
  }
  // return business value to display
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
