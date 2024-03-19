import { Order, WithId } from '@appjusto/types';

export const getFoodOrderTotal = (
  order: WithId<Order>,
  isBackoffice?: boolean
) => {
  // backoffice drawer and table items shows total value
  if (isBackoffice) return order.fare?.total ?? 0;
  // business value to display in admin drawer and table items
  let businessValue = order.fare?.business?.value ?? 0;
  // if business coupon
  if (order.coupon?.createdBy.flavor === 'business') {
    businessValue -= order.fare?.discount ?? 0;
  }
  // if outsourced by business it should be added to courier`s value
  if (order.fare?.courier?.payee === 'business') {
    let courierValue = order.fare?.courier?.value ?? 0;
    businessValue += courierValue;
  }
  // return business value to display
  return businessValue;
};
